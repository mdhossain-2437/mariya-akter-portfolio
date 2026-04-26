import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "../components/Arrow";
import Marquee from "../components/Marquee";
import Magnetic from "../components/Magnetic";
import Reveal from "../components/Reveal";
import Tilt from "../components/Tilt";
import Seo from "../components/Seo";
import { projects } from "../data/projects";
import { clients, testimonials } from "../data/clients";
import { awards } from "../data/awards";
import { journalPosts } from "../data/journal";
import { principles } from "../data/process";

const TAGS = ["Graphics Design", "Digital Marketing", "Fashion Designer", "Creative Direction"];

const STATS = [
  { value: "12+", label: "Years of Practice" },
  { value: "60+", label: "Brands Shipped" },
  { value: "9", label: "International Awards" },
  { value: "32", label: "Countries Reached" },
];

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.55;
      const lines = 14;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const yBase = (i / lines) * h;
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 8) {
          const y = yBase + Math.sin(x * 0.012 + t * 0.6 + i * 0.5) * (12 + i * 0.6);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(201,66,26,${0.06 + (i % 3) * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      t += 0.012;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}

function HeroParallax() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div ref={ref} className="relative">
      <HeroCanvas />
      <div className="container-wide relative pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <Reveal as="div" className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
              {TAGS.map((t, i) => (
                <span key={t} className="uppercase tracking-widest2 text-[0.65rem] sm:text-[0.7rem] font-medium">
                  <span className={i % 2 === 0 ? "text-accent" : "text-fg-muted"}>{t}</span>
                  {i < TAGS.length - 1 && <span className="ml-4 text-fg-muted/40">/</span>}
                </span>
              ))}
            </Reveal>
            <h1 className="heading-display text-[clamp(3.6rem,13vw,11rem)] text-fg">
              <Reveal as="div" delay={0.05}>Mariya</Reveal>
              <Reveal as="div" delay={0.18} className="italic font-light text-accent">
                Akter<span className="text-accent">.</span>
              </Reveal>
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-10 max-w-xl text-fg-muted text-base md:text-[1.05rem] leading-relaxed">
                A multidisciplinary creative weaving fashion's tactile poetry, brand narratives,
                and data-driven digital marketing into singular, resonant stories.
                Studio in Dhaka — clients in London, Dubai, and the digital frontier.
              </p>
            </Reveal>
            <Reveal delay={0.42} className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Magnetic strength={0.2}>
                <Link to="/work" className="btn-primary">
                  View Work <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Magnetic>
              <Link to="/about" className="font-serif italic text-fg-muted hover:text-accent transition-colors text-base link-reveal">
                The Philosophy →
              </Link>
            </Reveal>
          </div>

          <motion.div style={{ y, scale }} className="lg:col-span-4 mt-10 lg:mt-0">
            <Tilt intensity={5} className="relative">
              <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto rounded-sm overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]">
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80"
                  alt="Mariya Akter, portrait"
                  className="w-full h-full object-cover grayscale-[10%]"
                />
                <div className="absolute -bottom-4 -left-4 hidden sm:block bg-app px-5 py-4 shadow-lg max-w-[15rem] border border-line">
                  <p className="label">Studio Note</p>
                  <p className="font-serif italic text-sm mt-1 leading-snug">
                    "Design is the silent ambassador of your brand."
                  </p>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </div>

        <div className="absolute -z-10 top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full blob bg-accent/10" />
        <div className="absolute -z-10 bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blob bg-accent/5" />
      </div>
    </div>
  );
}

