import type { ReactNode } from "react";

type Props = { children: ReactNode };

// Plain CSS fade-in — avoids pulling framer-motion into the initial bundle
// just to animate route changes. See .page-transition-enter in index.css.
export default function PageTransition({ children }: Props) {
  return <div className="page-transition-enter">{children}</div>;
}
