import { useState } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Moon3D from "../components/ui/Moon3D.jsx";
import ResumeModal from "../components/ui/ResumeModal.jsx";
import { credentialsUrl } from "../data/resume.js";

export default function Home() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Localized ambient glow behind the Moon — blends into the shared background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[2%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-aether-800/25 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 px-6 pb-6 pt-10 sm:px-8 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-8 lg:pt-16">
        {/* Left: text */}
        <div className="lg:col-span-7">
          <p className="eyebrow mb-4">Portfolio / Developer & Network Enthusiast</p>

          <p className="font-serif text-2xl font-light text-text-muted sm:text-3xl">
            Hello, I&apos;m
          </p>

          <h1 className="mt-1 font-serif text-[2.75rem] font-light leading-[1.05] tracking-tight text-text-base sm:text-6xl lg:text-[5.25rem]">
            Jeru Emmanuel
            <br />
            Pabutoy
          </h1>

          <p className="mt-6 font-serif text-xl font-light italic text-aether-100/90 sm:text-2xl">
            Building meaningful digital experiences
            <br />
            through code and creativity.
          </p>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-text-muted">
            I turn thoughtful ideas into intuitive software. Exploring the space
            where clean code meets considered design.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              as="a"
              href={credentialsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Credentials <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" type="button" onClick={() => setResumeOpen(true)}>
              Résumé
            </Button>
          </div>
        </div>

        {/* Right: interactive 3D Moon */}
        <div className="relative flex items-center justify-center lg:col-span-5">
          <div className="relative flex h-[340px] w-full max-w-[420px] items-center justify-center sm:h-[420px] lg:h-[460px]">
            {/* Celestial halo behind the Moon */}
            <div className="pointer-events-none absolute inset-0 mx-auto h-[340px] w-[340px] rounded-full bg-aether-700/20 blur-[70px]" />

            <Moon3D
              interactive
              autoRotateSpeed={0.7}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom information row */}
      <div className="relative mx-auto mt-10 flex max-w-[1200px] items-end justify-between px-6 pb-12 sm:mt-14 sm:px-8 sm:pb-16 lg:pb-20">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-text-dim hover:text-aether-100 transition-colors"
        >
          Scroll to explore <ArrowDown className="h-3.5 w-3.5" />
        </a>
        <span className="text-xs uppercase tracking-[0.22em] text-text-dim">
          01 / The Beginning
        </span>
      </div>

      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}