function ClientsMarquee() {
  return (
    <div className="border-y border-line py-6 overflow-hidden bg-app-elev">
      <Marquee speed="slow">
        {clients.map((c, i) => (
          <span key={i} className="px-10 font-serif italic text-2xl md:text-3xl text-fg-muted whitespace-nowrap inline-flex items-center gap-10">
            {c}
            <span className="text-accent">/</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function StatsRow() {
  return (
    <section className="container-wide py-20 md:py-28">
      <Reveal>
        <p className="label-muted">Numbers, briefly</p>
      </Reveal>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={0.05 * i}>
            <div className="border-t border-line pt-6">
              <div className="font-serif text-5xl md:text-6xl">{s.value}</div>
              <div className="label-muted mt-3">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedWork() {
  const featured = projects.slice(0, 4);
  return (
    <section className="container-wide py-24 md:py-36">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <p className="label">Selected Work</p>
          <h2 className="heading-display text-5xl md:text-7xl mt-3">
            Stories <em className="italic text-accent">across</em> mediums.
          </h2>
        </div>
        <Link to="/work" className="btn-ghost text-fg">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-20">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.1}>
            <Link to={`/work/${p.slug}`} className="group block">
              <div className="overflow-hidden bg-ink-900 aspect-[5/6]">
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-smooth group-hover:scale-110"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="label-muted">{p.category} · {p.year}</p>
                  <h3 className="font-serif text-3xl md:text-4xl mt-2">{p.title}</h3>
                </div>
                <ArrowUpRight className="w-5 h-5 mt-3 text-fg-muted group-hover:text-accent transition-colors" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PhilosophyTicker() {
  return (
    <div className="border-y border-line py-10 md:py-14 overflow-hidden">
      <Marquee speed="slow">
        <span className="font-serif text-5xl md:text-7xl px-8 inline-flex items-center gap-10 whitespace-nowrap">
          Beauty has consequence
          <span className="text-accent">✦</span>
          Restraint is leverage
          <span className="text-accent">✦</span>
          Brands are gardens
          <span className="text-accent">✦</span>
          Slow is unkind, dull is unforgivable
          <span className="text-accent">✦</span>
        </span>
      </Marquee>
    </div>
  );
}

function Principles() {
  return (
    <section className="container-wide py-24 md:py-36">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="label">The Studio</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="heading-display text-5xl md:text-7xl mt-3">
              Six <em className="italic text-accent">principles</em>.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-fg-muted max-w-md leading-relaxed">
              The longest-lived brands aren't the loudest. They're the ones with a
              philosophy clear enough to defend at 2am. These six lines hold the studio together.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-8 grid md:grid-cols-2 gap-x-10 gap-y-8">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="border-t border-line pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-accent">{p.n}</span>
                  <h3 className="font-serif text-2xl">{p.title}</h3>
                </div>
                <p className="mt-3 text-fg-muted leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[i];
  return (
    <section className="bg-app-elev border-y border-line py-24 md:py-32 grain">
      <div className="container-narrow text-center">
        <p className="label">Voices</p>
        <motion.blockquote
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-serif text-3xl md:text-5xl leading-tight text-balance"
        >
          "{t.quote}"
        </motion.blockquote>
        <motion.div
          key={i + "-meta"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="text-left">
            <div className="font-serif italic">{t.name}</div>
            <div className="label-muted">{t.role}</div>
          </div>
        </motion.div>
        <div className="mt-10 flex items-center justify-center gap-3">
          {testimonials.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              className={`h-1 transition-all ${k === i ? "w-10 bg-accent" : "w-5 bg-fg-muted/30"}`}
              aria-label={`Testimonial ${k + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AwardsStrip() {
  return (
    <section className="container-wide py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="label">Recognition</p>
          <h2 className="heading-display text-5xl md:text-7xl mt-3">
            On the <em className="italic text-accent">record</em>.
          </h2>
        </div>
        <Link to="/press" className="btn-ghost text-fg">
          All awards & press <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <ul className="divide-y divide-[var(--line)]">
        {awards.slice(0, 5).map((a, i) => (
          <Reveal key={i} as="li" delay={i * 0.04}>
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
  );
}

function JournalTeasers() {
  const posts = journalPosts.slice(0, 3);
  return (
    <section className="container-wide py-24 md:py-32 border-t border-line">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="label">Journal</p>
          <h2 className="heading-display text-5xl md:text-7xl mt-3">
            Notes from <em className="italic text-accent">the loom</em>.
          </h2>
        </div>
        <Link to="/journal" className="btn-ghost text-fg">
          All entries <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <Link to="/journal" className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-ink-900">
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <p className="label-muted">{p.category} · {p.date}</p>
                <h3 className="font-serif text-2xl mt-2 leading-tight">{p.title}</h3>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Seo title="Mariya Akter — Portfolio" path="/" description="Multidisciplinary designer crafting intentional brand identities, fashion direction, and digital strategy. Studio in Dhaka, clients worldwide." />
      <HeroParallax />
      <ClientsMarquee />
      <StatsRow />
      <FeaturedWork />
      <PhilosophyTicker />
      <Principles />
      <TestimonialCarousel />
      <AwardsStrip />
      <JournalTeasers />
    </div>
  );
}
