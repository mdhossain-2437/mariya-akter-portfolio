import { useParams, Link, Navigate } from "react-router-dom";
import { projects } from "../data/projects";

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return <Navigate to="/work" replace />;

  // For projects without full case study, show a slimmed view
  const hasFullCase = !!project.challenge;

  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-16 pb-16">
        <p className="label">Case Study — {project.year}</p>
        <div className="mt-4 grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <h1 className="font-serif text-ink-900 leading-[1] text-[clamp(3rem,10vw,8rem)]">
              {project.title.split(" ")[0]}
              <span className="italic"> {project.title.split(" ").slice(1).join(" ")}</span>
            </h1>
          </div>
          <div className="md:col-span-4">
            <p className="text-ink-700 leading-relaxed">{project.blurb}</p>
          </div>
        </div>

        {hasFullCase && (
          <div className="mt-16 md:mt-20 pt-8 border-t border-ink-200 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="label-muted">Duration</p>
              <p className="mt-2 text-ink-800">{project.duration}</p>
            </div>
            <div>
              <p className="label-muted">Role</p>
              <p className="mt-2 text-ink-800">{project.role}</p>
            </div>
            <div>
              <p className="label-muted">Tools</p>
              <p className="mt-2 text-ink-800">{project.tools}</p>
            </div>
            <div>
              <p className="label-muted">Industry</p>
              <p className="mt-2 text-ink-800">{project.industry}</p>
            </div>
          </div>
        )}
      </section>

      {/* Cover */}
      <section className="bg-ink-900 py-12 md:py-16">
        <div className="container-narrow">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={project.cover}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {hasFullCase && (
        <>
          {/* Challenge */}
          <section className="container-narrow py-24 md:py-32">
            <div className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <h2 className="font-serif italic text-3xl md:text-4xl text-accent">
                  The Challenge
                </h2>
              </div>
              <div className="md:col-span-8 space-y-6 text-ink-700 leading-relaxed">
                <p className="text-xl md:text-2xl text-ink-900 font-serif italic">
                  {project.challenge}
                </p>
                <p>{project.challengeBody}</p>
              </div>
            </div>
          </section>

          {/* Gallery */}
          {project.gallery && (
            <section className="bg-cream-200 py-24 md:py-32">
              <div className="container-narrow">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                  {project.gallery.map((g, i) => (
                    <div key={i} className={i % 3 === 1 ? "md:mt-20" : ""}>
                      <div className="aspect-square overflow-hidden bg-ink-900">
                        <img src={g.src} alt="" className="w-full h-full object-cover" />
                      </div>
                      {g.caption && (
                        <div className="mt-5">
                          <h3 className="font-serif italic text-xl text-ink-900">
                            {g.caption}
                          </h3>
                          {g.subcaption && (
                            <p className="mt-2 text-ink-700 text-sm leading-relaxed max-w-md">
                              {g.subcaption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Stats */}
          {project.stats && (
            <section className="container-narrow py-24 md:py-32">
              <div className="text-center">
                <p className="label">Impact & Growth</p>
                <h2 className="font-serif italic text-3xl md:text-5xl mt-4 text-ink-900">
                  Defining the New Luxury
                </h2>
              </div>
              <div className="mt-16 grid md:grid-cols-3 gap-6">
                {project.stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-cream-200 p-10 text-center rounded-sm"
                  >
                    <p className="font-serif text-5xl md:text-6xl text-accent">
                      {s.value}
                      {s.suffix && (
                        <span className="text-2xl md:text-3xl italic">{s.suffix}</span>
                      )}
                    </p>
                    <p className="label-muted mt-4">{s.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Next */}
      {project.next && (
        <section className="relative py-32 md:py-44 bg-ink-900 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative container-narrow text-center text-cream-100">
            <p className="uppercase tracking-widest2 text-xs">Next Narrative</p>
            <h2 className="mt-4 font-serif text-4xl md:text-7xl">{project.next.title}</h2>
            <Link
              to={`/work/${project.next.slug}`}
              className="mt-10 inline-flex items-center gap-3 uppercase tracking-widest2 text-xs font-semibold border-t border-b border-cream-100/40 py-3 px-8 hover:bg-cream-100 hover:text-ink-900 transition-colors"
            >
              View Case Study
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
