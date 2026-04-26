import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(sessionStorage.getItem("intro-seen"));
    } catch {
      return false;
    }
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (done) return;
    let raf = 0;
    const start = performance.now();
    const total = 1700;
    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      setCount(pct);
      if (elapsed < total) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("intro-seen", "1");
        setTimeout(() => setDone(true), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-app text-fg flex items-end justify-between px-6 md:px-12 pb-10 md:pb-14"
        >
          <div className="flex items-end gap-6">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[14vw] md:text-[8vw] leading-none"
            >
              <span className="font-medium">Mariya</span>
              <span className="italic font-light"> Akter</span>
              <span className="text-accent">.</span>
            </motion.div>
          </div>
          <div className="font-mono text-xs md:text-sm tabular-nums text-fg-muted tracking-widest">
            {count.toString().padStart(3, "0")}
            <span className="text-accent">%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
