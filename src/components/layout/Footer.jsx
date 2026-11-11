import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-700/40 bg-ink-900/60">
      <div className="mx-auto max-w-[1200px] px-6 py-12 sm:px-8">
        <p className="mb-10 max-w-md text-sm text-text-muted">
          Made for thoughtful collaborations, wherever they begin.
        </p>

        <div className="hairline mb-8" />

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <a
            href="#home"
            className="font-serif text-2xl font-light tracking-wide text-text-base hover:text-aether-100 transition-colors"
          >
            Ruo xi
          </a>

          <p className="text-sm text-text-dim">
            © 2026 Jeru Emmanuel Pabutoy
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-text-muted hover:text-aether-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-text-muted hover:text-aether-100 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-aether-100 transition-colors"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
