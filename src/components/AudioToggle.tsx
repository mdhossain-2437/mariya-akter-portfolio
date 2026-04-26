import { useEffect, useRef, useState } from "react";

export default function AudioToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscARef = useRef<OscillatorNode | null>(null);
  const oscBRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    return () => {
      try {
        oscARef.current?.stop();
        oscBRef.current?.stop();
        ctxRef.current?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const toggle = async () => {
    if (on) {
      try {
        gainRef.current?.gain.exponentialRampToValueAtTime(0.0001, (ctxRef.current?.currentTime ?? 0) + 0.6);
        setTimeout(() => {
          oscARef.current?.stop();
          oscBRef.current?.stop();
          oscARef.current?.disconnect();
          oscBRef.current?.disconnect();
          gainRef.current?.disconnect();
          filterRef.current?.disconnect();
          oscARef.current = null;
          oscBRef.current = null;
        }, 700);
      } catch {
        // ignore
      }
      setOn(false);
      return;
    }
    type AudioCtor = typeof AudioContext;
    const w = window as Window & { webkitAudioContext?: AudioCtor };
    const Ctor: AudioCtor | undefined = window.AudioContext ?? w.webkitAudioContext;
    if (!Ctor) return;
    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    oscA.type = "sine";
    oscB.type = "sine";
    oscA.frequency.value = 110;
    oscB.frequency.value = 110.5;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    oscA.start();
    oscB.start();
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.4);
    oscARef.current = oscA;
    oscBRef.current = oscB;
    gainRef.current = gain;
    filterRef.current = filter;
    setOn(true);
  };

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Mute ambient audio" : "Play ambient audio"}
      onClick={toggle}
      className="fixed bottom-5 right-5 z-30 flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg-elev)] px-3 text-[10px] uppercase tracking-[0.18em] text-[var(--fg-muted)] backdrop-blur transition-colors hover:text-[var(--accent)]"
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span
          className={`absolute h-2 w-2 rounded-full ${on ? "bg-[var(--accent)]" : "bg-[var(--fg-muted)]"}`}
        />
        {on && (
          <span className="absolute h-2 w-2 animate-ping rounded-full bg-[var(--accent)]" />
        )}
      </span>
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
