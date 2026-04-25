import { useState } from "react";
import { archiveProjects } from "../data/projects";

const CATEGORIES = ["All Work", "Fashion", "Digital", "Editorial"];
const YEARS = ["2024", "2023", "2022", "Show All"];

export default function Archive() {
  const [cat, setCat] = useState("All Work");
  const [year, setYear] = useState("Show All");

  const filtered = archiveProjects.filter((p) => {
    const inCat =
      cat === "All Work" ||
      p.category.toLowerCase().includes(cat.toLowerCase());
    const inYear = year === "Show All" || p.year === year;
    return inCat && inYear;
  });

  return (
    <div className="pt-16 md:pt-20">
      <section className="container-narrow pt-12 md:pt-20 pb-24">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7 fade-up">
            <h1 className="font-serif italic text-ink-900 text-[clamp(3rem,9vw,7rem)] leading-[1]">
              Archive
            </h1>
            <p className="mt-6 max-w-md text-ink-700 leading-relaxed">
              A comprehensive collection of digital artifacts, marketing strategies,
              and visual explorations spanning seven years of interdisciplinary
              practice.
            </p>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="label-muted">Sorted By</p>
            <p className="font-serif italic text-xl mt-2 text-ink-800">
              Chronological Depth
            </p>
          </div>
        </div>

        <div className="mt-14 pb-6 border-b border-ink-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="label-muted">Category</span>
            <div className="flex items-center flex-wrap gap-2">
              {CATEGORIES.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`text-sm transition-colors ${
                    cat === c
                      ? "text-ink-900 font-semibold"
                      : "text-ink-500 hover:text-ink-800"
                  }`}
                >
                  {c}
                  {i < CATEGORIES.length - 1 && (
                    <span className="ml-2 text-ink-300">/</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="label-muted">Year</span>
            <div className="flex items-center gap-3">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`text-sm transition-colors ${
                    year === y ? "text-ink-900 font-semibold" : "text-ink-500 hover:text-ink-800"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {filtered.map((p, i) => (
            <div
              key={p.slug}
              className={`fade-up-delay-${(i % 4) + 1} ${
                i % 2 === 1 ? "md:mt-24" : ""
              }`}
            >
              <div className={`overflow-hidden bg-ink-900 ${p.aspect}`}>
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif italic text-xl md:text-2xl text-ink-900 mt-5">
                {p.title}
              </h3>
              <p className="label-muted mt-2">
                {p.category} &nbsp; {p.year}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center mt-24 text-ink-500 font-serif italic">
            No projects match these filters.
          </p>
        )}
      </section>
    </div>
  );
}
