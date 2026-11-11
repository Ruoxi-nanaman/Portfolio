import { cn } from "../../lib/utils.js";

/**
 * Reusable section heading: eyebrow label + large serif title.
 */
export default function SectionHeading({ eyebrow, title, subtitle, className }) {
  return (
    <header className={cn("max-w-2xl", className)}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      {title && (
        <h2 className="font-serif text-4xl font-light leading-[1.1] tracking-tight text-text-base sm:text-5xl md:text-6xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-text-muted">
          {subtitle}
        </p>
      )}
    </header>
  );
}
