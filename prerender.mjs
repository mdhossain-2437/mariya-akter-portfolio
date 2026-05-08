import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "dist");
const ssrDir = resolve(__dirname, "dist-ssr");

// Per-route SEO map. Mirrors the props on each page's <Seo> component.
//
// We can't rely on Helmet's SSR output here because every non-/ route is
// lazy-loaded — during renderToString we get a Suspense fallback, not the
// actual page tree, so Seo never runs and no title/description is emitted
// in the HTML. To deliver route-specific metadata to crawlers (Google,
// Bing, Twitter / X, FB, LinkedIn) WITHOUT eagerly importing every page
// (which would tank initial bundle size), we statically inject the right
// metadata at prerender time using this map.
//
// Pages still own <Seo> for client-side SPA navigation: when a visitor
// hops from /about to /pricing in the same tab, Helmet updates the head
// to match. The static HTML and the post-hydration Helmet output stay in
// sync because they read from the same set of values (title formatted as
// `${title} — Mariya Akter`, default cover image, etc.).
const SITE = "https://mariyaakter.me";
const DEFAULT_DESC =
  "Mariya Akter — Multidisciplinary designer crafting intentional brand identities, fashion direction, and digital strategy. Studio in Dhaka, clients worldwide.";
const DEFAULT_IMAGE = `${SITE}/og-cover.jpg`;
// Match the formatting used by src/components/Seo.tsx so the static HTML
// and the post-hydration Helmet output stay byte-identical (no flicker
// when React hydrates and Helmet replaces the title).
const FORMAT_TITLE = (t) => {
  if (!t) return "Mariya Akter — Portfolio";
  if (t.toLowerCase().includes("mariya akter")) return t;
  return `${t} — Mariya Akter`;
};

const routeSeo = {
  "/": {
    title: "Mariya Akter — Portfolio",
    description:
      "Multidisciplinary designer crafting intentional brand identities, fashion direction, and digital strategy. Studio in Dhaka, clients worldwide.",
  },
  "/about": {
    title: "Studio",
    description:
      "Inside the operating system of an independent design studio. Story, values, tools, and the principles that anchor the work.",
  },
  "/work": {
    title: "Selected Work",
    description:
      "Selected case studies — brand identity, fashion direction, digital flagship, and editorial design across global houses.",
  },
  "/projects": {
    title: "All Projects",
    description:
      "The full studio catalogue — projects spanning brand identity, fashion direction, editorial design, and digital product across seven years.",
  },
  "/lookbook": {
    title: "Lookbook",
    description:
      "Three chapters of capsule storytelling — Velvet Silence SS24, Aura Digital, and The Weaver's Paradox AW24. Drag, scroll, and look closer.",
  },
  "/archive": {
    title: "Archive",
    description:
      "A comprehensive archive of work spanning seven years of interdisciplinary practice — fashion, digital, and editorial design.",
  },
  "/expertise": {
    title: "Expertise",
    description:
      "Three disciplines, one operating system — brand identity, digital marketing strategy, and creative direction.",
  },
  "/services": {
    title: "Services",
    description:
      "Brand identity, fashion direction, digital flagship, editorial design, and creative direction — what the studio does and how it ships.",
  },
  "/process": {
    title: "Process",
    description:
      "The six movements from listening to tending — how a Mariya Akter Studio engagement unfolds, step by step.",
  },
  "/capabilities": {
    title: "Capabilities",
    description:
      "A heatmap of what the studio does best — brand identity, creative direction, fashion, digital product, motion, editorial, strategy, and performance marketing.",
  },
  "/press": {
    title: "Press & Recognition",
    description:
      "A running list of awards, juries, and editorial features. The work travels farther than the studio does.",
  },
  "/clients": {
    title: "Clients",
    description:
      "A short list of long partnerships — studios, houses, and teams the studio has directed alongside since 2018.",
  },
  "/now": {
    title: "Now",
    description:
      "What Mariya's studio is working on right now — current clients, open inquiries, and the state of the desk.",
  },
  "/faq": {
    title: "FAQ",
    description:
      "Honest answers to the questions that come up before we work together — timelines, fees, revisions, process, and what 'partnership' really means.",
  },
  "/pricing": {
    title: "Pricing & Engagement",
    description:
      "Three engagement tiers — Identity from $8.5k, Studio from $5.5k/month, Flagship from $25k. Honest scope, clear deliverables.",
  },
  "/journal": {
    title: "Journal",
    description:
      "Curated essays on design, fashion, and digital strategy. Where the studio thinks out loud.",
  },
  "/contact": {
    title: "Contact",
    description:
      "Tell us about your project in four short steps. We respond within 48 hours, Monday through Thursday.",
  },
  "/privacy": {
    title: "Privacy",
    description:
      "How the studio collects, uses, and protects personal data. Radical transparency — the same intentionality we bring to our creative work.",
  },
  "/terms": {
    title: "Terms",
    description:
      "Engagement terms — scope, payments, IP, confidentiality, and the rest of the clauses that make a studio engagement feel clean.",
  },
};

