import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/expertise", label: "Expertise" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-cream-100/85 backdrop-blur-md border-b border-ink-200/50"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-16 md:h-20">
        <Link
          to="/"
          className="font-serif text-xl md:text-[1.4rem] font-bold tracking-tight text-ink-900"
        >
          Mariya<span className="italic font-medium"> Akter</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `font-serif italic text-[15px] transition-colors ${
                  isActive
                    ? "text-accent border-b border-accent pb-0.5"
                    : "text-ink-700 hover:text-ink-900"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden md:inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-cream-100 px-5 py-2.5 rounded-md uppercase text-[11px] font-semibold tracking-widest2 transition-colors"
        >
          Let's Talk
        </Link>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 text-ink-900"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
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

      {open && (
        <div className="md:hidden bg-cream-100 border-t border-ink-200/50">
          <div className="container-narrow flex flex-col py-6 gap-5">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `font-serif italic text-lg ${
                    isActive ? "text-accent" : "text-ink-800"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn-primary self-start mt-2">
              Let's Talk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
