export default function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[120] -translate-y-24 rounded-full bg-[var(--accent)] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition-transform focus:translate-y-0 focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
