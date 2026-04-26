import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import { capabilities, stack } from "../data/capabilities";

export default function Capabilities() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div className="pt-16 md:pt-20">
      <Seo
        title="Capabilities"
        path="/capabilities"
        description="A heatmap of what the studio does best — brand identity, creative direction, fashion, digital product, motion, editorial, strategy, and performance marketing."
      />
      <section className="container-wide pt-12 md:pt-20 pb-16">
        <p className="label-muted">Capabilities</p>
        <h1 className="heading-display mt-6 max-w-5xl">
          A heatmap of <em className="text-accent">what we do best</em>, and where to push next.
        </h1>
        <p className="mt-8 max-w-2xl text-fg-muted">
          Eight disciplines, woven into one operating system. Hover to read the brief, watch the bar
          breathe, and see the toolset behind it.
        </p>
      </section>

      <section ref={ref} className="container-wide pb-24">
        <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {capabilities.map((c, i) => (
            <li key={c.area} className="group">
              <div className="grid grid-cols-12 items-center gap-6 py-7 transition-colors group-hover:bg-[var(--bg-elev)]">
                <div className="col-span-12 md:col-span-3">
                  <p className="font-serif text-2xl md:text-3xl">{c.area}</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.level}%` }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                    />
                  </div>
                  <p className="mt-3 max-w-xl text-sm text-fg-muted">{c.blurb}</p>
                </div>
                <div className="col-span-12 md:col-span-3 flex items-baseline justify-end gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
                    Mastery
                  </span>
                  <span className="font-serif text-3xl tabular-nums">{c.level}</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-6 pb-7 md:pb-8 text-sm text-fg-muted">
                <div className="col-span-12 md:col-start-4 md:col-span-9 flex flex-wrap gap-2">
                  {c.tools.map((t) => (
                    <span key={t} className="pill">{t}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-wide pb-24 md:pb-32">
        <motion.div style={{ y }} className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="label-muted">The stack</p>
            <h2 className="heading-display mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">
              The instruments<br />behind the work.
            </h2>
            <p className="mt-6 max-w-md text-fg-muted">
              Tools are tools. The point is the room they help us hold. Here's the kit we reach for
              most often, and a few of the photographers and writers we keep close.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {stack.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05}>
                <div className="surface p-6">
                  <p className="label-muted">{s.label}</p>
                  <ul className="mt-4 space-y-2 font-serif text-lg">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
