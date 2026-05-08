#!/usr/bin/env node
// Build-time fetcher: pulls every repo (public + private) for the configured
// GitHub user and writes a snapshot to src/data/github-repos.json. Runs as
// part of `npm run build` so the prerendered HTML can include the live
// catalogue without paying a runtime API call.
//
// The fetcher is *resilient* — if the token is missing or the API rate
// limit is hit, it logs a warning and writes an empty array so the build
// never fails. The Projects page then falls back to the curated case
// studies from src/data/projects.ts.

import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Lightweight index — bundled with the JS and used by both /projects and the
// RepoDetail page header. No READMEs here so the bundle stays small.
const outPath = resolve(__dirname, "..", "src", "data", "github-repos.json");
// README contents — written as static assets that RepoDetail fetches on
// demand. This keeps the 700kB-ish of raw markdown out of the initial JS
// bundle while still letting us pre-render cleanly at build time.
const readmeDir = resolve(__dirname, "..", "public", "repos");

const USERNAME = process.env.GITHUB_PORTFOLIO_USER || "mdhossain-2437";
const TOKEN =
  process.env.GITHUB_PERSONAL_ACCESS_TOKEN ||
  process.env.GITHUB_TOKEN ||
  process.env.GH_TOKEN ||
  "";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "mariya-portfolio-build",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function fetchAllRepos() {
  // /user/repos returns BOTH public and private repos when authenticated as
  // the user. /users/:user/repos only returns public ones. We try the
  // authenticated path first and fall back to public if the token is
  // missing or unauthorized.
  const params = new URLSearchParams({
    per_page: "100",
    sort: "updated",
    direction: "desc",
    affiliation: "owner",
  });

  if (TOKEN) {
    try {
      const all = [];
      for (let page = 1; page <= 5; page++) {
        const batch = await gh(`/user/repos?${params}&page=${page}`);
        if (!batch.length) break;
        // Filter to repos owned by the configured user (in case the token
        // belongs to an account with collaborator access on other orgs).
        const owned = batch.filter((r) => r.owner?.login === USERNAME);
        all.push(...owned);
        if (batch.length < 100) break;
      }
      return all;
    } catch (err) {
      console.warn(`[github-repos] authenticated fetch failed: ${err.message}`);
      // fall through to public path
    }
  }

  const all = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await gh(`/users/${USERNAME}/repos?${params}&page=${page}`);
    if (!batch.length) break;
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

async function fetchReadme(name) {
  try {
    const data = await gh(`/repos/${USERNAME}/${name}/readme`);
    if (!data?.content) return null;
    const buf = Buffer.from(data.content, data.encoding || "base64");
    return buf.toString("utf8");
  } catch {
    return null;
  }
}

async function fetchLanguages(name) {
  try {
    return await gh(`/repos/${USERNAME}/${name}/languages`);
  } catch {
    return null;
  }
}

function pickReadmeExcerpt(md) {
  if (!md) return "";
  // Strip front-matter, code fences, badges, headings (#); pull the first
  // ~3 prose lines as a description excerpt for the listing card.
  const cleaned = md
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/^\s*#+\s+.*$/gm, "") // headings
    .replace(/<[^>]+>/g, "") // raw html
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  return cleaned.slice(0, 4).join(" ").slice(0, 500);
}

(async () => {
  if (!TOKEN) {
    console.warn(
      "[github-repos] No GITHUB_PERSONAL_ACCESS_TOKEN/GITHUB_TOKEN found — falling back to public-only data. Private repos will be skipped.",
    );
  }

  let repos;
  try {
    repos = await fetchAllRepos();
  } catch (err) {
    console.warn(`[github-repos] could not fetch repos: ${err.message}`);
    repos = [];
  }

  console.log(`[github-repos] fetched ${repos.length} repos for ${USERNAME}`);

  // Reset the readme dir so removed repos don't leave stale files behind.
  try {
    rmSync(readmeDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  mkdirSync(readmeDir, { recursive: true });

  const enriched = [];
  for (const r of repos) {
    // Skip forks unless they have meaningful work on top.
    if (r.fork && !(r.size > 0 && r.stargazers_count > 0)) continue;
    const [readme, langs] = await Promise.all([
      fetchReadme(r.name),
      fetchLanguages(r.name),
    ]);
    if (readme) {
      // Write each README as its own static asset so it can be lazy-fetched
      // by the RepoDetail page from same-origin (CDN-cached, no GitHub
      // rate-limit at runtime).
      writeFileSync(
        join(readmeDir, `${r.name}.md`),
        readme,
      );
    }
    enriched.push({
      slug: r.name,
      name: r.name,
      full_name: r.full_name,
      description: r.description || "",
      private: !!r.private,
      fork: !!r.fork,
      archived: !!r.archived,
      homepage: r.homepage || "",
      html_url: r.html_url,
      language: r.language || "",
      languages: langs || {},
      stargazers_count: r.stargazers_count || 0,
      watchers_count: r.watchers_count || 0,
      forks_count: r.forks_count || 0,
      size: r.size || 0,
      topics: r.topics || [],
      pushed_at: r.pushed_at,
      created_at: r.created_at,
      updated_at: r.updated_at,
      default_branch: r.default_branch || "main",
      has_readme: !!readme,
      readme_excerpt: pickReadmeExcerpt(readme || ""),
    });
  }

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(enriched, null, 2) + "\n");
  console.log(
    `[github-repos] wrote ${enriched.length} entries → ${outPath} (READMEs in public/repos/)`,
  );
})().catch((err) => {
  console.error("[github-repos] unexpected error:", err);
  // Always write a stub so the build succeeds.
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, "[]\n");
  process.exit(0);
});
