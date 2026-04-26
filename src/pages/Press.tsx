import Reveal from "../components/Reveal";
import { awards, press } from "../data/awards";
import { ArrowUpRight } from "../components/Arrow";

export default function Press() {
  return (
    <div className="pt-24 md:pt-32">
      <section className="container-wide">
        <Reveal><p className="label">Recognition · 2018 — present</p></Reveal>
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
      </section>

      <section className="container-wide mt-20 md:mt-28">
        <h2 className="font-serif italic text-3xl md:text-4xl mb-8">Awards</h2>
        <ul className="divide-y divide-[var(--line)]">
          {awards.map((a, i) => (
            <Reveal key={i} as="li" delay={i * 0.03}>
              <div className="grid grid-cols-12 gap-4 py-6 items-baseline">
                <div className="col-span-2 md:col-span-1 font-mono text-xs text-accent">{a.year}</div>
                <div className="col-span-10 md:col-span-7 font-serif text-xl md:text-2xl">{a.title}</div>
                <div className="col-span-12 md:col-span-3 text-fg-muted text-sm md:text-base">{a.description}</div>
                <div className="col-span-12 md:col-span-1 text-right label-muted">{a.category}</div>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-wide mt-24 md:mt-32 mb-24">
        <h2 className="font-serif italic text-3xl md:text-4xl mb-8">Featured in</h2>
        <ul className="divide-y divide-[var(--line)]">
          {press.map((p, i) => (
            <Reveal key={i} as="li" delay={i * 0.03}>
              <a
                href={p.url}
                target={p.url === "#" ? undefined : "_blank"}
                rel="noreferrer"
                className="group grid grid-cols-12 gap-4 py-6 items-baseline transition-colors hover:text-accent"
              >
                <div className="col-span-2 md:col-span-1 font-mono text-xs text-accent">{p.date}</div>
                <div className="col-span-10 md:col-span-3 font-serif italic text-xl">{p.outlet}</div>
                <div className="col-span-12 md:col-span-7 text-fg md:text-lg">
                  {p.title}
                  <ArrowUpRight className="inline w-4 h-4 ml-2 align-middle text-fg-muted group-hover:text-accent transition" />
                </div>
                <div className="col-span-12 md:col-span-1 text-right label-muted">Read</div>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
}
