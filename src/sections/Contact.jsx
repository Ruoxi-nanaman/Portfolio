import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import { cn } from "../lib/utils.js";

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = { name: "", email: "", message: "", company: "" };

/** Shared field styling, with a distinct border when the field is invalid. */
function fieldClass(hasError) {
  return cn(
    "w-full rounded-sm border bg-ink-850/60 px-4 py-3 text-sm text-text-base placeholder:text-text-dim transition-colors focus:outline-none",
    hasError
      ? "border-rose-400/60 focus:border-rose-300/70"
      : "border-ink-600/60 focus:border-aether-400/60",
  );
}

function validate(form) {
  const errors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > NAME_MAX) {
    errors.name = `Name must be ${NAME_MAX} characters or fewer.`;
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const message = form.message.trim();
  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Message must be ${MESSAGE_MAX} characters or fewer.`;
  }

  return errors;
}

const STATUS_TEXT = {
  submitting: "Sending message...",
  success: "Your message has been sent successfully. I'll get back to you soon!",
  error:
    "Something went wrong while sending your message. Please try again later.",
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const submittingRef = useRef(false);

  const isSubmitting = status === "submitting";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Guard against duplicate submissions (clicks or a double Enter press).
    if (submittingRef.current) return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          company: form.company,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setStatus("success");
      setForm(EMPTY_FORM);
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  };

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
            </div>

            {/* Right: form */}
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
                  value={form.name}
                  onChange={handleChange}
                  placeholder="What should I call you?"
                  maxLength={NAME_MAX}
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={fieldClass(Boolean(errors.name))}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 text-xs text-rose-300">
                    {errors.name}
                  </p>
                )}
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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  maxLength={EMAIL_MAX}
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={fieldClass(Boolean(errors.email))}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-xs text-rose-300">
                    {errors.email}
                  </p>
                )}
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
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me a little about your idea..."
                  maxLength={MESSAGE_MAX}
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(fieldClass(Boolean(errors.message)), "resize-none")}
                />
                {errors.message && (
                  <p id="message-error" className="mt-2 text-xs text-rose-300">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot: hidden from visitors, tempting to bots. */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">Company (leave blank)</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending message..." : "Send message"}
                <ArrowUpRight className="h-4 w-4" />
              </Button>

              {/* Feedback: reserved space keeps the layout from shifting. */}
              <p
                role={status === "error" ? "alert" : "status"}
                aria-live="polite"
                className={cn(
                  "min-h-5 text-sm",
                  status === "error"
                    ? "text-rose-300"
                    : status === "success"
                      ? "text-aether-100"
                      : "text-text-muted",
                )}
              >
                {STATUS_TEXT[status] ?? ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
