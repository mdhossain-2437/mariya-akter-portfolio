import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/useTheme";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

type Ripple = { id: number; x: number; y: number; r: number; color: string; key: number };

export default function ThemeRipple() {
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const previousTheme = useRef<typeof theme>(theme);
  const idRef = useRef(0);

  useEffect(() => {
    if (previousTheme.current === theme) return;
    previousTheme.current = theme;
    if (reduced) return;
    const btn = document.querySelector('[aria-label="Toggle dark mode"]');
    const rect = btn?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 80;
    const y = rect ? rect.top + rect.height / 2 : 80;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const color = theme === "dark" ? "#0B0A09" : "#FBF7F1";
    const id = ++idRef.current;
    setRipples((rs) => [...rs, { id, x, y, r, color, key: id }]);
    const t = window.setTimeout(() => {
      setRipples((rs) => rs.filter((rr) => rr.id !== id));
    }, 900);
    return () => window.clearTimeout(t);
  }, [theme, reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      {ripples.map((r) => (
        <span
          key={r.key}
          style={{
            position: "absolute",
            left: r.x - r.r,
            top: r.y - r.r,
            width: r.r * 2,
            height: r.r * 2,
            borderRadius: "9999px",
            background: r.color,
            transform: "scale(0)",
            animation: "themeRipple 800ms cubic-bezier(0.22,1,0.36,1) forwards",
            willChange: "transform",
          }}
        />
      ))}
      <style>{`@keyframes themeRipple { to { transform: scale(1); opacity: 0; } }`}</style>
    </div>
  );
}
