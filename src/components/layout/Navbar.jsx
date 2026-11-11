import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "../../lib/utils.js";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Ruoxi-nanaman" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/JeruPabutoy" },
];

export default function Navbar({ activeId }) {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/40 bg-ink-900/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 sm:px-8">
        <a
          href="#home"
          onClick={handleNavClick}
          className="font-serif text-2xl font-light tracking-wide text-text-base hover:text-aether-100 transition-colors"
        >
          Ruo xi
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={cn(
                    "group relative text-sm font-medium tracking-wide transition-colors duration-300",
                    activeId === link.id
                      ? "text-text-base"
                      : "text-text-dim hover:text-text-muted",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-2 left-0 h-px bg-aether-300 transition-all duration-300",
                      activeId === link.id ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop social links */}
        <div className="hidden items-center gap-6 sm:flex">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-aether-100 hover:text-aether-50 transition-colors"
            >
              {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-text-base hover:text-aether-100 transition-colors md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-ink-700/40 bg-ink-900/95 backdrop-blur-md md:hidden"
        >
          <ul className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={handleNavClick}
                  className={cn(
                    "block py-3 text-base font-medium tracking-wide transition-colors",
                    activeId === link.id
                      ? "text-aether-100"
                      : "text-text-muted hover:text-text-base",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex gap-6 border-t border-ink-700/40 pt-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-aether-100 hover:text-aether-50 transition-colors"
                >
                  {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ))}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
