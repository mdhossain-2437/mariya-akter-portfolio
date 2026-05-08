import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build as esbuild } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "dist");
const ssrDir = resolve(__dirname, "dist-ssr");

// Bundle a TS data module into a temp JS file, import it, return the
// named exports. Used to load src/data/journal.ts and src/data/projects.ts
// from this .mjs script without baking a long-lived extractor build step.
async function loadTsModule(srcRelPath) {
  const absIn = resolve(__dirname, srcRelPath);
  const absOut = resolve(__dirname, ".prerender-cache", srcRelPath.replace(/\.ts$/, ".mjs").replace(/\//g, "_"));
  mkdirSync(dirname(absOut), { recursive: true });
  await esbuild({
    entryPoints: [absIn],
    bundle: false,
    format: "esm",
    platform: "node",
    target: "node20",
    outfile: absOut,
    logLevel: "silent",
  });
  return await import(pathToFileURL(absOut).href);
}

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

// Pull dynamic slugs from the data modules and mint route entries on
// top of the static map. Each case study, journal entry, and GitHub
// repo gets its own dist/<path>/index.html with route-specific meta so
// crawlers and social unfurls see the right preview for every page.
const { journalPosts } = await loadTsModule("src/data/journal.ts");
const { projects } = await loadTsModule("src/data/projects.ts");

const githubRepos = JSON.parse(
  readFileSync(resolve(__dirname, "src/data/github-repos.json"), "utf8"),
);

for (const post of journalPosts) {
  routeSeo[`/journal/${post.slug}`] = {
    title: post.title,
    description: post.excerpt,
    image: post.cover,
  };
}

for (const project of projects) {
  routeSeo[`/work/${project.slug}`] = {
    title: project.title,
    description: project.blurb || project.description || `${project.title} — a ${project.category} project by Mariya Akter.`,
    image: project.cover,
  };
}

for (const repo of githubRepos) {
  const slug = repo.slug || repo.name;
  if (!slug) continue;
  const desc = repo.description
    ? repo.description
    : `${repo.name} — ${repo.language || "source"} project by Mariya Akter.`;
  routeSeo[`/projects/${slug}`] = {
    title: repo.name,
    description: desc,
  };
}

const routes = Object.keys(routeSeo);

// Escape attribute and HTML-text values so injected SEO can't break
// the surrounding markup if a description ever contains a quote.
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// External image URLs (Unsplash) aren't appropriate as <meta property="og:image">
// because LinkedIn / X / FB need a fixed-size hosted image. Fall back to the
// self-hosted OG cover unless the image is one we serve from the same origin.
const safeOgImage = (maybeImg) => {
  if (!maybeImg) return DEFAULT_IMAGE;
  if (maybeImg.startsWith("/")) return `${SITE}${maybeImg}`;
  if (maybeImg.startsWith(`${SITE}/`)) return maybeImg;
  return DEFAULT_IMAGE;
};

const buildHelmetTags = (path) => {
  const seo = routeSeo[path] || {};
  const title = FORMAT_TITLE(seo.title);
  const desc = seo.description || DEFAULT_DESC;
  const url = `${SITE}${path === "/" ? "/" : path}`;
  const img = safeOgImage(seo.image);
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

// Regenerate sitemap.xml from the full route list so every page we
// actually prerender is discoverable by search engines. Static routes
// and dynamic slug routes all make it in. Home + About keep their
// <image:image> entries for the portrait.
const today = new Date().toISOString().slice(0, 10);
const priorityFor = (path) => {
  if (path === "/") return "1.0";
  if (/^\/(about|work|projects|lookbook|services|contact)$/.test(path)) return "0.9";
  if (/^\/(process|capabilities|journal|pricing)$/.test(path)) return "0.8";
  if (/^\/(clients|press|now|faq|archive|expertise)$/.test(path)) return "0.7";
  if (/^\/(privacy|terms)$/.test(path)) return "0.3";
  if (path.startsWith("/work/") || path.startsWith("/journal/")) return "0.7";
  if (path.startsWith("/projects/")) return "0.5";
  return "0.6";
};
const changefreqFor = (path) => {
  if (path === "/") return "monthly";
  if (path === "/projects" || path === "/journal" || path === "/now") return "weekly";
  if (/^\/(privacy|terms)$/.test(path)) return "yearly";
  return "monthly";
};
const extraImage = (path) => {
  if (path === "/") {
    return [
      `    <image:image>`,
      `      <image:loc>${SITE}/images/mariya-akter-portrait.jpg</image:loc>`,
      `      <image:title>Mariya Akter — Multidisciplinary Designer</image:title>`,
      `      <image:caption>Mariya Akter, multidisciplinary designer based in Dhaka, Bangladesh. Brand identity, fashion direction, and digital strategy.</image:caption>`,
      `      <image:license>${SITE}/</image:license>`,
      `    </image:image>`,
      `    <image:image>`,
      `      <image:loc>${SITE}/og-cover.jpg</image:loc>`,
      `      <image:title>Mariya Akter — Portfolio cover</image:title>`,
      `      <image:caption>Mariya Akter — multidisciplinary designer. Studio in Dhaka, clients worldwide.</image:caption>`,
      `    </image:image>`,
    ].join("\n");
  }
  if (path === "/about") {
    return [
      `    <image:image>`,
      `      <image:loc>${SITE}/images/mariya-akter-portrait.jpg</image:loc>`,
      `      <image:title>Mariya Akter — Studio portrait</image:title>`,
      `      <image:caption>Mariya Akter, founder and creative director, in studio.</image:caption>`,
      `    </image:image>`,
    ].join("\n");
  }
  return "";
};

const sitemapEntries = routes.map((path) => {
  const loc = `${SITE}${path === "/" ? "/" : path}`;
  const image = extraImage(path);
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreqFor(path)}</changefreq>`,
    `    <priority>${priorityFor(path)}</priority>`,
    image,
    `  </url>`,
  ].filter(Boolean).join("\n");
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>
`;

writeFileSync(join(distDir, "sitemap.xml"), sitemap);
console.log(`generated sitemap.xml with ${routes.length} entries`);
