import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import { projects } from "../data/projects";
import { githubRepos, topLanguages } from "../data/githubRepos";
import { unsplashSized, unsplashSrcSet } from "../lib/unsplash";

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

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86400000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default function Projects() {
  const categories = useMemo(
    () => ["All", ...uniq(projects.map((p) => p.category))],
    []
  );
  const years = useMemo(
    () => ["All", ...uniq(projects.map((p) => p.year)).sort((a, b) => b.localeCompare(a))],
    []
  );
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filtered = projects.filter(
    (p) => (category === "All" || p.category === category) && (year === "All" || p.year === year)
  );

  const hasCaseStudy = (slug: string) => projects.find((p) => p.slug === slug)?.challenge != null;

  return (
    <div className="pt-24 md:pt-32 pb-24">
      <Seo
        title="All Projects"
        path="/projects"
        description={`The full studio catalogue — ${projects.length} projects spanning brand identity, fashion direction, editorial design, and digital product across ${years.length - 1} years.`}
      />

      {/* Hero */}
      <section className="container-wide">
        <Reveal>
          <p className="label">Index · {projects.length} projects</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,13vw,12rem)] mt-4 leading-[0.92]">
            The <em className="italic text-accent">studio book</em>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-fg-muted leading-relaxed text-lg">
            Every project the studio has shipped — flagship identities, editorial
            systems, experimental work, and the quiet wins that never made it
            into a press deck. Filter by discipline, by year, or drift
            chronologically.
          </p>
        </Reveal>
      </section>

      {/* Filter bar */}
      <section className="container-wide mt-16 md:mt-20">
        <div className="border-y border-line py-5 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5">
            <span className="label-muted mr-4">Discipline</span>
            <div className="inline-flex flex-wrap gap-x-3 gap-y-2 mt-2 md:mt-0">
              {categories.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`text-sm transition-colors ${
                    category === c ? "text-fg font-semibold" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {c}
                  {i < categories.length - 1 && (
                    <span className="ml-3 text-fg-muted">·</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-5">
            <span className="label-muted mr-4">Year</span>
            <div className="inline-flex flex-wrap gap-3 mt-2 md:mt-0">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`text-sm transition-colors ${
                    year === y ? "text-fg font-semibold" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 md:text-right">
            <div role="group" aria-label="Layout" className="inline-flex gap-2">
              <button
                type="button"
                aria-pressed={layout === "grid"}
                onClick={() => setLayout("grid")}
                className={`text-xs uppercase tracking-[0.2em] px-3 py-1 border rounded-full ${
                  layout === "grid" ? "bg-fg text-bg border-fg" : "text-fg-muted border-line hover:text-fg"
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                aria-pressed={layout === "list"}
                onClick={() => setLayout("list")}
                className={`text-xs uppercase tracking-[0.2em] px-3 py-1 border rounded-full ${
                  layout === "list" ? "bg-fg text-bg border-fg" : "text-fg-muted border-line hover:text-fg"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-fg-muted">
          Showing {filtered.length} of {projects.length} — {category} · {year}
        </p>
      </section>

      {/* Grid */}
      {layout === "grid" ? (
        <section className="container-wide mt-14 md:mt-20" aria-labelledby="studio-book-heading">
          <h2 id="studio-book-heading" className="sr-only">
            Studio book — selected case studies
          </h2>
          {filtered.length === 0 ? (
            <p className="text-center py-24 font-serif italic text-fg-muted">
              No projects match these filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {filtered.map((p, i) => (
                <Link
                  key={p.slug}
                  to={`/work/${p.slug}`}
                  className={`group block ${i % 3 === 1 ? "lg:mt-16" : ""} ${i % 3 === 2 ? "lg:mt-8" : ""}`}
                >
                  <div className="aspect-[4/5] overflow-hidden bg-app-elev">
                    <img
                      src={unsplashSized(p.cover, 800)}
                      srcSet={unsplashSrcSet(p.cover, [400, 600, 800, 1200])}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      alt={p.title}
                      // First card is the LCP candidate on /projects.
                      // Eager + fetchpriority=high so it starts downloading
                      // as soon as the browser sees the markup. Subsequent
                      // cards stay lazy to keep initial bandwidth lean.
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                      decoding="async"
                      width="800"
                      height="1000"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif italic text-xl md:text-2xl text-fg">
                      {p.title}
                    </h3>
                    <span className="label-muted whitespace-nowrap">{p.year}</span>
                  </div>
                  <p className="mt-2 text-sm text-fg-muted">
                    {p.category}
                    {hasCaseStudy(p.slug) && (
                      <span className="ml-3 text-accent">· Case study →</span>
                    )}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="container-narrow mt-14 md:mt-20" aria-labelledby="studio-book-list-heading">
          <h2 id="studio-book-list-heading" className="sr-only">
            Studio book — selected case studies (list view)
          </h2>
          <ol className="border-t border-line">
            {filtered.map((p, i) => (
              <li key={p.slug} className="border-b border-line">
                <Link
                  to={`/work/${p.slug}`}
                  className="grid grid-cols-12 gap-4 items-baseline py-6 md:py-8 group hover:bg-app-elev/50 transition-colors px-2 -mx-2 rounded-sm"
                >
                  <span className="col-span-1 label-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-6 md:col-span-5 font-serif italic text-xl md:text-3xl text-fg group-hover:text-accent transition-colors">
                    {p.title}
                  </span>
                  <span className="col-span-3 md:col-span-3 text-xs uppercase tracking-[0.2em] text-fg-muted">
                    {p.category}
                  </span>
                  <span className="col-span-2 md:col-span-2 text-xs uppercase tracking-[0.2em] text-fg-muted md:text-right">
                    {p.year}
                  </span>
                  <span className="hidden md:block col-span-1 text-right text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* GitHub build log */}
      {githubRepos.length > 0 && (
        <section className="container-wide mt-32 md:mt-40 pt-20 md:pt-28 border-t border-line">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-14 md:mb-20">
            <div className="md:col-span-7">
              <Reveal>
                <p className="label">Build log · live from GitHub</p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-serif text-fg text-[clamp(2rem,7vw,5rem)] leading-[1.05]">
                  Every <em className="italic text-accent">repository</em>,
                  shipped or in&nbsp;flight.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-5">
              <Reveal delay={0.15}>
                <p className="text-fg-muted leading-relaxed">
                  The studio's full code catalogue — pulled directly from{" "}
                  <a
                    href="https://github.com/mdhossain-2437"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    @mdhossain-2437
                  </a>{" "}
                  at build time. {githubRepos.length} repositories spanning{" "}
                  React, Next.js, Node, and the occasional sketch in Python or
                  Kotlin.
                </p>
              </Reveal>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {githubRepos.map((r) => {
              const langs = topLanguages(r, 3);
              const tint = langTint(r.language || "");
              return (
                <li key={r.slug}>
                  <Link
                    to={`/projects/${r.slug}`}
                    className="group flex h-full flex-col rounded-[6px] border border-line bg-app-elev/40 p-6 transition-colors hover:border-accent hover:bg-app-elev"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-xl text-fg leading-snug group-hover:text-accent transition-colors">
                        {r.name}
                      </h3>
                      {r.private && (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-fg-muted border border-line rounded-full px-2 py-0.5">
                          Private
                        </span>
                      )}
                      {r.archived && (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-fg-muted border border-line rounded-full px-2 py-0.5">
                          Archived
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-fg-muted leading-relaxed flex-grow">
                      {r.description ||
                        r.readme_excerpt.slice(0, 140) ||
                        "No description provided."}
                    </p>

                    {langs.length > 0 && (
                      <div
                        className="mt-5 flex h-1 overflow-hidden rounded-full bg-line/40"
                        role="img"
                        aria-label={`Language breakdown: ${langs
                          .map(
                            ([lang, pct]) =>
                              `${lang} ${(pct * 100).toFixed(0)}%`,
                          )
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
                    )}

                    <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-fg-muted">
                      {r.language && (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: tint }}
                            aria-hidden="true"
                          />
                          {r.language}
                        </span>
                      )}
                      {r.stargazers_count > 0 && (
                        <span aria-label={`${r.stargazers_count} stars`}>
                          ★ {r.stargazers_count}
                        </span>
                      )}
                      <span className="ml-auto">{relTime(r.pushed_at)}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Tail CTA */}
      <section className="container-narrow mt-28 md:mt-36 text-center">
        <p className="label-muted">Next chapter</p>
        <h2 className="mt-4 font-serif text-fg text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
          Curious about <em className="italic text-accent">how the work gets made</em>?
        </h2>
        <div className="mt-10 inline-flex flex-wrap justify-center gap-4">
          <Link
            to="/process"
            className="px-7 py-4 rounded-full border border-fg/40 text-fg hover:bg-fg hover:text-bg transition-colors"
          >
            Read the process
          </Link>
          <Link
            to="/contact"
            className="px-7 py-4 rounded-full bg-accent text-cream-100 hover:bg-accent/90 transition-colors"
          >
            Start a project
          </Link>
        </div>
      </section>
    </div>
  );
}
