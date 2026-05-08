import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import { findRepo, githubRepos, topLanguages } from "../data/githubRepos";

const LANG_TINT: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  PHP: "#777BB4",
  Ruby: "#701516",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
};

function langTint(lang: string): string {
  return LANG_TINT[lang] || "#8a8680";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Extremely small markdown renderer — handles headings, lists, code fences,
// inline code, links, bold/italic, and paragraphs. Good enough for a
// readable case-study excerpt; we deliberately don't pull a full md
// library to keep the route bundle slim.
function renderMarkdown(md: string): string {
  if (!md) return "";
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inCode = false;
  let listType: "ul" | "ol" | null = null;
  let paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length === 0) return;
    let text = paraBuf.join(" ").trim();
    if (!text) {
      paraBuf = [];
      return;
    }
    text = escape(text);
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, ""); // strip images
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-underline">$1</a>',
    );
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
    out.push(`<p>${text}</p>`);
    paraBuf = [];
  };

  const flushList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^```/.test(line)) {
      flushPara();
      flushList();
      if (!inCode) {
        inCode = true;
        const codeLang = line.slice(3).trim();
        out.push(`<pre data-lang="${escape(codeLang)}"><code>`);
      } else {
        inCode = false;
        out.push("</code></pre>");
      }
      continue;
    }

    if (inCode) {
      out.push(escape(raw));
      continue;
    }

    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = Math.min(heading[1].length + 1, 6);
      out.push(`<h${level}>${escape(heading[2])}</h${level}>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      flushPara();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
        out.push("<ul>");
      }
      const item = line.replace(/^[-*]\s+/, "");
      const escaped = escape(item)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-underline">$1</a>',
        )
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      out.push(`<li>${escaped}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushPara();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
        out.push("<ol>");
      }
      const item = line.replace(/^\d+\.\s+/, "");
      const escaped = escape(item)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-underline">$1</a>',
        );
      out.push(`<li>${escaped}</li>`);
      continue;
    }

    // Plain prose line — close any open list first so paragraphs don't
    // end up nested inside a <ul>/<ol> (which fails axe's "list" rule).
    flushList();
    paraBuf.push(line);
  }

  flushPara();
  flushList();
  if (inCode) out.push("</code></pre>");

  return out.join("\n");
}

export default function RepoDetail() {
  const { slug } = useParams();
  const repo = slug ? findRepo(slug) : undefined;

  // README lives as a static asset under /repos/<slug>.md so it doesn't bloat
  // the bundled JS. Fetch on demand once we know the slug exists. Track the
  // slug we last loaded so we can reset state purely from props on change.
  const [loaded, setLoaded] = useState<{
    slug: string;
    text: string | null;
    status: "loading" | "ready" | "missing";
  } | null>(null);

  const targetSlug = repo?.has_readme ? repo.slug : null;
  const readmeStatus: "idle" | "loading" | "ready" | "missing" = !repo
    ? "idle"
    : !repo.has_readme
      ? "missing"
      : loaded?.slug === repo.slug
        ? loaded.status
        : "loading";
  const readme = loaded?.slug === repo?.slug ? loaded?.text ?? null : null;

  useEffect(() => {
    if (!targetSlug) return;
    let cancelled = false;
    fetch(`/repos/${targetSlug}.md`, { cache: "force-cache" })
      .then((r) => (r.ok ? r.text() : ""))
      .then((text) => {
        if (cancelled) return;
        setLoaded({
          slug: targetSlug,
          text: text || null,
          status: text ? "ready" : "missing",
        });
      })
      .catch(() => {
        if (cancelled) return;
        setLoaded({ slug: targetSlug, text: null, status: "missing" });
      });
    return () => {
      cancelled = true;
    };
  }, [targetSlug]);

  const renderedReadme = useMemo(
    () => (readme ? renderMarkdown(readme) : ""),
    [readme],
  );

  const langs = useMemo(() => (repo ? topLanguages(repo, 6) : []), [repo]);

  if (!repo) {
    return (
      <div className="pt-32 pb-32 container-narrow text-center">
        <Seo
          title="Project not found"
          path={`/projects/${slug ?? ""}`}
          description="The requested repository could not be found."
        />
        <p className="label-muted">404 · Repository</p>
        <h1 className="mt-4 font-serif text-fg text-[clamp(2rem,7vw,4.5rem)] leading-[1.05]">
          That <em className="italic text-accent">repo</em> isn't in the build
          log.
        </h1>
        <p className="mt-6 text-fg-muted">
          It might have been renamed, archived, or made private after the last
          deploy.
        </p>
        <Link
          to="/projects"
          className="mt-10 inline-flex px-7 py-4 rounded-full border border-fg/40 hover:bg-fg hover:text-bg transition-colors"
        >
          Back to all projects
        </Link>
      </div>
    );
  }

  // Find adjacent repos for prev/next nav
  const idx = githubRepos.findIndex((r) => r.slug === repo.slug);
  const prev = idx > 0 ? githubRepos[idx - 1] : undefined;
  const next = idx < githubRepos.length - 1 ? githubRepos[idx + 1] : undefined;

  return (
    <div className="pt-24 md:pt-32 pb-24">
      <Seo
        title={`${repo.name} — Build log`}
        path={`/projects/${repo.slug}`}
        description={
          repo.description ||
          repo.readme_excerpt.slice(0, 160) ||
          `${repo.name} — repository case file from the studio's GitHub catalogue.`
        }
      />

      {/* Crumb */}
      <section className="container-wide">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-fg-muted">
          <Link to="/projects" className="hover:text-fg transition-colors">
            ← Build log
          </Link>
          <span>·</span>
          <span>{repo.full_name}</span>
        </div>
      </section>

      {/* Hero */}
      <section className="container-wide mt-10 md:mt-14">
        <Reveal>
          <p className="label">Repository case file</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(2.4rem,9vw,8rem)] mt-4 leading-[0.95]">
            {repo.name}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-fg-muted leading-relaxed text-lg">
            {repo.description ||
              "No public description — see the README excerpt below for context."}
          </p>
        </Reveal>
      </section>

      {/* Meta strip */}
      <section className="container-wide mt-14 md:mt-20">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 border-t border-b border-line py-8">
          <div>
            <dt className="label-muted">Visibility</dt>
            <dd className="mt-2 font-serif text-lg text-fg">
              {repo.private ? "Private" : "Public"}
              {repo.archived && " · Archived"}
            </dd>
          </div>
          <div>
            <dt className="label-muted">Primary language</dt>
            <dd className="mt-2 font-serif text-lg text-fg flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: langTint(repo.language || "") }}
                aria-hidden="true"
              />
              {repo.language || "—"}
            </dd>
          </div>
          <div>
            <dt className="label-muted">Last pushed</dt>
            <dd className="mt-2 font-serif text-lg text-fg">
              {fmtDate(repo.pushed_at)}
            </dd>
          </div>
          <div>
            <dt className="label-muted">Stars · Forks</dt>
            <dd className="mt-2 font-serif text-lg text-fg">
              ★ {repo.stargazers_count} · ⑂ {repo.forks_count}
            </dd>
          </div>
        </dl>
      </section>

      {/* Language breakdown */}
      {langs.length > 0 && (
        <section className="container-wide mt-14 md:mt-20">
          <p className="label-muted">Language breakdown</p>
          <div
            className="mt-4 flex h-2 overflow-hidden rounded-full bg-line/40"
            role="img"
            aria-label={`Language breakdown: ${langs
              .map(([lang, pct]) => `${lang} ${(pct * 100).toFixed(0)}%`)
              .join(", ")}`}
          >
            {langs.map(([lang, pct]) => (
              <span
                key={lang}
                style={{
                  width: `${(pct * 100).toFixed(1)}%`,
                  background: langTint(lang),
                }}
              />
            ))}
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm text-fg-muted">
            {langs.map(([lang, pct]) => (
              <li key={lang} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: langTint(lang) }}
                  aria-hidden="true"
                />
                <span className="text-fg">{lang}</span>
                <span>{(pct * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Topics + links */}
      {(repo.topics.length > 0 || repo.homepage) && (
        <section className="container-wide mt-14 md:mt-20 grid md:grid-cols-12 gap-10">
          {repo.topics.length > 0 && (
            <div className="md:col-span-7">
              <p className="label-muted">Topics</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {repo.topics.map((t) => (
                  <li
                    key={t}
                    className="text-xs uppercase tracking-[0.18em] text-fg-muted border border-line rounded-full px-3 py-1.5"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {repo.homepage && (
            <div className="md:col-span-5">
              <p className="label-muted">Live deployment</p>
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-serif italic text-2xl text-fg hover:text-accent transition-colors break-all"
              >
                {repo.homepage} ↗
              </a>
            </div>
          )}
        </section>
      )}

      {/* README */}
      {repo.has_readme && (
        <section className="container-narrow mt-20 md:mt-28">
          <p className="label-muted">README</p>
          {readmeStatus === "loading" && (
            <p className="mt-6 text-fg-muted italic">Loading README…</p>
          )}
          {readmeStatus === "ready" && (
            <article
              className="repo-readme mt-6"
              dangerouslySetInnerHTML={{ __html: renderedReadme }}
            />
          )}
          {readmeStatus === "missing" && (
            <p className="mt-6 text-fg-muted italic">
              README couldn't be loaded — try the source link below.
            </p>
          )}
        </section>
      )}

      {/* CTA — view on GitHub */}
      <section className="container-narrow mt-20 md:mt-28 text-center">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-fg text-bg hover:bg-accent hover:text-cream-100 transition-colors"
        >
          View source on GitHub
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 17L17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      {/* Prev/Next */}
      <section className="container-wide mt-24 md:mt-32 pt-12 border-t border-line grid md:grid-cols-2 gap-8">
        {prev ? (
          <Link
            to={`/projects/${prev.slug}`}
            className="group block text-left"
          >
            <p className="label-muted">← Previous</p>
            <p className="mt-2 font-serif italic text-2xl md:text-3xl text-fg group-hover:text-accent transition-colors">
              {prev.name}
            </p>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <Link
            to={`/projects/${next.slug}`}
            className="group block text-right"
          >
            <p className="label-muted">Next →</p>
            <p className="mt-2 font-serif italic text-2xl md:text-3xl text-fg group-hover:text-accent transition-colors">
              {next.name}
            </p>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </section>
    </div>
  );
}
