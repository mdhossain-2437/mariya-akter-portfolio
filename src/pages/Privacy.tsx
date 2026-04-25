const SECTIONS = [
  {
    id: "introduction",
    n: "01",
    title: "Introduction",
    body: [
      `This Privacy Policy describes how Mariya Akter ("we," "us," or "our") collects, uses, and shares your personal information when you visit or make a purchase from our digital gallery. We respect your privacy and are committed to protecting your personal data.`,
      `As a studio focused on Fashion, Graphics, and Digital Marketing, we believe in radical transparency. We treat your data with the same intentionality we bring to our creative projects.`,
    ],
  },
  {
    id: "data",
    n: "02",
    title: "Data Collection",
    body: [
      `When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, and time zone. Additionally, we collect information about the individual web pages or products that you view.`,
    ],
    columns: [
      {
        title: "Direct Information",
        body: "Information you provide via contact forms, project inquiries, or newsletter sign-ups. This includes names, email addresses, and professional profiles.",
      },
      {
        title: "Analytics",
        body: "We use behavioral data to refine the exhibition experience. This data is anonymized and used solely for design improvement.",
      },
    ],
  },
  {
    id: "cookies",
    n: "03",
    title: "Cookie Policy",
    body: [
      `We use "Cookies" to preserve the aesthetic state of your browsing experience. Cookies are small data files that are placed on your device or computer and often include an anonymous unique identifier.`,
      `You can choose to disable cookies through your individual browser options. However, please note that this may affect your experience of the intentional visual transitions within this gallery.`,
    ],
  },
  {
    id: "usage",
    n: "04",
    title: "Terms of Usage",
    body: [
      `The content, imagery, and design philosophy presented on this site are the intellectual property of Mariya Akter. Reproduction, distribution, or unauthorized use of any visual asset without explicit written consent is strictly prohibited.`,
    ],
    quote: `"Design is not just what it looks like; it's how it respects the user."`,
    extra:
      "By accessing this site, you agree to engage with the content in a respectful manner. Any attempt to disrupt the digital infrastructure or scrape content for commercial AI training without licensing is a breach of these terms.",
  },
  {
    id: "contact",
    n: "05",
    title: "Contact Details",
    body: [
      `For questions about this Privacy Policy, or to exercise any of your rights, please reach out via the contact channels listed in this site's footer or write to hello@mariyaakter.me directly.`,
    ],
  },
];

export default function Privacy() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-12">
        <p className="label">Commitment to Integrity</p>
        <h1 className="mt-4 font-serif text-ink-900 text-[clamp(3rem,9vw,7rem)] leading-[1]">
          Privacy
          <br />& Terms.
        </h1>
        <p className="mt-6 italic text-ink-500 text-sm">Last updated: May 24, 2024</p>
      </section>

      <section className="container-narrow pb-24 grid md:grid-cols-12 gap-10">
        <aside className="md:col-span-3 md:sticky md:top-28 self-start">
          <p className="label-muted">Table of Contents</p>
          <ul className="mt-6 space-y-3">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`text-sm transition-colors ${
                    i === 0
                      ? "text-accent font-semibold"
                      : "text-ink-700 hover:text-accent"
                  }`}
                >
                  {s.n}. {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="md:col-span-9 space-y-12">
          {SECTIONS.map((s) => (
            <section id={s.id} key={s.id} className="scroll-mt-28">
              <h2 className="flex items-baseline gap-4">
                <span className="font-serif italic text-ink-300 text-lg">{s.n}</span>
                <span className="font-serif text-2xl md:text-3xl text-ink-900">{s.title}</span>
              </h2>
              <div className="mt-5 space-y-4 text-ink-700 leading-relaxed">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {s.columns && (
                <div className="mt-6 bg-cream-200 rounded-sm p-6 md:p-8 grid md:grid-cols-2 gap-8">
                  {s.columns.map((c) => (
                    <div key={c.title}>
                      <p className="label-muted">{c.title}</p>
                      <p className="mt-2 text-sm text-ink-700 leading-relaxed">{c.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {s.quote && (
                <blockquote className="mt-6 border-l-2 border-accent pl-6 italic text-ink-800">
                  {s.quote}
                </blockquote>
              )}
              {s.extra && <p className="mt-4 text-ink-700 leading-relaxed">{s.extra}</p>}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
