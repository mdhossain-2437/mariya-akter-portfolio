import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Seo from "../components/Seo";
import { ArrowRight } from "../components/Arrow";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const LETTERS = "404".split("");

export default function NotFound() {
  const reduced = usePrefersReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const handle = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [reduced]);

  return (
    <div className="pt-16 md:pt-20">
      <Seo title="404 — Lost in the archive" path="/404" description="The page wandered off. Let's get you back." />
      <section ref={heroRef} className="container-wide min-h-[80vh] py-20 grid md:grid-cols-12 items-center gap-10">
        <div className="md:col-span-7">
          <p className="label-muted">Error · 404</p>
          <h1 className="mt-6 font-serif leading-[0.85] text-[clamp(7rem,22vw,18rem)] flex">
            {LETTERS.map((char, i) => {
              const sign = i === 1 ? -1 : 1;
              const tx = pos.x * 30 * sign;
              const ty = pos.y * 30 * sign;
              return (
                <span
                  key={i}
                  className="inline-block transition-transform"
                  style={{
                    transform: reduced ? undefined : `translate(${tx}px, ${ty}px) rotate(${tx * 0.4}deg)`,
                    color: i === 1 ? "var(--accent)" : "var(--fg)",
                  }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
          <p className="mt-8 max-w-md text-fg-muted leading-relaxed">
            The page wandered off, found a more interesting conversation in another room, and forgot
            to leave a note. Move your cursor — the numbers feel it. Let's get you back.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
            <Link to="/" className="btn-primary">
              Return to gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/work" className="link-underline">
              View work
            </Link>
            <Link to="/journal" className="link-underline">
              Read journal
            </Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="surface p-6">
            <p className="label-muted">From the journal</p>
            <p className="mt-3 font-serif italic text-xl">
              "Art is never finished, only abandoned."
            </p>
            <p className="label-muted mt-2">— Leonardo da Vinci</p>
          </div>
          <div className="mt-6 surface p-6">
            <p className="label-muted">Lost? try</p>
            <ul className="mt-3 space-y-2 text-fg">
              <li><Link to="/lookbook" className="hover:text-accent">→ Lookbook</Link></li>
              <li><Link to="/process" className="hover:text-accent">→ Process</Link></li>
              <li><Link to="/capabilities" className="hover:text-accent">→ Capabilities</Link></li>
              <li><Link to="/contact" className="hover:text-accent">→ Start a project</Link></li>
            </ul>
            <p className="label-muted mt-6">Or press ⌘K to search.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
