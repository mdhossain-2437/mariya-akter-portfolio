import type { ReactNode } from "react";

export default function SectionLabel({
  children,
  muted = false,
  className = "",
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`uppercase tracking-widest2 text-[0.7rem] sm:text-xs font-medium ${
        muted ? "text-fg-muted" : "text-accent"
      } ${className}`}
    >
      {children}
    </p>
  );
}
