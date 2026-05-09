import { useEffect, useRef, useState } from "react";

type Props = {
  /** The numeric target the counter should land on. */
  to: number;
  /** Optional suffix appended after the number (e.g. "+"). */
  suffix?: string;
  /** Total animation duration in milliseconds. Defaults to 1500. */
  duration?: number;
  /** Optional className for the wrapping <span>. */
  className?: string;
};

// Cubic ease-out: fast at the start, settles gently at the target.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Counts from 0 up to `to` once the element scrolls into view. SSR-safe:
// the initial render shows the final value (so the prerendered HTML and
// the first client paint look correct and there's no hydration mismatch);
// after mount, if the element starts off-screen and the user respects
// motion, we reset to 0 and animate up when they scroll into view.
export default function CountUp({ to, suffix = "", duration = 1500, className }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState<number>(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Honor prefers-reduced-motion — leave the displayed value at its
    // initial state (which is already `to`) so the user just sees the
    // final number with no animation.
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    let raf = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      setDisplay(0);
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setDisplay(Math.round(eased * to));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    // Start counting only when the stat scrolls into view.
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    obs.observe(node);

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
