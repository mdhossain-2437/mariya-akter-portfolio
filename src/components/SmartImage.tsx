import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  aspect?: string;
  rounded?: string;
};

export default function SmartImage({ aspect, rounded = "rounded-md", className, alt, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    if (ref.current && ref.current.complete) setLoaded(true);
  }, []);
  return (
    <span className={cn("relative block overflow-hidden bg-[var(--bg-elev)]", rounded, aspect)}>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          background:
            "linear-gradient(120deg, var(--bg-elev) 0%, color-mix(in oklab, var(--bg-elev) 70%, var(--accent) 30%) 50%, var(--bg-elev) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s linear infinite",
        }}
      />
      <img
        ref={ref}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-[transform,opacity,filter] duration-700",
          loaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.04] blur-md",
          className,
        )}
        {...rest}
      />
    </span>
  );
}
