import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import SkipLink from "./components/SkipLink";

// Non-critical UI — split out of the initial bundle so mobile LCP doesn't wait
// for framer-motion/lenis/fuse to download + parse. They mount ~idle after
// React's first commit.
const Cursor = lazy(() => import("./components/Cursor"));
const SmoothScroll = lazy(() => import("./components/SmoothScroll"));
const ScrollProgress = lazy(() => import("./components/ScrollProgress"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const AudioToggle = lazy(() => import("./components/AudioToggle"));
const ThemeRipple = lazy(() => import("./components/ThemeRipple"));
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/useTheme";

// Home is eager (needed for LCP on first paint).
import Home from "./pages/Home";

// Everything else is lazy-loaded — keeps the initial JS bundle small.
const Work = lazy(() => import("./pages/Work"));
const Archive = lazy(() => import("./pages/Archive"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Expertise = lazy(() => import("./pages/Expertise"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Journal = lazy(() => import("./pages/Journal"));
const JournalEntry = lazy(() => import("./pages/JournalEntry"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Lookbook = lazy(() => import("./pages/Lookbook"));
const Process = lazy(() => import("./pages/Process"));
const Press = lazy(() => import("./pages/Press"));
const Clients = lazy(() => import("./pages/Clients"));
const Now = lazy(() => import("./pages/Now"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Terms = lazy(() => import("./pages/Terms"));
const Capabilities = lazy(() => import("./pages/Capabilities"));
const Projects = lazy(() => import("./pages/Projects"));
const RepoDetail = lazy(() => import("./pages/RepoDetail"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function useAfterPaint() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric
      ? ric(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 600);
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);
  return ready;
}

function AppRoutes() {
  const location = useLocation();
  const { toggle } = useTheme();
  const ambientReady = useAfterPaint();
  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <Header />
      <main id="main" className="relative">
        <PageTransition key={location.pathname}>
          <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/work" element={<Work />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<RepoDetail />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                <Route path="/lookbook" element={<Lookbook />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/expertise" element={<Expertise />} />
                <Route path="/services" element={<Services />} />
                <Route path="/process" element={<Process />} />
                <Route path="/capabilities" element={<Capabilities />} />
                <Route path="/press" element={<Press />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/now" element={<Now />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/:slug" element={<JournalEntry />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
      {ambientReady && (
        <Suspense fallback={null}>
          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
          <CommandPalette onToggleTheme={toggle} />
          <ThemeRipple />
          <AudioToggle />
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
