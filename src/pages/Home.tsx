import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "../components/Arrow";

const TAGS = ["Graphics Design", "Digital Marketing", "Fashion Designer", "Creative Direction"];

const FEATURED = [
  {
    n: "01",
    category: "Fashion Design",
    title: "Velvet Silence",
    blurb:
      "A limited collection exploring the tactile relationship between raw silk and industrial concrete. Winner of the 2023 Creative Excellence Award.",
    cta: "Discover Project",
    slug: "velvet-silence",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80",
    flip: false,
  },
  {
    n: "02",
    category: "Digital Strategy",
    title: "Neon Renaissance",
    blurb:
      "Redefining digital presence for high-end boutique brands through minimalist storytelling and performance-driven data.",
    cta: "View Case Study",
    slug: "neon-renaissance",
    image:
      "https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=1400&q=80",
    flip: true,
  },
];

const EXPLORATIONS = [
  { year: "2024", title: "Identity for 'Solace'" },
  { year: "2023", title: "Lumina Campaign" },
  { year: "2023", title: "Editorial Vol. IV" },
];

export default function Home() {
  return (
    <div className="pt-16 md:pt-20">
      {/* HERO */}
      <section className="container-narrow pt-10 md:pt-16 pb-24 md:pb-32 grain">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 fade-up">
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
              {TAGS.map((t, i) => (
                <span
                  key={t}
                  className={`uppercase tracking-widest2 text-[0.65rem] sm:text-[0.7rem] font-medium ${
                    i % 2 === 0 ? "text-accent" : "text-ink-500"
                  }`}
                >
                  {t}
                  {i < TAGS.length - 1 && <span className="ml-4 text-ink-300">/</span>}
                </span>
              ))}
            </div>

            <h1 className="font-serif font-medium text-ink-900 leading-[0.95] text-[clamp(3.4rem,11vw,9.5rem)]">
              Mariya
              <br />
              <span className="italic text-accent">Akter.</span>
            </h1>

            <p className="mt-10 max-w-xl text-ink-700 text-base md:text-[1.05rem] leading-relaxed">
              A multidisciplinary creative weaving fashion's tactile poetry, brand
              narratives, and data-driven digital marketing into singular,
              resonant stories. Currently based between Dhaka and the digital frontier.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Link to="/work" className="btn-primary">
                View Work <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/about"
                className="font-serif italic text-ink-700 hover:text-accent transition-colors text-base"
              >
                The Philosophy →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 fade-up-delay-2">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto rounded-sm overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]">
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=80"
                alt="Mariya Akter, portrait"
                className="w-full h-full object-cover grayscale-[20%]"
              />
              <div className="absolute -bottom-4 -left-4 hidden sm:block bg-cream-100 px-5 py-4 shadow-lg max-w-[14rem]">
                <p className="label">Studio Note</p>
                <p className="font-serif italic text-sm text-ink-800 mt-1 leading-snug">
                  "Design is the silent ambassador of your brand."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED EXHIBITIONS */}
      <section className="bg-cream-200 py-24 md:py-32">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
            <div>
              <p className="label">Archive 01</p>
              <h2 className="font-serif italic text-4xl md:text-5xl mt-3 text-ink-900">
                Selected Exhibitions
              </h2>
            </div>
            <p className="font-serif italic text-ink-600 max-w-xs md:text-right">
              "Design is the silent ambassador of your brand."
            </p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {FEATURED.map((p) => (
              <div
                key={p.slug}
                className="grid md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                <div
                  className={`md:col-span-7 ${
                    p.flip ? "md:order-2" : ""
                  }`}
                >
                  <Link
                    to={`/work/${p.slug}`}
                    className="block aspect-[5/4] overflow-hidden bg-ink-900 group"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                </div>
                <div
                  className={`md:col-span-5 ${
                    p.flip ? "md:order-1 md:text-right" : ""
                  }`}
                >
                  <p className="label-muted">
                    {p.n} / {p.category.toUpperCase()}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl mt-3 text-ink-900 italic">
                    {p.title}
                  </h3>
                  <p className="mt-5 text-ink-700 leading-relaxed max-w-md md:inline-block">
                    {p.blurb}
                  </p>
                  <Link
                    to={`/work/${p.slug}`}
                    className="mt-6 inline-block link-underline"
                  >
                    {p.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORATIONS */}
      <section className="py-24 md:py-32">
        <div className="container-narrow">
          <p className="label-muted text-center">Explorations & Craft</p>
          <div className="mt-12 max-w-4xl mx-auto divide-y divide-ink-200">
            {EXPLORATIONS.map((e) => (
              <Link
                key={e.title}
                to="/archive"
                className="group flex items-center justify-between py-6 md:py-8 hover:px-2 transition-all"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="text-xs text-ink-500 font-mono">{e.year}</span>
                  <span className="font-serif text-2xl md:text-3xl text-ink-900">
                    {e.title}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-ink-500 group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/archive" className="btn-outline">
              Full Archive <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
