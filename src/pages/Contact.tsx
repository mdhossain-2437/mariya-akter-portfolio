import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Seo from "../components/Seo";
import { ArrowRight } from "../components/Arrow";

const NATURES = [
  { id: "identity", label: "Brand Identity", desc: "Logotype, marks, type, photography direction." },
  { id: "fashion", label: "Fashion & Lookbook", desc: "Capsule, lookbook, on-set creative direction." },
  { id: "digital", label: "Digital Product", desc: "Flagship site, motion system, scroll storytelling." },
  { id: "marketing", label: "Marketing & Strategy", desc: "Naming, positioning, channel-ready creative." },
];

const SCOPES = [
  { id: "single", label: "A focused sprint", range: "$5k — $12k", duration: "2–4 weeks" },
  { id: "core", label: "Studio engagement", range: "$5.5k / month", duration: "Recurring" },
  { id: "flagship", label: "Flagship build", range: "$25k+", duration: "8–12 weeks" },
  { id: "explore", label: "Still exploring", range: "Open", duration: "Discovery call" },
];

const TIMELINES = ["This month", "Next quarter", "H2 2026", "No fixed date"];

type Step = 1 | 2 | 3 | 4;

export default function Contact() {
  const [step, setStep] = useState<Step>(1);
  const [nature, setNature] = useState(NATURES[0].id);
  const [scope, setScope] = useState(SCOPES[0].id);
  const [timeline, setTimeline] = useState(TIMELINES[1]);
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [narrative, setNarrative] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const summary = useMemo(() => {
    return {
      nature: NATURES.find((n) => n.id === nature)?.label ?? "—",
      scope: SCOPES.find((s) => s.id === scope)?.label ?? "—",
    };
  }, [nature, scope]);

  const total = 4;
  const progress = ((step - 1) / (total - 1)) * 100;

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const mailtoFallback = () => {
    const lines = [
      `Nature: ${summary.nature}`,
      `Scope: ${summary.scope}`,
      `Timeline: ${timeline}`,
      `Budget: ${budget || "Open"}`,
      `Company: ${company || "\u2014"}`,
      "",
      narrative || "(no narrative)",
      "",
      `\u2014 ${name} <${email}>`,
    ];
    const subject = `New inquiry \u2014 ${summary.nature}`;
    const body = lines.join("\n");
    const href = `mailto:hello@mariyaakter.me?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.location.href = href;
    } catch {
      // ignore
    }
  };

  const submit = async () => {
    if (!name.trim()) {
      setError("Please tell us your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          nature: summary.nature,
          scope: summary.scope,
          timeline,
          budget: budget.trim(),
          narrative: narrative.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong sending your inquiry.";
      setError(`${message} Opening your mail app as a fallback…`);
      mailtoFallback();
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      <Seo
        title="Contact"
        path="/contact"
        description="Tell us about your project in four short steps. We respond within 48 hours, Monday through Thursday."
      />
      <section className="container-wide pt-12 md:pt-20 pb-12">
        <div className="grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-8">
            <p className="label-muted">Contact</p>
            <h1 className="heading-display mt-6">
              Tell us about it.<br />
              <em className="text-accent">In four short steps.</em>
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="text-fg-muted">
              We respond within 48 hours, Monday through Thursday. Currently scheduling for Q3 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide pb-24 md:pb-32">
        <div className="grid md:grid-cols-12 gap-10">
          <aside className="md:col-span-4">
            <div className="surface p-6 sticky top-28">
              <p className="label-muted">Direct line</p>
              <a className="mt-3 block font-serif italic text-2xl hover:text-accent" href="mailto:hello@mariyaakter.me">
                hello@mariyaakter.me
              </a>
              <p className="mt-6 label-muted">Studio</p>
              <p className="mt-2 text-sm text-fg-muted">Dhaka, Bangladesh<br />Working remote across GMT+0 → GMT+8</p>
              <p className="mt-6 label-muted">Currently</p>
              <p className="mt-2 text-sm text-fg-muted">Booking 2 new flagship engagements for Q3.</p>
            </div>
          </aside>

          <div className="md:col-span-8">
            <div className="surface p-6 md:p-8">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-fg-muted">
                <span>Step {step} of {total}</span>
                <span>{summary.nature} · {summary.scope}</span>
              </div>
              <div className="mt-3 h-px w-full bg-[var(--line)] relative overflow-hidden">
                <motion.span
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                />
              </div>

              <div className="mt-8 min-h-[420px]">
                <AnimatePresence mode="wait">
                  {!sent && step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                      <p className="label-muted">01 · Nature</p>
                      <h2 className="font-serif text-3xl mt-3">What kind of work?</h2>
                      <ul className="mt-6 grid sm:grid-cols-2 gap-4">
                        {NATURES.map((n) => {
                          const active = nature === n.id;
                          return (
                            <li key={n.id}>
                              <button
                                type="button"
                                onClick={() => setNature(n.id)}
                                className={`w-full text-left p-5 rounded-md border transition-colors ${active ? "border-[var(--accent)] bg-[var(--bg-elev)]" : "border-[var(--line)] hover:border-[var(--accent)]"}`}
                              >
                                <p className="font-serif text-xl">{n.label}</p>
                                <p className="mt-2 text-sm text-fg-muted">{n.desc}</p>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}

                  {!sent && step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                      <p className="label-muted">02 · Scope</p>
                      <h2 className="font-serif text-3xl mt-3">How big is the room?</h2>
                      <ul className="mt-6 grid gap-3">
                        {SCOPES.map((s) => {
                          const active = scope === s.id;
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                onClick={() => setScope(s.id)}
                                className={`w-full text-left p-5 rounded-md border flex items-center justify-between gap-6 transition-colors ${active ? "border-[var(--accent)] bg-[var(--bg-elev)]" : "border-[var(--line)] hover:border-[var(--accent)]"}`}
                              >
                                <span>
                                  <span className="block font-serif text-xl">{s.label}</span>
                                  <span className="block text-sm text-fg-muted mt-1">{s.duration}</span>
                                </span>
                                <span className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">{s.range}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-8">
                        <label className="label-muted block">Approximate budget (optional)</label>
                        <input
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          placeholder="e.g. $15k or open"
                          className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                        />
                      </div>
                    </motion.div>
                  )}

                  {!sent && step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                      <p className="label-muted">03 · Timeline</p>
                      <h2 className="font-serif text-3xl mt-3">When does it want to land?</h2>
                      <ul className="mt-6 flex flex-wrap gap-3">
                        {TIMELINES.map((t) => (
                          <li key={t}>
                            <button
                              type="button"
                              onClick={() => setTimeline(t)}
                              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-colors ${
                                timeline === t
                                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                  : "border-[var(--line)] text-fg-muted hover:border-[var(--accent)] hover:text-[var(--accent)]"
                              }`}
                            >
                              {t}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <label className="label-muted block">The narrative</label>
                        <textarea
                          rows={5}
                          value={narrative}
                          onChange={(e) => setNarrative(e.target.value)}
                          placeholder="What's the project about? What's the goal? What's the constraint?"
                          className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-3 placeholder:italic placeholder:text-fg-muted resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {!sent && step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                      <p className="label-muted">04 · You</p>
                      <h2 className="font-serif text-3xl mt-3">Who is sending this?</h2>
                      <div className="mt-6 grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="label-muted block">Full name</label>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                          />
                        </div>
                        <div>
                          <label className="label-muted block">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@studio.com"
                            className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label-muted block">Company / studio (optional)</label>
                          <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Maison X"
                            className="mt-2 w-full bg-transparent border-b border-line focus:border-accent outline-none py-2 placeholder:italic placeholder:text-fg-muted"
                          />
                        </div>
                      </div>

                      <div className="mt-10 surface p-5">
                        <p className="label-muted">Summary</p>
                        <ul className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <li><span className="text-fg-muted">Nature</span><br />{summary.nature}</li>
                          <li><span className="text-fg-muted">Scope</span><br />{summary.scope}</li>
                          <li><span className="text-fg-muted">Budget</span><br />{budget || "Open"}</li>
                          <li><span className="text-fg-muted">Timeline</span><br />{timeline}</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {sent && (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-16"
                    >
                      <p className="label-muted">Inquiry dispatched</p>
                      <h2 className="heading-display mt-6">Talk to you soon.</h2>
                      <p className="mt-6 text-fg-muted max-w-md mx-auto">
                        We'll review {name ? name + "'s" : "your"} note and reply within 48 hours, Monday through Thursday.
                        For urgent things, email <a className="text-accent hover:underline" href="mailto:hello@mariyaakter.me">hello@mariyaakter.me</a> directly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!sent && (
                <>
                  {error && step === 4 && (
                    <p role="alert" className="mt-6 text-sm text-[var(--accent)]">
                      {error}
                    </p>
                  )}
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={step === 1}
                      onClick={back}
                      className="text-sm text-fg-muted disabled:opacity-30 hover:text-accent"
                    >
                      ← Back
                    </button>
                    {step < 4 ? (
                      <button type="button" onClick={next} className="btn-primary">
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button type="button" onClick={submit} disabled={sending} className="btn-primary disabled:opacity-60">
                        {sending ? "Sending…" : "Send inquiry"} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
