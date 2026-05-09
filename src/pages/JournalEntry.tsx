import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Seo from "../components/Seo";
import SmartImage from "../components/SmartImage";
import { journalEntries } from "../data/journalEntries";
import { unsplashSized, unsplashSrcSet } from "../lib/unsplash";
import { ArrowRight } from "../components/Arrow";

export default function JournalEntry() {
  const { slug } = useParams();
  const entry = journalEntries.find((e) => e.slug === slug);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(t);
  }, [copied]);

  if (!entry) {
    return (
      <div className="pt-32 container-narrow min-h-[60vh]">
        <Seo title="Entry not found" path={`/journal/${slug ?? ""}`} />
        <p className="label-muted">Journal · 404</p>
        <h1 className="heading-display mt-6">This entry has been retired from the page.</h1>
        <Link to="/journal" className="btn-primary mt-8 inline-flex">
          Back to Journal <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const idx = journalEntries.findIndex((e) => e.slug === slug);
  const next = journalEntries[(idx + 1) % journalEntries.length];

  const share = async () => {
    const url = `${window.location.origin}/journal/${entry.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  return (
    <article className="pt-16 md:pt-20">
      <Seo title={entry.title} description={entry.excerpt} image={entry.hero} path={`/journal/${entry.slug}`} />
      <motion.div
        style={{ scaleX: progress, transformOrigin: "0 50%" }}
        className="fixed inset-x-0 top-0 z-30 h-px bg-[var(--accent)]"
      />

      <header className="container-narrow pt-12 md:pt-16 pb-10">
        <Link to="/journal" className="label-muted inline-flex items-center gap-2 hover:text-accent">
          ← Journal
        </Link>
        <p className="label-muted mt-10">{entry.category} · {entry.date} · {entry.readTime}</p>
        <h1 className="heading-display mt-6">{entry.title}</h1>
        <p className="mt-8 max-w-2xl text-lg text-fg-muted">{entry.excerpt}</p>
      </header>

      <div className="container-wide">
        <SmartImage
          src={unsplashSized(entry.hero, 1400)}
          srcSet={unsplashSrcSet(entry.hero, [600, 900, 1200, 1600])}
          sizes="(max-width: 1280px) 95vw, 1280px"
          alt={entry.title}
          aspect="aspect-[16/9]"
          rounded="rounded-md"
        />
      </div>

      <section className="container-narrow py-16 md:py-24">
        <div className="prose-editorial space-y-7 text-lg leading-relaxed text-fg">
          {entry.body.map((p, i) => (
            <p key={i} className={i === 0 ? "first-letter:font-serif first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.9] first-letter:text-accent" : undefined}>
              {p}
            </p>
          ))}
        </div>
        <div className="mt-12 flex items-center gap-5">
          <button onClick={share} className="btn-outline">
            {copied ? "Link copied" : "Copy share link"}
          </button>
          <a
            className="link-underline"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(entry.title)}&url=${encodeURIComponent(`https://mariyaakter.me/journal/${entry.slug}`)}`}
            target="_blank"
            rel="noreferrer"
          >
            Share on X
          </a>
        </div>
      </section>

      <section className="container-wide pb-24 md:pb-32">
        <p className="label-muted">Next dispatch</p>
        <Link to={`/journal/${next.slug}`} className="mt-4 block group">
          <div className="grid md:grid-cols-12 items-end gap-6 border-t border-[var(--line)] pt-8">
            <div className="md:col-span-8">
              <h2 className="font-serif text-3xl md:text-5xl group-hover:text-accent transition-colors">
                {next.title}
              </h2>
              <p className="label-muted mt-3">{next.category} · {next.readTime}</p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <span className="btn-outline group-hover:bg-accent group-hover:text-cream-100 group-hover:border-accent">
                Read next <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Link>
      </section>
    </article>
  );
}
