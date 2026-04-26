import { useState } from "react";
import { ArrowRight } from "../components/Arrow";

const NATURES = ["Brand Identity", "Digital Strategy", "Creative Direction"];

const HIGHLIGHTS = [
  { title: "L'Art de Vivre", meta: "Editorial Design / 2023" },
  { title: "Kinfolk Collective", meta: "Visual Identity / 2024" },
  { title: "Nômade Digital", meta: "Marketing Strategy / 2022" },
  { title: "Maison Pliée", meta: "Brand Identity / 2024" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    nature: "Brand Identity",
    narrative: "",
  });
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-16">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8 fade-up">
            <h1 className="font-serif text-fg leading-[1] text-[clamp(3rem,9vw,7rem)]">
              Let's bring <em className="text-accent">meaning</em>
              <br />to the noise.
            </h1>
          </div>
          <div className="md:col-span-4 fade-up-delay-1">
            <p className="text-fg-muted leading-relaxed">
              Collaborating with visionary brands to create digital exhibitions that
              breathe. Currently accepting select projects for Q3 2024.
            </p>
            <div className="mt-4 w-12 h-px bg-ink-300" />
          </div>
        </div>
      </section>

      <section className="container-narrow pb-24 grid md:grid-cols-12 gap-10">
        <aside className="md:col-span-5">
          <div className="bg-app-elev rounded-sm p-8 md:p-10">
            <p className="label-muted">Direct Communication</p>
            <p className="mt-3 font-serif italic text-2xl text-fg">
              hello@mariyaakter.me
            </p>
            <a href="mailto:hello@mariyaakter.me" className="mt-2 inline-block label">
              Send An Email
            </a>

            <div className="mt-10">
              <p className="label-muted">Social Archives</p>
              <ul className="mt-3 space-y-2 font-serif italic text-lg text-fg">
                <li><a className="hover:text-accent" href="https://instagram.com">Instagram</a></li>
                <li><a className="hover:text-accent" href="https://linkedin.com">LinkedIn</a></li>
                <li><a className="hover:text-accent" href="https://behance.net">Behance</a></li>
              </ul>
            </div>

            <div className="mt-10 relative">
              <div className="aspect-[3/4] overflow-hidden bg-ink-900">
                <img
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-4 right-4 w-24 h-24 overflow-hidden border-4 border-cream-200">
                <img
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="md:col-span-7">
          <h2 className="font-serif italic text-2xl md:text-3xl text-fg">
            Start a conversation
          </h2>
          <p className="mt-3 text-fg-muted">
            Tell me about your vision, your constraints, and what moves you. I'll
            get back to you within 48 hours.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setForm({ name: "", email: "", nature: "Brand Identity", narrative: "" });
              setTimeout(() => setSent(false), 4000);
            }}
            className="mt-10 space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="label-muted block">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                />
              </div>
              <div>
                <label className="label-muted block">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                />
              </div>
            </div>

            <div>
              <label className="label-muted block">Nature of Inquiry</label>
              <div className="mt-3 flex flex-wrap gap-3">
                {NATURES.map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setForm({ ...form, nature: n })}
                    className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest2 border transition-colors ${
                      form.nature === n
                        ? "bg-accent text-cream-100 border-accent"
                        : "border-line text-fg-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-muted block">The Narrative</label>
              <textarea
                rows={4}
                required
                value={form.narrative}
                onChange={(e) => setForm({ ...form, narrative: e.target.value })}
                placeholder="Briefly describe your project..."
                className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-fg-muted">
                {sent ? "Inquiry dispatched. Talk soon." : ""}
              </p>
              <button type="submit" className="font-serif italic text-xl flex items-center gap-3 hover:text-accent transition-colors">
                Dispatch Inquiry <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="container-narrow pb-24 md:pb-32">
        <p className="label-muted">Selected Archive Highlights</p>
        <ul className="mt-8 divide-y divide-[var(--line)]">
          {HIGHLIGHTS.map((h) => (
            <li key={h.title} className="flex items-center justify-between py-6 md:py-8">
              <span className="font-serif italic text-2xl md:text-3xl text-fg">{h.title}</span>
              <span className="label-muted text-right">{h.meta}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
