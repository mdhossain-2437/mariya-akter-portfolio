import Reveal from "../components/Reveal";
import Seo from "../components/Seo";

const SECTIONS = [
  { id: "scope", title: "1. Scope of services", body: "All engagements are governed by a signed statement of work that defines deliverables, timeline, and fees. Anything outside that scope is a change order, agreed in writing before work begins." },
  { id: "payment", title: "2. Payment terms", body: "Fixed-fee engagements are billed 50% on kickoff and 50% on final delivery, unless otherwise stated. Monthly retainers are billed in advance on the first business day of each month. Net 14 from invoice date. Late payments accrue 1.5% interest per month." },
  { id: "ip", title: "3. Intellectual property", body: "Upon final payment, the client owns full IP rights to the final, approved deliverables (logo, identity, copy, code). Source files, exploratory work, and components built into the studio's reusable library remain the property of Mariya Akter Studio." },
  { id: "portfolio", title: "4. Portfolio & publication", body: "The studio retains the right to publish the work in its portfolio, social channels, and submit to award programs after a reveal date agreed at kickoff. NDAs may extend or restrict this — see your SOW." },
  { id: "confidentiality", title: "5. Confidentiality", body: "Both parties agree to keep proprietary information confidential, both during the engagement and after. Mutual NDAs are signed before sharing sensitive materials." },
  { id: "termination", title: "6. Termination", body: "Either party may terminate an engagement with 14 days' written notice. The client is responsible for fees corresponding to work performed up to the termination date, plus 30% of remaining scope as a kill fee." },
  { id: "warranties", title: "7. Warranties & liability", body: "The studio warrants original work and that delivered assets do not knowingly infringe third-party IP. Liability is capped at fees paid for the engagement in question. The studio is not liable for indirect, consequential, or special damages." },
  { id: "law", title: "8. Governing law", body: "These terms are governed by the laws of Bangladesh. Disputes are resolved in good faith first, and via arbitration in Dhaka if not." },
];

export default function Terms() {
  return (
    <div className="pt-24 md:pt-32 pb-20">
      <Seo
        title="Terms"
        path="/terms"
        description="Engagement terms — scope, payments, IP, confidentiality, and the rest of the clauses that make a studio engagement feel clean."
      />
      <div className="container-narrow grid lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3 lg:sticky lg:top-28 self-start">
          <p className="label">Terms · 2024</p>
          <h1 className="heading-display text-4xl mt-3">Terms of Service</h1>
          <p className="mt-4 text-fg-muted text-sm leading-relaxed">
            The plain-language terms behind every engagement. Long-form contracts are signed per project.
          </p>
          <nav className="mt-8 space-y-2 text-sm">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block text-fg-muted hover:text-accent transition">{s.title}</a>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-9 space-y-12">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.03}>
              <section id={s.id}>
                <h2 className="font-serif text-3xl mb-4">{s.title}</h2>
                <p className="text-fg-muted leading-relaxed">{s.body}</p>
              </section>
            </Reveal>
          ))}
          <div className="pt-8 border-t border-line text-sm text-fg-muted">
            Last updated: April 2026. Direct questions to <a href="mailto:hello@mariyaakter.me" className="text-accent">hello@mariyaakter.me</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
