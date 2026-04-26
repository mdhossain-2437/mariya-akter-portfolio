import { Link } from "react-router-dom";
import { projects } from "../data/projects";

const GRID = [
  { slug: "the-weavers-paradox", aspect: "aspect-[3/4]", span: "md:col-span-7" },
  { slug: "aura-chronos", aspect: "aspect-square", span: "md:col-span-5 md:mt-32" },
  { slug: "metamorphosis", aspect: "aspect-[3/4]", span: "md:col-span-4" },
  { slug: "vogue-atelier", aspect: "aspect-[16/10]", span: "md:col-span-8 md:mt-24" },
  { slug: "future-of-retail", aspect: "aspect-[16/9]", span: "md:col-span-12" },
];

export default function Work() {
  const lookup = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const featured = projects.find((p) => p.slug === "future-of-retail")!;

  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-20 md:mb-28">
          <div className="lg:col-span-8 fade-up">
            <h1 className="font-serif text-fg leading-[1] text-[clamp(2.6rem,7.5vw,5.6rem)]">
              Curating <em className="text-accent">visual narratives</em>
              <br /> across fashion and digital realms.
            </h1>
          </div>
          <div className="lg:col-span-4 fade-up-delay-1">
            <p className="text-fg-muted leading-relaxed">
              A multidisciplinary portfolio exploring the intersection of tactile
              fashion aesthetics and high-performance product design.
            </p>
            <p className="label mt-6">Est. 2024 — Archive 01</p>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8 md:gap-x-10 md:gap-y-24">
          {GRID.slice(0, 4).map((g) => {
            const p = lookup[g.slug];
            if (!p) return null;
            return (
              <Link
                key={g.slug}
                to={`/work/${g.slug}`}
                className={`group block ${g.span}`}
              >
                <div className={`overflow-hidden bg-ink-900 ${g.aspect}`}>
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-serif italic text-xl md:text-2xl text-fg">
                    {p.title}
                  </h3>
                  <p className="label-muted whitespace-nowrap">
                    {p.category} {p.year && `/ ${p.year}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Big case-study card */}
        <div className="mt-24 md:mt-32">
          <Link to={`/work/${featured.slug}`} className="group block">
            <div className="relative aspect-[16/9] overflow-hidden bg-ink-900">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 text-cream-100">
                <p className="uppercase tracking-widest2 text-xs font-medium">Case Study</p>
                <h3 className="font-serif italic text-3xl md:text-5xl mt-3">
                  {featured.title}
                </h3>
              </div>
            </div>
          </Link>
          <div className="mt-8 md:mt-10 grid md:grid-cols-12 gap-6 items-end">
            <p className="md:col-span-7 text-fg-muted leading-relaxed">
              {featured.blurb}
            </p>
            <div className="md:col-span-5 md:text-right">
              <Link to={`/work/${featured.slug}`} className="link-underline">
                View Case Study
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-app-elev py-24 md:py-32">
        <div className="container-narrow text-center">
          <p className="label-muted">Next Chapter</p>
          <h2 className="font-serif italic text-5xl md:text-7xl mt-4 text-fg">
            About Me
          </h2>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center justify-center w-12 h-12 rounded-full border border-accent text-accent hover:bg-accent hover:text-cream-100 transition-colors"
            aria-label="About me"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
