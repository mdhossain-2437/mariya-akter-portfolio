import { Link } from "react-router-dom";
import Marquee from "./Marquee";
import Magnetic from "./Magnetic";

const SERVICES = [
  "Brand Identity",
  "Creative Direction",
  "Fashion Direction",
  "Art Direction",
  "Digital Strategy",
  "Editorial Design",
  "Visual Systems",
  "Campaign Development",
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-32 bg-app-elev border-t border-line text-fg">
      {/* Massive CTA */}
      <div className="container-wide py-24 md:py-36">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-3xl">
            <div className="label">— Available Q3 / {year} —</div>
            <h3 className="heading-display text-[12vw] md:text-[8vw] mt-6">
              Let's craft <em className="italic font-light text-accent">something</em> exceptional.
            </h3>
          </div>
          <Magnetic strength={0.25}>
            <Link
              to="/contact"
              className="group inline-flex flex-col items-center justify-center w-40 h-40 md:w-52 md:h-52 rounded-full bg-accent text-cream-100 uppercase tracking-widest2 text-xs font-semibold relative overflow-hidden"
            >
              <span className="relative z-10 flex flex-col items-center gap-2">
                <span>Start a project</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-accent-dark scale-0 group-hover:scale-100 transition-transform duration-700 ease-smooth rounded-full" />
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-y border-line py-8 overflow-hidden">
        <Marquee speed="slow">
          {SERVICES.map((s, i) => (
            <span key={i} className="font-serif italic text-3xl md:text-5xl px-8 inline-flex items-center gap-8 whitespace-nowrap">
              {s}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-wide py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <Link to="/" className="font-serif text-2xl">
            Mariya<span className="italic font-medium"> Akter</span>
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-fg-muted leading-relaxed">
            Multidisciplinary designer crafting intentional brand identities, fashion direction, and digital strategy. Working from Dhaka with brands worldwide.
          </p>
          <a href="mailto:hello@mariyaakter.me" className="mt-6 inline-block link-reveal text-fg">
            hello@mariyaakter.me
          </a>
        </div>

        <div>
          <div className="label-muted mb-4">Sitemap</div>
          <ul className="space-y-2 text-sm">
            <li><Link className="link-reveal" to="/work">Work</Link></li>
            <li><Link className="link-reveal" to="/lookbook">Lookbook</Link></li>
            <li><Link className="link-reveal" to="/services">Services</Link></li>
            <li><Link className="link-reveal" to="/process">Process</Link></li>
            <li><Link className="link-reveal" to="/capabilities">Capabilities</Link></li>
            <li><Link className="link-reveal" to="/about">Studio</Link></li>
            <li><Link className="link-reveal" to="/journal">Journal</Link></li>
            <li><Link className="link-reveal" to="/clients">Clients</Link></li>
            <li><Link className="link-reveal" to="/press">Press</Link></li>
            <li><Link className="link-reveal" to="/pricing">Pricing</Link></li>
            <li><Link className="link-reveal" to="/now">Now</Link></li>
            <li><Link className="link-reveal" to="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="label-muted mb-4">Elsewhere</div>
          <ul className="space-y-2 text-sm">
            <li><a className="link-reveal" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a className="link-reveal" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a className="link-reveal" href="https://behance.net" target="_blank" rel="noreferrer">Behance</a></li>
            <li><a className="link-reveal" href="https://dribbble.com" target="_blank" rel="noreferrer">Dribbble</a></li>
            <li><a className="link-reveal" href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a></li>
            <li><Link className="link-reveal" to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-wide py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-fg-muted">
          <span>© {year} Mariya Akter — All rights reserved.</span>
          <span className="font-mono">Dhaka · London · Dubai</span>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="link-reveal">Privacy</Link>
            <Link to="/terms" className="link-reveal">Terms</Link>
            <span>Cmd / Ctrl + K</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
