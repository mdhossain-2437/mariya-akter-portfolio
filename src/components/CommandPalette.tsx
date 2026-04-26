import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Item = {
  group: string;
  label: string;
  hint?: string;
  to?: string;
  action?: () => void;
};

export default function CommandPalette({ onToggleTheme }: { onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const items: Item[] = [
    { group: "Navigate", label: "Home", to: "/" },
    { group: "Navigate", label: "Work", to: "/work" },
    { group: "Navigate", label: "Lookbook", to: "/lookbook" },
    { group: "Navigate", label: "Services", to: "/services" },
    { group: "Navigate", label: "Process", to: "/process" },
    { group: "Navigate", label: "Studio / About", to: "/about" },
    { group: "Navigate", label: "Press & Recognition", to: "/press" },
    { group: "Navigate", label: "Clients & Testimonials", to: "/clients" },
    { group: "Navigate", label: "Journal", to: "/journal" },
    { group: "Navigate", label: "Now", to: "/now" },
    { group: "Navigate", label: "FAQ", to: "/faq" },
    { group: "Navigate", label: "Pricing / Engagement", to: "/pricing" },
    { group: "Navigate", label: "Archive", to: "/archive" },
    { group: "Navigate", label: "Expertise", to: "/expertise" },
    { group: "Navigate", label: "Contact", to: "/contact" },
    { group: "Actions", label: "Toggle theme", hint: "T", action: onToggleTheme },
    { group: "External", label: "Email — hello@mariyaakter.me", action: () => { window.location.assign("mailto:hello@mariyaakter.me"); } },
    { group: "External", label: "Instagram", action: () => window.open("https://instagram.com", "_blank") },
    { group: "External", label: "LinkedIn", action: () => window.open("https://linkedin.com", "_blank") },
    { group: "External", label: "Behance", action: () => window.open("https://behance.net", "_blank") },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = items.filter((i) =>
    (i.label + " " + i.group).toLowerCase().includes(q.toLowerCase())
  );

  const grouped: Record<string, Item[]> = {};
  filtered.forEach((i) => {
    if (!grouped[i.group]) grouped[i.group] = [];
    grouped[i.group].push(i);
  });

  const run = (i: Item) => {
    if (i.to) navigate(i.to);
    if (i.action) i.action();
    setOpen(false);
    setQ("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-xl rounded-2xl bg-app border border-line shadow-2xl overflow-hidden"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-fg-muted">
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search pages, actions…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-muted"
              />
              <kbd className="text-[10px] uppercase tracking-widest text-fg-muted">Esc</kbd>
            </div>
            <div className="max-h-[55vh] overflow-y-auto py-2">
              {Object.keys(grouped).length === 0 && (
                <div className="px-5 py-8 text-sm text-fg-muted">No matches.</div>
              )}
              {Object.entries(grouped).map(([group, list]) => (
                <div key={group} className="py-2">
                  <div className="px-5 pt-2 pb-1 text-[10px] uppercase tracking-widest text-fg-muted">{group}</div>
                  {list.map((i) => (
                    <button
                      key={i.label}
                      onClick={() => run(i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-2.5 text-sm hover:bg-app-elev transition-colors text-left"
                    >
                      <span>{i.label}</span>
                      {i.hint && <span className="text-fg-muted text-xs">{i.hint}</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-line text-[11px] text-fg-muted">
              <span>↑↓ navigate · ↵ select</span>
              <span>⌘ K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
