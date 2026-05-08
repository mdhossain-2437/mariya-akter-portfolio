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
//
// We strip preload links FIRST, then lift the remaining title / meta / link
// tags. This way `<link rel="canonical">`, alternates, etc. emitted by
// Helmet get hoisted to <head> instead of being stranded in <body>.
const STRIP_PRELOAD_RE = /<link\b[^>]*rel="preload"[^>]*\/?>/g;
// Match a complete <title>…</title> pair (with arbitrary inner text) OR a
// self-closing / void <meta> / <link> tag. The previous regex only matched
// the opening <title> (with optional immediate close), which left titles
// containing content stranded as `Some text</title>` in the body.
const HEAD_TAG_RE = /<title\b[^>]*>[^<]*<\/title>|<(?:meta|link)\b[^>]*\/?>/g;

for (const url of routes) {
  const { html } = render(url);

  // Strip duplicated preload links emitted by React 19's metadata hoisting —
  // the static template already has the right one with correctly-cased
  // attributes.
  let stripped = html.replace(STRIP_PRELOAD_RE, "");
  // Pull metadata-style tags (title/meta) out of the rendered React tree so
  // they live in the head where the browser expects them. We *intentionally
  // drop* per-route canonical and og:url — Vercel's SPA fallback serves this
  // same prerender for every path, so route-specific URLs would create
  // "Multiple conflicting URLs" canonicals on non-/ routes. The baseline
  // injection script in index.html supplies a path-aware canonical for
  // pre-hydration audits, and Helmet re-adds the route-correct one once
  // React hydrates.
  const liftedTags = [];
  const cleanedHtml = stripped.replace(HEAD_TAG_RE, (match) => {
    if (/^<link\b[^>]*rel=["']canonical["']/i.test(match)) return "";
    if (/^<meta\b[^>]*property=["']og:url["']/i.test(match)) return "";
    liftedTags.push(match);
    return "";
  });

  // Pre-seed the dedup set with whatever tags the static template's <head>
  // already ships. Helmet often re-emits the same title / canonical / OG
  // tags that the template hand-codes, and we don't want duplicate
  // canonicals or twin og:title nodes in the final head.
  const seen = new Set();
  const headOriginal = (template.match(/<head>([\s\S]*?)<\/head>/) || [, ""])[1];
  const HEAD_KEY_RE = /<(?:title|meta|link)\b[^>]*>/g;
  for (const tag of headOriginal.match(HEAD_KEY_RE) || []) {
    if (/^<title\b/i.test(tag)) {
      seen.add("__title__");
      continue;
    }
    const m = tag.match(/(?:name|property|rel)=["']([^"']+)["']/i);
    if (!m) continue;
    const elName = (tag.match(/^<(\w+)/) || [, "meta"])[1];
    seen.add(`${elName}|${m[1]}`);
  }

  // Deduplicate the lifted tags by element kind: only one <title>; for meta
  // tags last-wins when they target the same name/property; same for
  // canonical / alternate links. We walk in reverse so later writes override
  // earlier ones (matching React tree-walk order).
  const ordered = [];
  for (const t of [...liftedTags].reverse()) {
    if (/^<title\b/i.test(t)) {
      if (seen.has("__title__")) continue;
      seen.add("__title__");
      ordered.push(t);
      continue;
    }
    const m = t.match(/(?:name|property|rel)=["']([^"']+)["']/i);
    const elName = (t.match(/^<(\w+)/) || [, "meta"])[1];
    const key = m ? `${elName}|${m[1]}` : t;
    if (seen.has(key)) continue;
    seen.add(key);
    ordered.push(t);
  }
  ordered.reverse();
  const headInsert = ordered.join("\n    ");

  // Stamp the root with the route this content was rendered for. Vercel's
  // SPA rewrite serves dist/index.html for every path, so we need a runtime
  // marker the client can compare against window.location.pathname before
  // attempting to hydrate — otherwise React would try to reconcile e.g. the
  // /about component tree against home-page DOM.
  let out = template.replace(
    '<div id="root"></div>',
    `<div id="root" data-ssr-path="${url}">${cleanedHtml}</div>`,
  );

  if (headInsert) {
    out = out.replace("</head>", `    ${headInsert}\n  </head>`);
  }

  // Defer the main bundle load until the first user signal. The page is fully
  // prerendered, so a static visitor sees the right pixels at FCP and Chrome
  // can lock LCP without waiting for React to parse + execute. Once the user
  // touches/scrolls/clicks, we fetch the bundle and React takes over.
  //
  // IMPORTANT: Vercel's SPA rewrite serves this same HTML for every route.
  // If the visitor lands on a non-prerendered path (e.g. /about), the lazy
  // loader needs to fire IMMEDIATELY so React can clear the wrong markup
  // and render the right page — otherwise the visitor would stare at home
  // content until they happened to scroll or click. We detect that case in
  // the loader by comparing window.location.pathname against the route
  // stamped onto #root.
  const moduleScriptMatch = out.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
  if (moduleScriptMatch) {
    out = out.replace(moduleScriptMatch[0], "");
    // Drop modulepreload hints too — they kick off downloads at parse time
    // and would re-introduce the bandwidth contention we're trying to avoid.
    out = out.replace(/<link rel="modulepreload"[^>]*>\s*/g, "");
    const bundleSrc = moduleScriptMatch[1];
    const lazyLoader = `<script>(function(){var loaded=false;function go(){if(loaded)return;loaded=true;["pointerdown","keydown","touchstart","scroll","wheel","click"].forEach(function(ev){window.removeEventListener(ev,go,true);});var s=document.createElement('script');s.type='module';s.crossOrigin='anonymous';s.src=${JSON.stringify(bundleSrc)};document.head.appendChild(s);}function load(){var root=document.getElementById('root');var ssrPath=root&&root.getAttribute('data-ssr-path');if(ssrPath&&ssrPath!==location.pathname){if(root)root.innerHTML='';go();return;}["pointerdown","keydown","touchstart","scroll","wheel","click"].forEach(function(ev){window.addEventListener(ev,go,{passive:true,capture:true,once:true});});if('requestIdleCallback' in window){requestIdleCallback(go,{timeout:8000});}else{setTimeout(go,4000);}}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',load);}else{load();}})();</script>`;
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
