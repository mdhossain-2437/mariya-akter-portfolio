import { Link } from "react-router-dom";

const SERVICES = [
  {
    n: "01",
    title: "Brand Identity",
    body:
      "More than just a logo. We build comprehensive visual systems that communicate your values at every touchpoint. From typography pairing to color psychology and motion guidelines.",
    bullets: ["Visual Strategy", "Logo & Iconography", "Brand Style Guide"],
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    flip: false,
  },
  {
    n: "02",
    title: "Digital Marketing",
    body:
      "Strategic growth through storytelling. We blend data-driven performance with high-end creative to ensure your message reaches the right audience without losing its soul.",
    bullets: ["Content Strategy", "Paid Media Design", "Social Media Ecosystems"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    flip: true,
  },
  {
    n: "03",
    title: "Fashion Creative Direction",
    body:
      "Visualizing the future of style. From seasonal campaign concepts to on-set art direction, we translate fashion concepts into compelling visual narratives.",
    bullets: ["Campaign Ideation", "Art Direction", "Lookbook Production"],
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    flip: false,
  },
];

const TIERS = [
  {
    n: "01",
    label: "Foundation",
    name: "Essential",
    price: "$2,450",
    cadence: "/ project",
    blurb: "Perfect for solo entrepreneurs or small start-ups needing a refined visual presence.",
    features: [
      "Core Logo Identity",
      "Typography & Color Palette",
      "3-Page Website Blueprint",
      "1 Round of Revisions",
    ],
    primary: false,
  },
  {
    n: "02",
    label: "Growth",
    name: "Elevated",
    price: "$5,800",
    cadence: "/ project",
    blurb: "A complete brand transformation with integrated digital marketing strategy.",
    features: [
      "Full Brand Visual System",
      "Custom Web UI Design",
      "Social Content Playbook",
      "1 Month Performance Support",
      "3 Rounds of Revisions",
    ],
    primary: true,
    badge: "Most Popular",
  },
  {
    n: "03",
    label: "Partnership",
    name: "Bespoke",
    price: "from $12k",
    cadence: "",
    blurb: "End-to-end creative direction for high-impact campaigns and long-term scaling.",
    features: [
      "Fashion Creative Direction",
      "Multi-Channel Campaigning",
      "Product Concept Workshop",
      "Unlimited Direct Messaging",
      "White-Glove Execution",
    ],
    primary: false,
  },
];

export default function Services() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-20">
        <p className="label">Services & Pricing</p>
        <h1 className="mt-6 font-serif text-ink-900 leading-[1.02] text-[clamp(2.6rem,7vw,5.5rem)]">
          <em>Cultivating brands</em> through<br />
          intentional design <em>and strategic</em>
          <br />
          narrative.
        </h1>
        <p className="mt-8 max-w-xl text-ink-700 leading-relaxed">
          A multidisciplinary approach to elevate your vision. I partner with
          founders and creative houses to bridge the gap between aesthetic excellence
          and commercial performance.
        </p>
      </section>

      {SERVICES.map((s) => (
        <section key={s.n} className="container-narrow py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className={`md:col-span-7 ${s.flip ? "md:order-2" : ""}`}>
              <div className="aspect-[4/3] overflow-hidden bg-ink-900">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className={`md:col-span-5 ${s.flip ? "md:order-1" : ""}`}>
              <p className="font-serif italic text-accent">{s.n} —</p>
              <h3 className="mt-3 font-serif text-3xl md:text-4xl text-ink-900">{s.title}</h3>
              <p className="mt-4 text-ink-700 leading-relaxed">{s.body}</p>
              <ul className="mt-6 space-y-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 label-muted">
                    <span className="text-accent">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* Pricing */}
      <section className="bg-cream-200 py-24 md:py-32">
        <div className="container-narrow text-center">
          <h2 className="font-serif italic text-4xl md:text-5xl text-ink-900">Investment Tiers</h2>
          <p className="mt-4 max-w-md mx-auto text-ink-700">
            Transparent pricing designed for projects of all scales, from emerging
            boutiques to established global brands.
          </p>
        </div>

        <div className="container-narrow mt-16 grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-sm p-8 md:p-10 flex flex-col ${
                t.primary
                  ? "bg-cream-100 border-t-2 border-accent shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] md:-mt-4 md:-mb-4"
                  : "bg-cream-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className={`label ${t.primary ? "text-accent" : "text-accent"}`}>
                  {t.n} / {t.label}
                </p>
                {t.badge && (
                  <span className="bg-accent text-cream-100 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest2">
                    {t.badge}
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-serif text-2xl md:text-3xl text-ink-900">{t.name}</h3>
              <p className="mt-4 font-serif text-ink-900">
                <span className="text-sm align-top">$</span>
                <span className="text-4xl md:text-5xl font-medium">
                  {t.price.replace("$", "").replace("from ", "")}
                </span>
                {t.price.startsWith("from") && (
                  <span className="text-sm ml-1">k</span>
                )}
                {t.cadence && (
                  <span className="text-sm text-ink-500 ml-2">{t.cadence}</span>
                )}
              </p>
              <p className="mt-6 text-ink-700 text-sm leading-relaxed">{t.blurb}</p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-ink-800 text-sm">
                    <span className="text-accent">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex-1" />
              <Link
                to="/contact"
                className={`mt-10 inline-flex items-center justify-center px-6 py-3 rounded-md uppercase text-xs font-semibold tracking-widest2 transition-colors ${
                  t.primary
                    ? "bg-accent text-cream-100 hover:bg-accent-dark"
                    : "border border-accent text-accent hover:bg-accent hover:text-cream-100"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow py-24 md:py-32 text-center">
        <h2 className="font-serif italic text-4xl md:text-6xl text-ink-900 leading-tight">
          Ready to define your <br />
          next chapter?
        </h2>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-center gap-6">
          <Link to="/contact" className="link-underline">
            Schedule A Discovery Call
          </Link>
          <Link to="/work" className="label-muted hover:text-accent">
            Download Service Guide (PDF)
          </Link>
        </div>
      </section>
    </div>
  );
}
