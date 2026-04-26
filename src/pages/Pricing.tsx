import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Magnetic from "../components/Magnetic";
import Seo from "../components/Seo";
import { services, addOns } from "../data/services";

const TIERS = [
  {
    title: "Identity",
    price: "From $8,500",
    description: "Brand identity for emerging houses, makers, and product launches.",
    bullets: ["Discovery + positioning", "Logotype + secondary marks", "Type & color system", "Photography direction", "Brand guidelines"],
    href: "/services",
  },
  {
    title: "Studio",
    price: "From $5,500 / mo",
    description: "Ongoing creative direction across digital, campaign, and editorial.",
    bullets: ["Quarterly creative roadmap", "Weekly working sessions", "Always-on Slack channel", "Channel-ready output", "Performance reviews"],
    featured: true,
    href: "/services",
  },
  {
    title: "Flagship",
    price: "From $25,000",
    description: "End-to-end build — identity, site, launch campaign, press kit.",
    bullets: ["Identity package", "Award-grade website", "Launch campaign", "Press kit", "60-day post-launch care"],
    href: "/services",
  },
];

export default function Pricing() {
  return (
    <div className="pt-24 md:pt-32">
      <Seo title="Pricing & Engagement" path="/pricing" description="Three engagement tiers — Identity from $8.5k, Studio from $5.5k/month, Flagship from $25k. Honest scope, clear deliverables." />
      <section className="container-wide">
        <Reveal><p className="label">Engagement · 2024–2025</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="heading-display text-[clamp(3rem,12vw,11rem)] mt-4">
            How we <em className="italic text-accent">work</em> together.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-fg-muted text-lg leading-relaxed">
            Three primary engagements. Fixed-fee or monthly retainer — never hourly.
            Numbers below are starting points; final scope is sized to the brief.
          </p>
        </Reveal>
      </section>

      <section className="container-wide mt-20 md:mt-28 grid md:grid-cols-3 gap-6 md:gap-8">
        {TIERS.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.05}>
            <div
              className={`relative h-full rounded-2xl p-8 md:p-10 transition-colors ${
                t.featured ? "bg-accent text-cream-100" : "surface"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-8 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest2 bg-app text-accent">
                  Most popular
                </span>
              )}
              <h2 className={`font-serif text-3xl ${t.featured ? "" : ""}`}>{t.title}</h2>
              <div className={`mt-2 font-mono text-sm ${t.featured ? "text-cream-100/80" : "text-fg-muted"}`}>
                {t.price}
              </div>
              <p className={`mt-4 leading-relaxed ${t.featured ? "text-cream-100/90" : "text-fg-muted"}`}>
                {t.description}
              </p>
              <ul className="mt-8 space-y-2 text-sm">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className={`mt-1 ${t.featured ? "text-cream-100" : "text-accent"}`}>—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-10 inline-flex items-center justify-center px-6 py-3 rounded-full uppercase text-xs font-semibold tracking-widest2 transition-colors ${
                  t.featured ? "bg-app text-accent hover:bg-app-elev" : "btn-outline"
                }`}
              >
                Inquire
              </Link>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container-wide py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="label">Service catalog</p>
            <h2 className="heading-display text-4xl md:text-6xl mt-3">By craft.</h2>
            <p className="mt-6 text-fg-muted leading-relaxed max-w-md">
              Most engagements blend two or three of these. We sequence them by what
              moves the brand fastest — not what looks neatest on a deck.
            </p>
          </div>
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <div className="surface rounded-xl p-6 h-full">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl">{s.title}</h3>
                    {s.startingFrom && <span className="font-mono text-xs text-accent">{s.startingFrom}</span>}
                  </div>
                  <p className="mt-3 text-fg-muted text-sm leading-relaxed">{s.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-16 md:py-24 border-t border-line">
        <p className="label">Add-ons</p>
        <h2 className="heading-display text-4xl md:text-6xl mt-3 mb-12">Smaller asks, sharper deliverables.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addOns.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.03}>
              <div className="surface rounded-xl p-6 h-full">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-xl">{a.title}</h3>
                  <span className="font-mono text-xs text-accent">{a.price}</span>
                </div>
                <p className="mt-2 text-sm text-fg-muted">{a.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-wide py-24 md:py-36 text-center">
        <Reveal>
          <h2 className="heading-display text-5xl md:text-7xl">
            Have a <em className="italic text-accent">project</em> in mind?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl mx-auto text-fg-muted text-lg">
            Two slots open this quarter. Inquiries get a reply within 48 hours.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 inline-block">
            <Magnetic strength={0.2}>
              <Link to="/contact" className="btn-primary">Start a project</Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
