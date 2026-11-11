import { cn } from "../../lib/utils.js";

/**
 * Reusable button element with two restrained variants.
 */
const VARIANTS = {
  primary:
    "bg-aether-200/90 text-ink-900 hover:bg-aether-100 border border-aether-300/40",
  ghost:
    "bg-transparent text-text-base border border-ink-500/60 hover:border-aether-300/50 hover:text-aether-100",
};

export default function Button({
  children,
  variant = "ghost",
  className,
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-medium tracking-wide",
        "transition-all duration-300 ease-[var(--ease-soft)]",
        "focus-visible:outline-none",
        VARIANTS[variant] ?? VARIANTS.ghost,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
