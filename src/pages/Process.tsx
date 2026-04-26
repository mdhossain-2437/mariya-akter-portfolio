import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "../components/Reveal";
import { processSteps, principles } from "../data/process";

function StepRow({ step, idx }: { step: typeof processSteps[number]; idx: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  return (
    <div ref={ref} className="relative grid md:grid-cols-12 gap-8 py-16 border-t border-line">
      <div className="md:col-span-2">
        <div className="font-mono text-xs text-accent">{step.n}</div>
      </div>
      <motion.div style={{ y }} className="md:col-span-7">
        <h3 className="heading-display text-4xl md:text-6xl">{step.title}</h3>
        <p className="label-muted mt-4">{step.sub}</p>
        <p className="mt-6 text-fg-muted leading-relaxed max-w-2xl">{step.body}</p>
      </motion.div>
      <div className="md:col-span-3">
        <p className="label-muted mb-3">Deliverables</p>
        <ul className="space-y-2 text-sm">
          {step.deliverables.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="text-accent mt-1">—</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="absolute -left-4 top-16 hidden lg:flex items-center font-mono text-[14vw] text-fg-muted/5 select-none pointer-events-none -z-0"
        style={{ lineHeight: 0.8 }}
      >
        {String(idx + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <div className="pt-24 md:pt-32">
      <section className="container-wide">
        <Reveal>
          <p className="label">Method</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,12vw,11rem)] mt-4">
            How the <em className="italic text-accent">work</em> gets made.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-fg-muted text-lg leading-relaxed">
            Every engagement runs the same six chapters. Each chapter has a deliverable,
            a deadline, and a sentence that defines its done. No surprises, no scope creep,
            no orphan files.
          </p>
        </Reveal>
      </section>

      <section className="container-wide mt-20 md:mt-32">
        {processSteps.map((s, i) => (
          <StepRow key={s.n} step={s} idx={i} />
        ))}
      </section>

      <section className="container-wide py-24 md:py-32">
        <Reveal>
          <p className="label">Operating principles</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="heading-display text-5xl md:text-7xl mt-4 mb-12">
            What we <em className="italic text-accent">won't</em> compromise on.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="surface rounded-xl p-8 h-full">
                <div className="font-mono text-xs text-accent">{p.n}</div>
                <h3 className="font-serif text-2xl mt-4">{p.title}</h3>
                <p className="mt-3 text-fg-muted leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
