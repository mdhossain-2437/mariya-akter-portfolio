import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../components/Reveal";
import { faq } from "../data/faq";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="pt-24 md:pt-32">
      <section className="container-narrow">
        <Reveal><p className="label">FAQ</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,11vw,9rem)] mt-4">
            Honest <em className="italic text-accent">answers</em>.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-fg-muted text-lg max-w-2xl">
            The questions we get asked most. Email if there's something missing —
            we'll add it here.
          </p>
        </Reveal>

        <div className="mt-16 divide-y divide-[var(--line)] border-y border-line">
          {faq.map((q, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <h2 className="font-serif text-xl md:text-2xl">{q.q}</h2>
                  <span
                    className={`shrink-0 mt-2 transition-transform duration-300 ${isOpen ? "rotate-45 text-accent" : "text-fg-muted"}`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 text-fg-muted leading-relaxed">{q.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
