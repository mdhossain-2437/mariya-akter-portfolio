import { useEffect } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let destroy: (() => void) | null = null;
    let cancelled = false;
    // Defer Lenis to idle time so it doesn't compete with LCP paint.
    const kick = () => {
      if (cancelled) return;
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          lerp: 0.1,
        });
        const raf = (time: number) => {
          lenis.raf(time);
          frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
        destroy = () => {
          cancelAnimationFrame(frame);
          lenis.destroy();
        };
      });
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(kick, { timeout: 1500 });
    else setTimeout(kick, 400);
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [reduced]);
  return null;
}
