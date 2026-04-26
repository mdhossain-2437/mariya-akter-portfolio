import { useState } from "react";
import { journalPosts, previousCurations } from "../data/journal";

export default function Journal() {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);
  const featured = journalPosts.find((p) => p.feature && p.slug !== "post-digital-aesthetic")!;
  const futureTrend = journalPosts.find((p) => p.slug === "post-digital-aesthetic")!;
  const others = journalPosts.filter((p) => p !== featured && p !== futureTrend);

  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-16">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7 fade-up">
            <h1 className="font-serif italic text-fg leading-[1] text-[clamp(2.8rem,8.5vw,6.5rem)]">
              Thoughts &<br />
              Perspectives
            </h1>
          </div>
          <div className="md:col-span-5">
            <p className="text-fg-muted max-w-xs leading-relaxed">
              A curated archive of insights at the intersection of haute couture,
              visual identity, and the digital frontier.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container-narrow pb-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8 relative">
            <div className="aspect-[5/4] overflow-hidden bg-ink-900">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:absolute md:bottom-12 md:right-[-15%] mt-4 md:mt-0 bg-app p-6 md:p-8 max-w-md shadow-xl">
              <p className="label">{featured.category}</p>
              <h3 className="mt-3 font-serif italic text-xl md:text-2xl text-fg leading-tight">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm text-fg-muted">{featured.excerpt}</p>
              <a
                href="#"
                className="mt-4 inline-block label hover:text-accent-dark"
              >
                Read Journal →
              </a>
            </div>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="label-muted">{featured.date}</p>
          </div>
        </div>
      </section>

      {/* Two-up grid */}
      <section className="container-narrow py-12">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          {others.map((p, i) => (
            <article key={p.slug} className={i === 1 ? "md:mt-24" : ""}>
              <div className="aspect-[4/3] overflow-hidden bg-ink-900">
                <img src={p.cover} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="label-muted">{p.category}</p>
                <p className="label-muted">{p.date}</p>
              </div>
              <h3 className="mt-3 font-serif italic text-xl md:text-2xl text-fg leading-snug">
                {p.title}
              </h3>
              <p className="mt-3 text-fg-muted text-sm leading-relaxed">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Future Trends */}
      <section className="container-narrow py-20">
        <div className="bg-app-elev rounded-sm p-8 md:p-14 grid md:grid-cols-12 gap-10 items-center relative overflow-hidden">
          <div className="absolute font-serif italic text-[10rem] text-fg-muted/30 leading-none -bottom-10 left-1/4 select-none pointer-events-none">
            Future
          </div>
          <div className="md:col-span-7 relative">
            <p className="label">{futureTrend.category}</p>
            <h3 className="mt-4 font-serif italic text-3xl md:text-5xl leading-tight text-fg">
              {futureTrend.title}
            </h3>
            <p className="mt-5 max-w-md text-fg-muted leading-relaxed">
              {futureTrend.excerpt}
            </p>
            <a href="#" className="mt-6 inline-block btn-outline">Read Deep Dive</a>
          </div>
          <div className="md:col-span-5">
            <div className="aspect-square overflow-hidden bg-ink-900 rotate-2 shadow-xl">
              <img src={futureTrend.cover} alt={futureTrend.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Previous curations */}
      <section className="container-narrow py-20">
        <p className="label-muted text-center">Previous Curations</p>
        <ul className="mt-10 max-w-4xl mx-auto divide-y divide-[var(--line)]">
          {previousCurations.map((c) => (
            <li key={c.title} className="flex items-center justify-between py-6 md:py-8 gap-6">
              <span className="label-muted whitespace-nowrap">{c.date}</span>
              <span className="font-serif italic text-lg md:text-2xl text-fg text-center flex-1">
                {c.title}
              </span>
              <span className="label-muted whitespace-nowrap">{c.category}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter */}
      <section className="container-narrow pb-24">
        <div className="bg-app-elev rounded-sm py-16 px-6 md:px-12 text-center">
          <h3 className="font-serif italic text-3xl md:text-4xl text-fg">
            Weekly Perspectives
          </h3>
          <p className="mt-3 max-w-md mx-auto text-fg-muted">
            Join 5,000+ professionals receiving curated insights on design, strategy,
            and aesthetics.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubbed(true);
              setEmail("");
              setTimeout(() => setSubbed(false), 4000);
            }}
            className="mt-8 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-app border border-line px-5 py-4 outline-none focus:border-accent placeholder:italic placeholder:text-fg-muted text-center"
            />
            <button type="submit" className="mt-4 label hover:text-accent-dark">
              {subbed ? "Subscribed →" : "Subscribe →"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
