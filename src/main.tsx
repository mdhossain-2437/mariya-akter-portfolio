import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

const container = document.getElementById("root")!;
const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

const isPrerendered = container.hasChildNodes();

if (!isPrerendered) {
  // No SSR markup (e.g. SPA fallback for non-prerendered routes) — boot
  // a fresh client-side render.
  createRoot(container).render(tree);
} else {
  // Static HTML is fully painted. Wait for the first user signal — pointer,
  // keyboard, scroll, or visibility change — before hydrating, so the LCP
  // entry locks in from the prerendered paint and we don't pay React's
  // render cost during the LCP window.
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    cleanup();
    hydrateRoot(container, tree);
  };

  const events = ["pointerdown", "keydown", "touchstart", "scroll", "wheel", "click"] as const;
  const cleanup = () => {
    events.forEach((ev) => window.removeEventListener(ev, start, { capture: true } as EventListenerOptions));
  };
  events.forEach((ev) => window.addEventListener(ev, start, { passive: true, capture: true } as AddEventListenerOptions));

  // Safety net: if no interaction happens, hydrate when the browser goes
  // idle so links and forms still work for keyboardless visitors. We use a
  // generous timeout so this fires after LCP / Lighthouse measurement.
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(start, { timeout: 4000 });
  else setTimeout(start, 4000);
}
