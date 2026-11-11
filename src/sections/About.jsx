import SectionHeading from "../components/ui/SectionHeading.jsx";
import { skills } from "../data/skills.js";

const INFO_COLUMNS = [
  {
    label: "Education",
    items: ["Bachelor of Science in Information Technology", "Bukidnon State University"],
  },
  {
    label: "Exploring",
    items: ["Full-stack web development", "Computer networking and infrastructure"],
  },
  {
    label: "Learning Next",
    items: ["Advanced full-stack development", "Ethical Hacking"],
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      {/* Ambient layer */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-aether-900/20 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        <SectionHeading
          eyebrow="01 / About Me"
          title="Curiosity, made tangible."
        />

        {/* Editorial two-column */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h3 className="font-serif text-3xl font-light leading-[1.2] text-text-base sm:text-4xl">
              A thoughtful mind.
              <br />
              A hands-on approach.
            </h3>
          </div>
          <div className="space-y-8 text-[0.95rem] leading-relaxed text-text-muted">
            <p>
              I'm Jeru, a developer interested in building meaningful digital experiences. 
              I enjoy turning ideas into functional, intuitive applications through thoughtful 
              design and clean code.
            </p>
            <p>
              I'm also interested in computer networking and how devices and systems communicate. 
              I enjoy exploring network infrastructure, understanding how connections work, and learning 
              how different technologies come together.
            </p>
          </div>
        </div>

        {/* Elevated info surfaces */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink-700/40 bg-ink-700/40 sm:grid-cols-3">
          {INFO_COLUMNS.map((col) => (
            <div
              key={col.label}
              className="surface-panel relative px-6 py-8 sm:px-8"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-aether-300/80">
                {col.label}
              </p>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="font-serif text-lg font-light text-text-base"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Technologies */}
        <div className="mt-24">
          <p className="eyebrow mb-5">The Toolkit</p>
          <h2 className="font-serif text-4xl font-light leading-[1.1] tracking-tight text-text-base sm:text-5xl">
            Technologies I&apos;m exploring
          </h2>
          <p className="mt-4 max-w-xl text-sm text-text-muted">
            Currently expanding my skills through hands-on learning and personal projects.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-700/40 bg-ink-700/40 md:grid-cols-3 lg:grid-cols-5">
            {skills.map((group) => (
              <div
                key={group.category}
                className="surface-panel relative px-5 py-7 sm:px-6"
              >
                <p className="text-sm font-medium text-text-base">
                  {group.category}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-2.5 gap-y-1.5">
                  {group.items.map((item, i) => (
                    <span
                      key={item}
                      className="text-sm text-text-muted"
                    >
                      {item}
                      {i < group.items.length - 1 && (
                        <span className="ml-2.5 text-ink-500">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
