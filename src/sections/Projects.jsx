import SectionHeading from "../components/ui/SectionHeading.jsx";
import ProjectCard from "../components/ui/ProjectCard.jsx";
import { projects } from "../data/projects.js";

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      {/* Ambient layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-aether-900/20 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="02 / Featured Projects"
          title="Built with intention."
          subtitle="A few ideas brought to life through design and development."
        />

        {/* Project cards stacked vertically */}
        <div className="mt-10 flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <p className="mt-12 font-serif text-xl font-light italic text-text-muted">
          Small experiments. Meaningful possibilities.
        </p>
      </div>
    </section>
  );
}
