import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";
import CommandPalette from "./components/CommandPalette";
import AudioToggle from "./components/AudioToggle";
import ThemeRipple from "./components/ThemeRipple";
import SkipLink from "./components/SkipLink";
import Seo from "./components/Seo";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./context/useTheme";

import Home from "./pages/Home";
import Work from "./pages/Work";
import Archive from "./pages/Archive";
import CaseStudy from "./pages/CaseStudy";
import Expertise from "./pages/Expertise";
import About from "./pages/About";
import Services from "./pages/Services";
import Journal from "./pages/Journal";
import JournalEntry from "./pages/JournalEntry";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Lookbook from "./pages/Lookbook";
import Process from "./pages/Process";
import Press from "./pages/Press";
import Clients from "./pages/Clients";
import Now from "./pages/Now";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Capabilities from "./pages/Capabilities";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const { toggle } = useTheme();
  return (
    <>
      <Seo />
      <SkipLink />
      <ScrollToTop />
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      <LoadingScreen />
      <CommandPalette onToggleTheme={toggle} />
      <ThemeRipple />
      <Header />
      <main id="main" className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
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
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <AudioToggle />
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
