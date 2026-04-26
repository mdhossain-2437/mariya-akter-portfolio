import { useEffect, useRef } from "react";
import { useIsTouch } from "../lib/useIsTouch";

export default function Cursor() {
  const isTouch = useIsTouch();
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isTouch) return;
    document.body.classList.add("cursor-on");
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%,-50%)`;
      }
    };
    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement | null)?.closest(
        "a, button, [role='button'], [data-cursor='hover'], input, select, textarea"
      );
      if (!ring.current) return;
      if (el) {
        const isText = el.matches("input, textarea, [contenteditable='true']");
        ring.current.dataset.state = isText ? "text" : "hover";
      } else {
        ring.current.dataset.state = "default";
      }
    };
    const onLeave = () => {
      if (ring.current) ring.current.dataset.state = "hidden";
    };
    let frame = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%,-50%)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerleave", onLeave);
      document.body.classList.remove("cursor-on");
    };
  }, [isTouch]);

  if (isTouch) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" data-state="default" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
