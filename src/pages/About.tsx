import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "../components/Arrow";
import Seo from "../components/Seo";

export default function About() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    interest: "Art Direction",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", interest: "Art Direction", message: "" });
  };

  return (
    <div className="pt-16 md:pt-20">
      <Seo title="Studio" path="/about" description="Inside the operating system of an independent design studio. Story, values, tools, and the principles that anchor the work." />
      {/* About */}
      <section className="container-narrow pt-12 md:pt-20 pb-24 md:pb-32">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5 fade-up">
            <figure className="aspect-square overflow-hidden bg-ink-900 rounded-sm shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/images/mariya-akter-portrait-square-480.webp 480w, /images/mariya-akter-portrait-square-640.webp 640w, /images/mariya-akter-portrait-square-960.webp 960w, /images/mariya-akter-portrait-square-1280.webp 1280w"
                  sizes="(max-width: 768px) 90vw, 40vw"
                />
                <img
                  src="/images/mariya-akter-portrait-square-640.jpg"
                  srcSet="/images/mariya-akter-portrait-square-480.jpg 480w, /images/mariya-akter-portrait-square-640.jpg 640w, /images/mariya-akter-portrait-square-960.jpg 960w, /images/mariya-akter-portrait-square-1280.jpg 1280w"
                  sizes="(max-width: 768px) 90vw, 40vw"
                  alt="Mariya Akter — multidisciplinary designer based in Dhaka, Bangladesh."
                  loading="lazy"
                  decoding="async"
                  width="1254"
                  height="1254"
                  className="w-full h-full object-cover"
                  itemProp="image"
                />
              </picture>
            </figure>
          </div>

          <div className="md:col-span-7 fade-up-delay-1">
            <p className="label">From Dhaka to the World</p>
            <h1 className="mt-4 font-serif italic text-fg leading-[1.05] text-[clamp(2.4rem,5.5vw,4.5rem)]">
              Bridging cultural heritage <em className="not-italic">with</em> contemporary digital design.
            </h1>
            <div className="mt-8 grid sm:grid-cols-2 gap-6 text-fg-muted leading-relaxed text-[0.95rem]">
              <p>
                Born in the vibrant landscapes of Bangladesh, Mariya's creative
                journey is a synthesis of traditional craftsmanship and modern
                digital precision. What started as a fascination with textile patterns
                in Dhaka evolved into a multidisciplinary career spanning Fashion,
                Graphic Arts, and Global Marketing.
              </p>
              <p>
                Today, she works with international luxury brands and tech startups,
                translating complex narratives into elegant visual systems. Her approach
                is rooted in "Intentional Asymmetry" — finding the perfect balance between
                chaos and structure.
              </p>
            </div>
            <Link to="/work" className="mt-8 inline-flex items-center gap-2 link-underline">
              View Full Portfolio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="bg-app-elev py-24 md:py-32">
        <div className="container-narrow grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h2 className="font-serif italic text-3xl md:text-4xl text-fg">
              Start a conversation.
            </h2>
            <p className="mt-4 text-fg-muted leading-relaxed text-[0.95rem]">
              Available for select collaborations and creative consulting. Whether you
              have a project in mind or just want to say hi, I'm all ears.
            </p>
            <div className="mt-10 space-y-6">
              <div>
                <p className="label-muted">Location</p>
                <p className="mt-2 text-fg">London / Dubai / Dhaka</p>
              </div>
              <div>
                <p className="label-muted">Direct</p>
                <a href="mailto:hello@mariyaakter.me" className="mt-2 inline-block underline underline-offset-4 text-fg hover:text-accent">
                  hello@mariyaakter.me
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <form
              onSubmit={submit}
              className="bg-app rounded-sm p-8 md:p-12 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.25)]"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="about-form-name" className="label-muted block">Your Name</label>
                  <input
                    id="about-form-name"
                    name="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                  />
                </div>
                <div>
                  <label htmlFor="about-form-email" className="label-muted block">Email Address</label>
                  <input
                    id="about-form-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="about-form-interest" className="label-muted block">Interested In</label>
                <select
                  id="about-form-interest"
                  name="interest"
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 appearance-none text-fg"
                >
                  <option>Art Direction</option>
                  <option>Brand Identity</option>
                  <option>Digital Strategy</option>
                  <option>Fashion Direction</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mt-8">
                <label htmlFor="about-form-message" className="label-muted block">Message</label>
                <textarea
                  id="about-form-message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your vision..."
                  className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted resize-none"
                />
              </div>

              <div className="mt-10 flex items-center justify-between gap-4">
                <p className="text-sm text-fg-muted">
                  {sent ? "Inquiry received — replying within 48 hours." : ""}
                </p>
                <button type="submit" className="btn-primary">
                  Send Inquiry <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
