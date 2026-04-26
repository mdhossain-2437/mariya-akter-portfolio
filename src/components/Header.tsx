import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "./Magnetic";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/services", label: "Services" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "Studio" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-app/80 backdrop-blur-xl border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className="font-serif text-xl md:text-[1.4rem] font-bold tracking-tight text-fg flex items-center gap-2"
        >
          Mariya<span className="italic font-medium"> Akter</span>
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Magnetic key={n.to} strength={0.25}>
              <NavLink
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `relative font-serif italic text-[15px] transition-colors px-1 ${
                    isActive ? "text-accent" : "text-fg hover:text-fg"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-0 right-0 -bottom-1 h-px bg-accent"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </Magnetic>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Magnetic strength={0.2}>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-cream-100 px-5 py-2.5 rounded-full uppercase text-[11px] font-semibold tracking-widest2 transition-colors"
            >
              Let's Talk
            </Link>
          </Magnetic>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            className="p-2 text-fg"
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M3 7H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M3 12H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M3 17H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-app border-t border-line"
          >
            <div className="container-wide flex flex-col py-6 gap-4">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `font-serif italic text-2xl ${isActive ? "text-accent" : "text-fg"}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <Link to="/process" className="chip">Process</Link>
                <Link to="/press" className="chip">Press</Link>
                <Link to="/clients" className="chip">Clients</Link>
                <Link to="/now" className="chip">Now</Link>
                <Link to="/faq" className="chip">FAQ</Link>
                <Link to="/pricing" className="chip">Pricing</Link>
                <Link to="/archive" className="chip">Archive</Link>
              </div>
              <Link to="/contact" className="btn-primary self-start mt-2">
                Let's Talk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
