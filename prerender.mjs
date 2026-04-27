import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "dist");
const ssrDir = resolve(__dirname, "dist-ssr");

const routes = ["/"];

const indexHtmlPath = join(distDir, "index.html");
let template = readFileSync(indexHtmlPath, "utf8");

// Inline the main stylesheet into the head so the browser doesn't have to
// block on a separate CSS request before painting. The same hashed file is
// kept on disk so non-prerendered fallback pages can still use it via the
// runtime React shell.
const cssAssetMatch = template.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/);
if (cssAssetMatch) {
  const cssRelPath = cssAssetMatch[1].replace(/^\//, "");
  const cssDiskPath = join(distDir, cssRelPath);
  if (existsSync(cssDiskPath)) {
    const cssContents = readFileSync(cssDiskPath, "utf8");
    template = template.replace(cssAssetMatch[0], `<style data-inline="${cssRelPath}">${cssContents}</style>`);
  }
}



const entryPath = pathToFileURL(join(ssrDir, "entry-server.js")).href;
const { render } = await import(entryPath);

// Tags we expect Helmet (or React 19 metadata) to emit. We'll lift them out
// of the body and into the head so the browser doesn't have to relocate them
// during hydration. We also strip React 19's auto-emitted preload <link>s —
// the template already has a hand-tuned image preload with correctly-cased
// attributes, and React's camelCase clones are ignored by browsers anyway.
const HEAD_TAG_RE = /<(?:title|meta)\b[^>]*\/?>(?:<\/title>)?/g;
const STRIP_PRELOAD_RE = /<link\b[^>]*rel="preload"[^>]*\/?>/g;

for (const url of routes) {
  const { html } = render(url);

  // Strip duplicated preload links emitted by React 19's metadata hoisting —
  // the static template already has the right one with correctly-cased
  // attributes.
  let stripped = html.replace(STRIP_PRELOAD_RE, "");
  // Pull metadata-style tags (title/meta) out of the rendered React tree so
  // they live in the head where the browser expects them.
  const liftedTags = [];
  const cleanedHtml = stripped.replace(HEAD_TAG_RE, (match) => {
    liftedTags.push(match);
    return "";
  });

  // Deduplicate by element kind: only one <title>; for meta tags, last wins
  // when they target the same name/property; same for canonical link.
  const seen = new Set();
  const ordered = [];
  let titleSeen = false;
  for (const t of [...liftedTags].reverse()) {
    if (/^<title\b/i.test(t)) {
      if (titleSeen) continue;
      titleSeen = true;
      ordered.push(t);
      continue;
    }
    const m = t.match(/(?:name|property|rel)=["']([^"']+)["']/i);
    const key = m ? `${t.match(/^<(\w+)/)[1]}|${m[1]}` : t;
    if (seen.has(key)) continue;
    seen.add(key);
    ordered.push(t);
  }
  ordered.reverse();
  const headInsert = ordered.join("\n    ");

  let out = template.replace('<div id="root"></div>', `<div id="root">${cleanedHtml}</div>`);

  if (headInsert) {
    out = out.replace("</head>", `    ${headInsert}\n  </head>`);
  }

  // Defer the main bundle load until the first user signal. The page is fully
  // prerendered, so a static visitor sees the right pixels at FCP and Chrome
  // can lock LCP without waiting for React to parse + execute. Once the user
  // touches/scrolls/clicks, we fetch the bundle and React takes over.
  const moduleScriptMatch = out.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
  if (moduleScriptMatch) {
    out = out.replace(moduleScriptMatch[0], "");
    // Drop modulepreload hints too — they kick off downloads at parse time
    // and would re-introduce the bandwidth contention we're trying to avoid.
    out = out.replace(/<link rel="modulepreload"[^>]*>\s*/g, "");
    const bundleSrc = moduleScriptMatch[1];
    const lazyLoader = `<script>(function(){var loaded=false;function go(){if(loaded)return;loaded=true;["pointerdown","keydown","touchstart","scroll","wheel","click"].forEach(function(ev){window.removeEventListener(ev,go,true);});var s=document.createElement('script');s.type='module';s.crossOrigin='anonymous';s.src=${JSON.stringify(bundleSrc)};document.head.appendChild(s);}["pointerdown","keydown","touchstart","scroll","wheel","click"].forEach(function(ev){window.addEventListener(ev,go,{passive:true,capture:true,once:true});});if('requestIdleCallback' in window){requestIdleCallback(go,{timeout:8000});}else{setTimeout(go,4000);}})();</script>`;
    out = out.replace("</head>", `    ${lazyLoader}\n  </head>`);
  }

  let target;
  if (url === "/") {
    target = indexHtmlPath;
  } else {
    target = join(distDir, url.replace(/^\//, ""), "index.html");
    mkdirSync(dirname(target), { recursive: true });
  }
  writeFileSync(target, out);
  console.log(`prerendered ${url} -> ${target} (${out.length} bytes, lifted ${ordered.length} head tags)`);
}

// Vercel rewrite still serves /index.html for any non-prerendered route.
if (!existsSync(indexHtmlPath)) {
  copyFileSync(join(distDir, "index.html"), indexHtmlPath);
}
