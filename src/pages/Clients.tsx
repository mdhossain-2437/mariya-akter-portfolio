import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../components/Reveal";
import Marquee from "../components/Marquee";
import Seo from "../components/Seo";
import { clients, testimonials } from "../data/clients";

export default function Clients() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  return (
    <div className="pt-24 md:pt-32">
      <Seo
        title="Clients"
        path="/clients"
        description="A short list of long partnerships — studios, houses, and teams the studio has directed alongside since 2018."
      />
      <section className="container-wide">
        <Reveal><p className="label">Clients · since 2018</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,12vw,11rem)] mt-4">
            Long table, <em className="italic text-accent">good company</em>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-fg-muted text-lg leading-relaxed">
            A partial list of brands we've helped find their voice — from young houses
            to category-defining names. Half of these started as DM conversations.
          </p>
        </Reveal>
      </section>

      <section className="mt-20 border-y border-line py-10 overflow-hidden">
        <Marquee speed="slow">
          {clients.map((c, i) => (
            <span key={i} className="px-10 font-serif italic text-3xl md:text-5xl whitespace-nowrap inline-flex items-center gap-10">
              {c}
              <span className="text-accent">/</span>
            </span>
          ))}
        </Marquee>
      </section>

      <section className="container-wide py-24 md:py-32">
        <h2 className="font-serif italic text-3xl md:text-4xl mb-12">Roster</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
          {clients.map((c, i) => (
            <Reveal key={c} delay={i * 0.03}>
              <div className="border-t border-line py-4">
                <div className="font-mono text-[10px] text-fg-muted">{String(i + 1).padStart(2, "0")}</div>
                <div className="font-serif text-2xl mt-1">{c}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-app-elev border-y border-line py-24 md:py-36">
        <div className="container-wide grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="label">Voices</p>
            <h2 className="heading-display text-4xl md:text-6xl mt-3">
              They <em className="italic text-accent">said</em>.
            </h2>
            <div className="mt-10 space-y-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setActive(i)}
                  className={`block text-left w-full font-serif italic text-2xl py-2 border-l-2 pl-4 transition-colors ${active === i ? "border-accent text-accent" : "border-transparent text-fg-muted hover:text-fg"}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="font-serif text-3xl md:text-5xl leading-tight">
                  "{t.quote}"
                </blockquote>
                <div className="mt-10 flex items-center gap-4">
                  <img src={t.image} alt="" loading="lazy" decoding="async" width="56" height="56" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <div className="font-serif italic text-xl">{t.name}</div>
                    <div className="label-muted">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