const routes = Object.keys(routeSeo);

// Escape attribute and HTML-text values so injected SEO can't break
// the surrounding markup if a description ever contains a quote.
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const buildHelmetTags = (path) => {
  const seo = routeSeo[path] || {};
  const title = FORMAT_TITLE(seo.title);
  const desc = seo.description || DEFAULT_DESC;
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const img = DEFAULT_IMAGE;
  return [
    `<title>${escText(title)}</title>`,
    `<meta name="description" content="${escAttr(desc)}" />`,
    `<link rel="canonical" href="${escAttr(url)}" />`,
    `<meta property="og:title" content="${escAttr(title)}" />`,
    `<meta property="og:description" content="${escAttr(desc)}" />`,
    `<meta property="og:url" content="${escAttr(url)}" />`,
    `<meta property="og:image" content="${escAttr(img)}" />`,
    `<meta name="twitter:title" content="${escAttr(title)}" />`,
    `<meta name="twitter:description" content="${escAttr(desc)}" />`,
    `<meta name="twitter:image" content="${escAttr(img)}" />`,
  ];
};

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
  // they live in the head where the browser expects them. We now prerender
  // each route into its own dist/<route>/index.html, so route-specific
  // canonical / og:url tags are exactly right and we keep them.
  const liftedTags = [];
  const cleanedHtml = stripped.replace(HEAD_TAG_RE, (match) => {
    liftedTags.push(match);
    return "";
  });

  // Lazy-loaded routes don't actually run their <Seo> component during
  // SSR — React resolves the Suspense fallback instead. Inject the
  // route-specific tags from our static map so crawlers see the right
  // title/description/canonical/og even before hydration.
  liftedTags.push(...buildHelmetTags(url));

  // Tag-key helper: identifies duplicates by element kind + the most
  // specific identifier attribute. Title is a singleton; meta tags key
  // off name|property; link tags key off rel for canonical/alternate.
  const tagKey = (tag) => {
    if (/^<title\b/i.test(tag)) return "__title__";
    const m = tag.match(/(?:name|property|rel)=["']([^"']+)["']/i);
    const elName = (tag.match(/^<(\w+)/) || [, "meta"])[1];
    return m ? `${elName}|${m[1]}` : null;
  };

  // Walk Helmet's lifted tags last-write-wins to collapse duplicates
  // emitted by React's render order. This gives us the "winning" tags
  // for the route — title, description, canonical, og:*, twitter:*, etc.
  const winners = new Map();
  const passthrough = [];
  for (const t of liftedTags) {
    const key = tagKey(t);
    if (key) winners.set(key, t);
    else passthrough.push(t);
  }

  // Build the final head by REPLACING any template tag whose key is also
  // owned by Helmet (route wins over default). Tags Helmet didn't touch
  // stay intact. Tags Helmet emitted that the template doesn't have get
  // appended after </head> closes.
  const ownedKeys = new Set(winners.keys());
  let headOriginal = template.match(/<head>([\s\S]*?)<\/head>/)[1];
  const HEAD_KEY_RE = /<title\b[^>]*>[^<]*<\/title>|<(?:meta|link)\b[^>]*>/g;
  headOriginal = headOriginal.replace(HEAD_KEY_RE, (match) => {
    const key = tagKey(match);
    if (key && ownedKeys.has(key)) {
      return winners.get(key);
    }
    return match;
  });

  // Find which winners weren't already represented in the template; those
  // need to be appended.
  const templateKeys = new Set();
  for (const m of (template.match(/<head>([\s\S]*?)<\/head>/)[1].match(HEAD_KEY_RE) || [])) {
    const k = tagKey(m);
    if (k) templateKeys.add(k);
  }
  const appended = [];
  for (const [key, tag] of winners) {
    if (!templateKeys.has(key)) appended.push(tag);
  }
  // Deduplicate passthrough JSON-LD-ish raw tags (rare; usually nothing).
  for (const p of passthrough) {
    if (!appended.includes(p)) appended.push(p);
  }

  // Stamp the root with the route this content was rendered for. Vercel's
  // SPA rewrite still serves dist/index.html for any path that doesn't
  // match a prerendered file, so we keep the client-side hydration path
  // marker — it's a no-op for prerendered routes that match.
  let out = template.replace(
    /<head>([\s\S]*?)<\/head>/,
    `<head>${headOriginal}${appended.length ? "\n    " + appended.join("\n    ") + "\n  " : ""}</head>`,
  );
  out = out.replace(
    '<div id="root"></div>',
    `<div id="root" data-ssr-path="${url}">${cleanedHtml}</div>`,
  );

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
  console.log(`prerendered ${url} -> ${target} (${out.length} bytes, lifted ${winners.size} head tags, appended ${appended.length})`);
}

// Vercel rewrite still serves /index.html for any non-prerendered route.
if (!existsSync(indexHtmlPath)) {
  copyFileSync(join(distDir, "index.html"), indexHtmlPath);
}
