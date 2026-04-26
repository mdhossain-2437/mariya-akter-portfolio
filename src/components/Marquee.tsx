import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
  speed?: "fast" | "normal" | "slow";
};

export default function Marquee({ children, reverse, className = "", pauseOnHover = true, speed = "normal" }: Props) {
  const animClass =
    speed === "fast"
      ? "animate-marquee"
      : speed === "slow"
      ? "animate-marquee-slow"
      : reverse
      ? "animate-marquee-reverse"
      : "animate-marquee";
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        className={`marquee-track ${animClass}`}
        style={{
          animationPlayState: pauseOnHover ? undefined : "running",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
