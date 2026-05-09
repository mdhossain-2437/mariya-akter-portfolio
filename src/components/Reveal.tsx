import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "h1" | "h2" | "p" | "span" | "li";
  once?: boolean;
};

// Reveal is the workhorse fade-in-on-scroll wrapper used across every page.
// Implementation notes (matter for LCP):
//
// - SSR + initial client render: content is **visible** (opacity:1, no
//   translate). This means prerendered HTML paints immediately and the LCP
//   candidate can lock onto static markup with zero render delay. The
//   previous version rendered with opacity:0 + a useInView flip, which gave
//   Lighthouse a 4-7s "render delay" while React hydrated and animated the
//   hero in.
//
// - After mount, we synchronously check the element's position. If it's
//   already in the viewport (above-the-fold content like hero headings),
//   we leave it alone — no animation, no flash. If it's below the viewport,
//   we hide it (offscreen, so the flash isn't visible to the user) and
//   wire up an IntersectionObserver that fades it in when the user scrolls
//   to it. This preserves the original "fade up on scroll" effect for
//   below-the-fold content while keeping the above-the-fold content paint-
//   ready from the very first frame.
export default function Reveal({ children, delay = 0, y = 24, className, as = "div", once = true }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const vp = window.innerHeight || document.documentElement.clientHeight;
    const rect = node.getBoundingClientRect();
    const startsInView = rect.top < vp * 0.9 && rect.bottom > vp * 0.1;
    if (startsInView) {
      // Already on screen — leave it visible, no animation.
      return;
    }
    // Below the fold: hide it (user won't see the flash) and observe.
    setHidden(true);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          if (once) obs.disconnect();
        } else if (!once) {
          setHidden(true);
        }
      },
      { rootMargin: "-10% 0px -10% 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [once]);

  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 1, y: 0 }}
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
