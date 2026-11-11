import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils.js";

const TECH_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
};

export default function ProjectCard({ project }) {
  const techEntries = project.tech
    ? Object.entries(project.tech).filter(([, value]) => value)
    : [];

  return (
    <article className="group surface-panel relative overflow-hidden rounded-2xl border border-ink-600/40 transition-all duration-500 ease-[var(--ease-soft)] hover:-translate-y-1 hover:border-aether-400/30 hover:shadow-elevated">
      {/* Ambient corner glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-aether-700/10 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex flex-col lg:flex-row">
        {/* Project image */}
        <div className="relative lg:w-[42%] lg:shrink-0">
          <div className="aspect-[4/3] w-full overflow-hidden lg:h-full">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-serif text-sm text-text-dim">
                {project.number}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-aether-300/70">
                {project.tag}
              </span>
            </div>

            <div className="mt-3 flex items-start justify-between gap-4">
              <h3 className="font-serif text-3xl font-light tracking-tight text-text-base sm:text-4xl">
                {project.title}
              </h3>
              <a
                href={project.links.view}
                aria-label={`View ${project.title}`}
                className="mt-1 shrink-0 text-ink-400 transition-colors hover:text-aether-200"
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-muted">
              {project.description}
            </p>

            {techEntries.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {techEntries.map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center rounded-full border border-aether-500/30 bg-aether-900/30 px-3 py-1.5 text-xs text-aether-100"
                  >
                    <span className="text-aether-300/60">
                      {TECH_LABELS[key]}:
                    </span>
                    <span className="ml-1.5 text-text-base">{value}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="hairline my-1" />

          <div className="flex items-center justify-between">
            <a
              href={project.links.view}
              className="inline-flex items-center gap-1.5 text-sm text-text-base transition-colors hover:text-aether-100"
            >
              View project <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-aether-100"
            >
              GitHub <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
