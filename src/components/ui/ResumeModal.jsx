import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { resume } from "../../data/resume.js";

/**
 * Accessible résumé dialog: closes on Escape or backdrop click, locks page
 * scrolling, moves focus into the dialog on open and restores it on close.
 */
const TRANSITION_MS = 200;

function SectionTitle({ children }) {
  return (
    <h3 className="text-[0.7rem] uppercase tracking-[0.22em] text-aether-200">
      {children}
    </h3>
  );
}

export default function ResumeModal({ open, onClose }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const lastFocusedRef = useRef(null);

  // Mount / unmount with a short transition on open and close.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // Keyboard handling, scroll lock, and focus management while mounted.
  useEffect(() => {
    if (!mounted) return;

    lastFocusedRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }
      // Keep Tab focus cycling inside the dialog.
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] flex items-center justify-center p-4 transition-opacity duration-200 ease-[var(--ease-soft)] sm:p-6",
        visible ? "opacity-100" : "opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void-950/80 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          "surface-elevated relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm",
          "transition-all duration-200 ease-[var(--ease-soft)]",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        {/* Ambient corner glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aether-700/15 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-6 border-b border-ink-700/50 px-6 py-6 sm:px-8">
          <div>
            <p className="eyebrow">Résumé</p>
            <h2
              id="resume-modal-title"
              className="mt-2 font-serif text-2xl font-light tracking-tight text-text-base sm:text-3xl"
            >
              {resume.name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-text-dim">
              <span>{resume.contact.location}</span>
              <span className="text-ink-500">•</span>
              <a
                href={`tel:${resume.contact.phone}`}
                className="transition-colors hover:text-aether-100"
              >
                {resume.contact.phone}
              </a>
              <span className="text-ink-500">•</span>
              <a
                href={`mailto:${resume.contact.email}`}
                className="transition-colors hover:text-aether-100"
              >
                {resume.contact.email}
              </a>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close résumé"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink-600/50 text-text-muted transition-colors hover:border-aether-300/50 hover:text-aether-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="relative overflow-y-auto px-6 py-7 sm:px-8">
          {/* Summary */}
          <section>
            <SectionTitle>Summary</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {resume.summary}
            </p>
          </section>

          <div className="hairline my-7" />

          {/* Technical skills */}
          <section>
            <SectionTitle>Technical Skills</SectionTitle>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {resume.skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-medium text-text-base">
                    {group.label}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm leading-relaxed text-text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <div className="hairline my-7" />

          {/* Certifications */}
          <section>
            <SectionTitle>Certifications &amp; Training</SectionTitle>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {resume.certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-start gap-2.5 text-sm text-text-muted"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aether-400" />
                  {cert}
                </li>
              ))}
            </ul>
          </section>

          <div className="hairline my-7" />

          {/* Education */}
          <section>
            <SectionTitle>Education</SectionTitle>
            <div className="mt-3">
              <p className="font-serif text-lg font-light text-text-base">
                {resume.education.school}
              </p>
              <p className="text-sm text-text-muted">
                {resume.education.degree}
              </p>
              <p className="mt-1 text-xs text-text-dim">
                {resume.education.details}
              </p>
            </div>
          </section>

          <div className="hairline my-7" />

          {/* Projects */}
          <section>
            <SectionTitle>Academic &amp; Development Projects</SectionTitle>
            <div className="mt-4 space-y-5">
              {resume.projects.map((project) => (
                <div key={project.title}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-serif text-lg font-light text-text-base">
                      {project.title}
                    </p>
                    {project.period && (
                      <span className="text-xs text-text-dim">
                        {project.period}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
