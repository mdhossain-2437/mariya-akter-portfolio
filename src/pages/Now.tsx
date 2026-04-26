import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { now } from "../data/now";

export default function Now() {
  return (
    <div className="pt-24 md:pt-32">
      <Seo
        title="Now"
        path="/now"
        description="What Mariya's studio is working on right now — current clients, open inquiries, and the state of the desk."
      />
      <section className="container-narrow">
        <Reveal>
          <p className="label">Updated {now.updated} · Inspired by Derek Sivers</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,11vw,9rem)] mt-4">
            Now.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-fg-muted text-lg max-w-2xl">
            What I'm working on, reading, watching, and listening to right now —
            updated when something shifts. {now.location}, {now.status}.
          </p>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-16">
          <div>
            <h2 className="font-serif italic text-2xl mb-6">Building</h2>
            <ul className="space-y-3">
              {now.building.map((b) => (
                <li key={b} className="flex gap-3 text-fg leading-relaxed">
                  <span className="text-accent mt-2">●</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif italic text-2xl mb-6">Reading</h2>
            <ul className="space-y-3">
              {now.reading.map((r) => (
                <li key={r.title} className="text-fg leading-relaxed">
                  <span className="font-serif">{r.title}</span>
                  <span className="text-fg-muted"> — {r.author}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif italic text-2xl mb-6">Watching</h2>
            <ul className="space-y-3">
              {now.watching.map((w) => (
                <li key={w} className="text-fg leading-relaxed">{w}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif italic text-2xl mb-6">Listening</h2>
            <ul className="space-y-3">
              {now.listening.map((w) => (
                <li key={w} className="text-fg leading-relaxed">{w}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-serif italic text-2xl mb-6">Thinking about</h2>
            <ul className="grid md:grid-cols-3 gap-6">
              {now.thinking.map((t, i) => (
                <li key={i} className="surface rounded-xl p-6 font-serif italic text-xl leading-snug">
                  "{t}"
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
