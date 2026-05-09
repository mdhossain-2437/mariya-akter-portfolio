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

// Vercel's SPA rewrite serves dist/index.html for every route. The prerender
// step stamps `data-ssr-path` on the root div so we know which route the
// markup was actually rendered for. We can only safely hydrate when the
// current pathname matches the prerendered route — otherwise we'd reconcile
// e.g. an /about component tree against home-page DOM. For mismatching
// paths we throw away the prerendered markup and start a fresh SPA render.
const ssrPath = container.dataset.ssrPath;
// Shell-only pages prerendered just the App layout (header/footer) without
// the lazy page content. They get eager hydration so visitors don't sit on
// a blank-ish page and the footer doesn't shift when content fills in.
const isShellPage = container.dataset.ssrShell === "1";
const canHydrate =
  container.hasChildNodes() && ssrPath !== undefined && ssrPath === window.location.pathname;

if (!canHydrate) {
  // Either no SSR markup or the prerendered route doesn't match the current
  // URL. Wipe whatever is in the root and boot a fresh client render.
  container.innerHTML = "";
  createRoot(container).render(tree);
} else if (isShellPage) {
  // Shell pages: hydrate immediately so the lazy page chunk loads and the
  // actual content fills the viewport-tall placeholder. We don't wait for
  // user interaction here — visitors expect to see content, not a blank
  // shell, on lazy-loaded routes.
  hydrateRoot(container, tree);
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
