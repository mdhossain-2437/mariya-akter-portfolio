import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import { lookbookSections, galleryStrip } from "../data/lookbook";

function DragRow({ images }: { images: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative -mx-6 md:-mx-10 lg:-mx-16">
      <div
        ref={ref}
        className="flex gap-4 md:gap-6 overflow-x-auto px-6 md:px-10 lg:px-16 pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="snap-start shrink-0 w-[80vw] md:w-[55vw] lg:w-[36vw] aspect-[4/5] overflow-hidden bg-ink-900"
          >
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ParallaxImage({ src, idx }: { src: string; idx: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <div ref={ref} className={`overflow-hidden bg-ink-900 ${idx % 3 === 0 ? "aspect-[4/5]" : idx % 3 === 1 ? "aspect-square" : "aspect-[3/4]"}`}>
      <motion.img style={{ y }} src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
}

export default function Lookbook() {
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll("[data-look-section]");
      let active = 0;
      sections.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top < window.innerHeight / 2) active = i;
      });
      setActiveSection(active);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pt-24 md:pt-32">
      <Seo title="Lookbook" path="/lookbook" description="Three chapters of capsule storytelling — Velvet Silence SS24, Aura Digital, and The Weaver's Paradox AW24. Drag, scroll, and look closer." />
      <section className="container-wide">
        <Reveal>
          <p className="label">Lookbook · 2024</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,12vw,11rem)] mt-4">
            Volumes of <em className="italic text-accent">light</em>,
            <br />
            and the bodies <em className="italic">they</em> dress.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-fg-muted leading-relaxed">
            A curated reel of recent fashion direction work — collections, lookbooks,
            campaigns. Drag, scroll, linger. Use ← / → on a slow afternoon.
          </p>
        </Reveal>
      </section>

      {/* Sticky section index */}
      <div className="hidden lg:block sticky top-24 z-20 mt-16 mb-16">
        <div className="container-wide">
          <div className="flex gap-6 text-sm">
            {lookbookSections.map((s, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className={`transition-opacity ${activeSection === i ? "text-accent opacity-100" : "opacity-50"}`}
              >
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-2 font-serif italic">{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-32 md:space-y-44 mt-20">
        {lookbookSections.map((sec, i) => (
          <section
            key={i}
            id={`section-${i}`}
            data-look-section
            className="container-wide"
          >
            <div className="grid md:grid-cols-12 gap-8 mb-12">
              <div className="md:col-span-6">
                <p className="font-mono text-xs text-accent">CHAPTER {String(i + 1).padStart(2, "0")}</p>
                <h2 className="heading-display text-4xl md:text-6xl mt-4">{sec.title}</h2>
              </div>
              <div className="md:col-span-5 md:col-start-8 flex items-end">
                <p className="text-fg-muted leading-relaxed">{sec.subtitle}</p>
              </div>
            </div>
            <DragRow images={sec.images} />
          </section>
        ))}
      </div>

      {/* Gallery wall */}
      <section className="container-wide py-32 md:py-40">
        <Reveal>
          <p className="label">Gallery wall</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="heading-display text-4xl md:text-6xl mt-4 mb-12">
            A ceiling of <em className="italic text-accent">images</em>.
          </h2>
        </Reveal>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
          {galleryStrip.map((src, i) => (
            <div key={i} className="mb-4 break-inside-avoid">
              <ParallaxImage src={src} idx={i} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
