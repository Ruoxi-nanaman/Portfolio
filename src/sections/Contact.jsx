import { ArrowUpRight } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* Elevated surface with ambient lighting */}
        <div className="surface-elevated relative overflow-hidden rounded-sm">
          {/* Ambient blue glow */}
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-aether-700/20 blur-[90px]" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-aether-800/20 blur-[90px]" />

          <div className="relative grid grid-cols-1 gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            {/* Left: copy + contact */}
            <div>
              <p className="eyebrow mb-6">03 / Get In Touch</p>
              <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-text-base sm:text-5xl md:text-6xl">
                Good things begin with a conversation.
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-text-muted">
                Have an idea, a question, or just a hello? I&apos;d love to hear
                what you&apos;re thinking.
              </p>

              <div className="mt-12">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-aether-300/80">
                  Say Hello
                </p>
                <a
                  href="mailto:hello@example.com"
                  className="mt-4 inline-flex items-center gap-2 font-serif text-2xl font-light text-text-base hover:text-aether-100 transition-colors sm:text-3xl"
                >
                  hello@example.com <ArrowUpRight className="h-5 w-5" />
                </a>

                <div className="mt-6 flex gap-6">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-aether-100 transition-colors"
                  >
                    GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-aether-100 transition-colors"
                  >
                    LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <p className="mt-8 text-xs text-text-dim">
                  Contact details and profiles are placeholders.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-text-base"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="What should I call you?"
                  className="w-full rounded-sm border border-ink-600/60 bg-ink-850/60 px-4 py-3 text-sm text-text-base placeholder:text-text-dim transition-colors focus:border-aether-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text-base"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-sm border border-ink-600/60 bg-ink-850/60 px-4 py-3 text-sm text-text-base placeholder:text-text-dim transition-colors focus:border-aether-400/60 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-text-base"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell me a little about your idea..."
                  className="w-full resize-none rounded-sm border border-ink-600/60 bg-ink-850/60 px-4 py-3 text-sm text-text-base placeholder:text-text-dim transition-colors focus:border-aether-400/60 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Send message <ArrowUpRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
