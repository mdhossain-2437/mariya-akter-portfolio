import { Link } from "react-router-dom";
import { ArrowRight } from "../components/Arrow";

export default function NotFound() {
  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow min-h-[80vh] py-20 grid md:grid-cols-12 items-center gap-10">
        <div className="md:col-span-6 fade-up">
          <p className="label-muted">Error Code 404</p>
          <h1 className="mt-4 font-serif text-fg leading-[1] text-[clamp(3rem,9vw,7rem)]">
            The Muse has
            <br />
            <em className="text-accent">wandered off.</em>
          </h1>
          <p className="mt-6 max-w-md text-fg-muted leading-relaxed">
            The page you are looking for has likely found a more interesting
            conversation in a different room. Let's guide you back to the curated works.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
            <Link to="/" className="btn-primary">
              Return to Gallery <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/work" className="link-underline">
              View Portfolio
            </Link>
          </div>
        </div>
        <div className="md:col-span-6">
          <div className="relative aspect-[4/5] max-w-md mx-auto bg-ink-900 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1561998338-13ad7883b20f?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-6 right-6 left-12 bg-app p-4 max-w-[14rem]">
              <p className="label-muted">Journal Note</p>
              <p className="font-serif italic text-sm text-fg mt-1">
                "Art is never finished, only abandoned." — Leonardo da Vinci
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
