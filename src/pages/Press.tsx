import { useMemo, useState } from "react";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import SmartImage from "../components/SmartImage";
import { awards, press } from "../data/awards";
import { ArrowUpRight } from "../components/Arrow";

export default function Press() {
  const years = useMemo(() => {
    const map = new Map<string, typeof awards>();
    awards.forEach((a) => {
      const list = map.get(a.year) ?? [];
      list.push(a);
      map.set(a.year, list);
    });
    return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, []);

  const [activeYear, setActiveYear] = useState<string | null>(null);
  const yearKeys = years.map(([y]) => y);

  return (
    <div className="pt-24 md:pt-32">
      <Seo
        title="Press & Recognition"
        path="/press"
        description="A running list of awards, juries, and editorial features. The work travels farther than the studio does."
      />

      <section className="container-wide">
        <Reveal>
          <p className="label-muted">Recognition · 2018 — present</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,12vw,11rem)] mt-4">
            Press & <em className="italic text-accent">recognition</em>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-fg-muted text-lg leading-relaxed">
            A running list of awards, juries, and editorial features. The work travels
            farther than the studio does.
          </p>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveYear(null)}
            className={`pill ${activeYear === null ? "bg-[var(--accent)] text-white border-[var(--accent)]" : ""}`}
          >
            All years
          </button>
          {yearKeys.map((y) => (
            <button
              key={y}
              onClick={() => setActiveYear(y)}
              className={`pill ${activeYear === y ? "bg-[var(--accent)] text-white border-[var(--accent)]" : ""}`}
            >
              {y}
            </button>
          ))}
        </div>
      </section>

      <section className="container-wide mt-16 md:mt-20">
        <h2 className="font-serif italic text-3xl md:text-4xl mb-8">Awards</h2>
        <div className="space-y-12">
          {years
            .filter(([y]) => activeYear === null || activeYear === y)
            .map(([year, list]) => (
              <Reveal key={year}>
                <div className="grid md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-2">
                    <p className="font-serif text-5xl md:text-6xl text-[var(--accent)] tabular-nums">
                      {year}
                    </p>
                  </div>
                  <ul className="md:col-span-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                    {list.map((a, i) => (
                      <li key={i} className="grid grid-cols-12 gap-4 py-5 items-baseline">
                        <div className="col-span-12 md:col-span-4 font-serif text-xl md:text-2xl">
                          {a.title}
                        </div>
                        <div className="col-span-9 md:col-span-5 text-fg-muted text-sm md:text-base">
                          {a.description}
                        </div>
                        <div className="col-span-3 md:col-span-2 text-right md:text-left label-muted">
                          {a.honor ?? a.category}
                        </div>
                        <div className="hidden md:block md:col-span-1 text-right label-muted">
                          {a.category}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
        </div>
      </section>

      <section className="container-wide mt-24 md:mt-32 mb-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <h2 className="font-serif italic text-3xl md:text-4xl">Featured in</h2>
          <p className="label-muted">Selected · {press.length} entries</p>
        </div>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
          {press.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <a
                href={p.url}
                target={p.url === "#" ? undefined : "_blank"}
                rel="noreferrer"
                className="group block"
              >
                <SmartImage
                  src={p.image ?? ""}
                  alt={p.outlet}
                  aspect="aspect-[4/3]"
                  rounded="rounded-md"
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <p className="font-serif italic text-xl md:text-2xl">{p.outlet}</p>
                  <p className="label-muted">{p.date}</p>
                </div>
                <h3 className="mt-3 text-lg md:text-xl text-fg group-hover:text-accent transition-colors">
                  {p.title}
                  <ArrowUpRight className="inline w-4 h-4 ml-2 align-middle text-fg-muted group-hover:text-accent" />
                </h3>
                {p.excerpt && (
                  <p className="mt-3 text-sm text-fg-muted leading-relaxed">{p.excerpt}</p>
                )}
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
