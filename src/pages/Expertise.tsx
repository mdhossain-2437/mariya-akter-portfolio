import { Link } from "react-router-dom";

const CAPABILITIES = [
  {
    n: "01",
    title: "Brand Identity",
    section: "The Foundation",
    body:
      "Beyond logos, I construct visual ecosystems. We define the soul of your brand through bespoke typography, a calibrated color language, and a narrative that speaks before a single word is read.",
    bullets: ["Visual Narrative", "Typographic Systems", "Brand Style Guides"],
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
    flip: false,
    bg: "bg-cream-100",
  },
  {
    n: "02",
    title: "Digital Marketing Strategy",
    section: "The Reach",
    body:
      "Data-driven but creatively led. I design digital journeys that convert curiosity into loyalty. From high-conversion funnels to organic social ecosystems that pulse with your brand's unique energy.",
    bullets: ["Performance Funnels", "Editorial Social", "SEO & Storytelling"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    flip: true,
    bg: "bg-cream-100",
  },
  {
    n: "03",
    title: "Fashion Creative Direction",
    section: "The Vision",
    body:
      "Visualizing the future of style. From seasonal campaign concepts to on-set art direction, we translate fashion concepts into compelling visual narratives.",
    bullets: ["Campaign Ideation", "Art Direction", "Lookbook Production"],
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    flip: false,
    bg: "bg-cream-200",
  },
];

export default function Expertise() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-20">
        <p className="label">Capabilities & Method</p>
        <h1 className="mt-6 font-serif text-ink-900 leading-[1] text-[clamp(3rem,9vw,7rem)]">
          Crafting <em className="text-accent">Resonance</em>
          <br />through Intention.
        </h1>
        <p className="mt-8 max-w-xl text-ink-700 leading-relaxed">
          A multidisciplinary approach blending high-fashion aesthetics with
          digital-first strategy to elevate brands into cultural icons.
        </p>
      </section>

      <div>
        {CAPABILITIES.map((c) => (
          <section key={c.n} className={`${c.bg} py-20 md:py-28`}>
            <div className="container-narrow grid md:grid-cols-12 gap-10 md:gap-16 items-center">
              <div className={`md:col-span-7 ${c.flip ? "md:order-2" : ""}`}>
                <div className="aspect-[5/3] overflow-hidden bg-ink-900">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-serif italic text-3xl md:text-4xl text-ink-900 mt-6 flex items-baseline gap-3">
                  <span className="text-sm not-italic text-ink-400 font-mono">{c.n}</span>
                  {c.title}
                </h3>
              </div>

              <div className={`md:col-span-5 ${c.flip ? "md:order-1" : ""}`}>
                <p className="label">{c.section}</p>
                <p className="mt-4 text-ink-800 leading-relaxed">{c.body}</p>
                <ul className="mt-6 space-y-2">
                  {c.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-center gap-3 text-sm text-ink-700"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to="/work" className="mt-8 inline-block link-underline">
                  View Case Studies
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="container-narrow py-24 md:py-32 text-center">
        <p className="label-muted">Pricing</p>
        <h2 className="mt-4 font-serif italic text-4xl md:text-5xl text-ink-900">
          Transparent Investment Tiers
        </h2>
        <p className="mt-4 max-w-md mx-auto text-ink-700">
          See full service tiers and engagement structures.
        </p>
        <Link to="/services" className="mt-8 inline-block btn-primary">
          View Services & Pricing
        </Link>
      </section>
    </div>
  );
}
