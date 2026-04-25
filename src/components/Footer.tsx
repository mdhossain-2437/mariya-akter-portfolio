import { Link } from "react-router-dom";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Behance", href: "https://behance.net" },
];

export default function Footer() {
  return (
    <footer className="bg-cream-200 border-t border-ink-200/50 mt-0">
      <div className="container-narrow py-16 md:py-20">
        <div className="text-center">
          <p className="label-muted mb-6">— Available Q3 / 2024 —</p>
          <h3 className="font-serif italic text-3xl md:text-5xl text-ink-900 leading-tight">
            Ready to create something{" "}
            <span className="text-accent">extraordinary?</span>
          </h3>
          <a
            href="mailto:hello@mariyaakter.me"
            className="mt-6 inline-block font-serif italic text-lg text-ink-700 hover:text-accent transition-colors underline underline-offset-4 decoration-ink-300"
          >
            hello@mariyaakter.me
          </a>
        </div>

        <div className="mt-16 pt-10 border-t border-ink-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-serif italic text-ink-700 text-sm md:text-base">
            Mariya Akter
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="label-muted hover:text-accent transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="label-muted hover:text-accent transition-colors">
              Privacy
            </Link>
            <p className="label-muted">© 2024 Mariya Akter</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
