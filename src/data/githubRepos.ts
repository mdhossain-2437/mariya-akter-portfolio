// Wrapper around the build-generated github-repos.json snapshot. The JSON
// is written at build time by `scripts/fetch-github-repos.mjs` (run via the
// `prebuild` hook). When the token is missing or the build is offline, the
// file resolves to `[]` and the UI falls back to the curated case studies.

import raw from "./github-repos.json";

export type GithubRepo = {
  slug: string;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  homepage: string;
  html_url: string;
  language: string;
  languages: Record<string, number>;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  size: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  updated_at: string;
  default_branch: string;
  has_readme: boolean;
  readme_excerpt: string;
};

const all = raw as GithubRepo[];

// Sort by most recently pushed; pin pinned topics first.
const PINNED = new Set<string>(["portfolio", "showcase", "production"]);

export const githubRepos: GithubRepo[] = [...all].sort((a, b) => {
  const aPinned = a.topics.some((t) => PINNED.has(t));
  const bPinned = b.topics.some((t) => PINNED.has(t));
  if (aPinned !== bPinned) return aPinned ? -1 : 1;
  return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
});

export function findRepo(slug: string): GithubRepo | undefined {
  return githubRepos.find((r) => r.slug === slug);
}

export function topLanguages(repo: GithubRepo, limit = 4): Array<[string, number]> {
  const total = Object.values(repo.languages || {}).reduce((s, n) => s + n, 0);
  if (!total) return [];
  return Object.entries(repo.languages)
    .map(([lang, bytes]) => [lang, bytes / total] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
