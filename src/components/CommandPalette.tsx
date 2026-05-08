import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type Fuse from "fuse.js";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  to?: string;
  action?: () => void;
};

const RECENTS_KEY = "cmdk-recents";
const MAX_RECENTS = 5;

export default function CommandPalette({ onToggleTheme }: { onToggleTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const items: Item[] = useMemo(
    () => [
      { id: "home", group: "Navigate", label: "Home", to: "/" },
      { id: "work", group: "Navigate", label: "Work", to: "/work" },
      { id: "projects", group: "Navigate", label: "All projects · studio book", to: "/projects" },
      { id: "lookbook", group: "Navigate", label: "Lookbook", to: "/lookbook" },
      { id: "services", group: "Navigate", label: "Services", to: "/services" },
      { id: "process", group: "Navigate", label: "Process", to: "/process" },
      { id: "capabilities", group: "Navigate", label: "Capabilities", to: "/capabilities" },
      { id: "studio", group: "Navigate", label: "Studio / About", to: "/about" },
      { id: "press", group: "Navigate", label: "Press & Recognition", to: "/press" },
      { id: "clients", group: "Navigate", label: "Clients & Testimonials", to: "/clients" },
      { id: "journal", group: "Navigate", label: "Journal", to: "/journal" },
      { id: "now", group: "Navigate", label: "Now", to: "/now" },
      { id: "faq", group: "Navigate", label: "FAQ", to: "/faq" },
      { id: "pricing", group: "Navigate", label: "Pricing / Engagement", to: "/pricing" },
      { id: "archive", group: "Navigate", label: "Archive", to: "/archive" },
      { id: "expertise", group: "Navigate", label: "Expertise", to: "/expertise" },
      { id: "contact", group: "Navigate", label: "Contact", to: "/contact" },
      { id: "theme", group: "Actions", label: "Toggle theme", hint: "T", action: onToggleTheme },
      { id: "top", group: "Actions", label: "Scroll to top", hint: "↑", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      { id: "bottom", group: "Actions", label: "Scroll to bottom", hint: "↓", action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }) },
      { id: "copy-email", group: "Actions", label: "Copy email address", action: () => { navigator.clipboard?.writeText("hello@mariyaakter.me").catch(() => {}); } },
      { id: "email", group: "External", label: "Email — hello@mariyaakter.me", action: () => { window.location.assign("mailto:hello@mariyaakter.me"); } },
      { id: "instagram", group: "External", label: "Instagram", action: () => window.open("https://instagram.com", "_blank") },
      { id: "linkedin", group: "External", label: "LinkedIn", action: () => window.open("https://linkedin.com", "_blank") },
      { id: "behance", group: "External", label: "Behance", action: () => window.open("https://behance.net", "_blank") },
    ],
    [onToggleTheme],
  );

  const [fuse, setFuse] = useState<Fuse<Item> | null>(null);
  useEffect(() => {
    // Lazy-load fuse.js only when the palette is opened — keeps it out of
    // the initial JS bundle that blocks mobile LCP.
    if (!open) return;
    let cancelled = false;
    import("fuse.js").then(({ default: FuseCtor }) => {
      if (cancelled) return;
      setFuse(
        new FuseCtor(items, {
          keys: ["label", "group"],
          threshold: 0.4,
          ignoreLocation: true,
        }),
      );
    });
    return () => { cancelled = true; };
  }, [items, open]);

  const visible: Item[] = useMemo(() => {
    if (!q.trim()) {
      const recentItems = recents
        .map((id) => items.find((i) => i.id === id))
        .filter((i): i is Item => Boolean(i));
      const others = items.filter((i) => !recents.includes(i.id));
      return [
        ...recentItems.map((r) => ({ ...r, group: "Recent" })),
        ...others,
      ];
    }
    if (!fuse) {
      const lower = q.toLowerCase();
      return items.filter((i) => i.label.toLowerCase().includes(lower));
    }
    return fuse.search(q).map((r) => r.item);
  }, [q, fuse, items, recents]);

  const grouped = useMemo(() => {
    const map = new Map<string, Item[]>();
    visible.forEach((i) => {
      const arr = map.get(i.group) ?? [];
      arr.push(i);
      map.set(i.group, arr);
    });
    return Array.from(map.entries());
  }, [visible]);

  const trigger = `${q}|${open ? "1" : "0"}`;
  const [lastTrigger, setLastTrigger] = useState(trigger);
  if (lastTrigger !== trigger) {
    setLastTrigger(trigger);
    setActive(0);
  }

  const run = (i: Item) => {
    if (i.to) navigate(i.to);
    if (i.action) i.action();
    setOpen(false);
    setQ("");
    setRecents((r) => {
      const next = [i.id, ...r.filter((id) => id !== i.id)].slice(0, MAX_RECENTS);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      } else if (open && e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, visible.length - 1));
      } else if (open && e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (open && e.key === "Enter") {
        e.preventDefault();
        const item = visible[active];
        if (item) runRef.current(item);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, visible, active]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLButtonElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let idx = 0;
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
                aria-label="Search pages and actions"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-fg-muted"
              />
              <kbd className="text-[10px] uppercase tracking-widest text-fg-muted">Esc</kbd>
            </div>
            <div ref={listRef} className="max-h-[55vh] overflow-y-auto py-2">
              {grouped.length === 0 && (
                <div className="px-5 py-8 text-sm text-fg-muted">No matches.</div>
              )}
              {grouped.map(([group, list]) => (
                <div key={group} className="py-2">
                  <div className="px-5 pt-2 pb-1 text-[10px] uppercase tracking-widest text-fg-muted">{group}</div>
                  {list.map((i) => {
                    const myIdx = idx++;
                    const isActive = myIdx === active;
                    return (
                      <button
                        key={i.id}
                        data-idx={myIdx}
                        onMouseEnter={() => setActive(myIdx)}
                        onClick={() => run(i)}
                        className={`w-full flex items-center justify-between gap-4 px-5 py-2.5 text-sm transition-colors text-left ${isActive ? "bg-app-elev text-accent" : "hover:bg-app-elev"}`}
                      >
                        <span>{i.label}</span>
                        {i.hint && <span className="text-fg-muted text-xs">{i.hint}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-line text-[11px] text-fg-muted">
              <span>↑↓ navigate · ↵ select · type for fuzzy match</span>
              <span>⌘ K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
