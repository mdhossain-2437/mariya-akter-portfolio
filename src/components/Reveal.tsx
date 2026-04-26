import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "h1" | "h2" | "p" | "span" | "li";
  once?: boolean;
};

export default function Reveal({ children, delay = 0, y = 24, className, as = "div", once = true }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
