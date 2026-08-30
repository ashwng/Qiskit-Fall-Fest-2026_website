import { ArrowRight, Sparkles } from "lucide-react";
import { event } from "@/data/event";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-10 sm:pt-44 lg:px-16"
    >
      <div className="circuit-field pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl">
        <div
          className="animate-[fadeUp_0.8s_ease-out_forwards] opacity-0 [animation-fill-mode:forwards]"
          style={{ animationDelay: "80ms" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-cyan">
            <Sparkles className="h-3.5 w-3.5" />
            {event.organizer} &middot; Qiskit Fall Fest
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            BITS
            <br />
            Qiskit Fall Fest
            <br />
            <span className="text-gradient">2026</span>
          </h1>

          <p className="mt-3 font-mono text-sm uppercase tracking-[0.3em] text-muted">
            {event.shortName}
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-dim sm:text-lg">
            {event.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={event.registerHref}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-violet-bright px-6 py-3 text-sm font-semibold text-ink shadow-[0_0_0_1px_rgba(138,63,252,0.4),0_18px_40px_-18px_rgba(138,63,252,0.65)] transition-transform hover:-translate-y-0.5"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={event.exploreHref}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink-dim transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              Explore Event
            </a>
          </div>

          <p className="mt-8 max-w-md text-xs leading-relaxed text-muted">
            All dates, venues, and speaker details on this page are placeholders
            and will be replaced as they&apos;re confirmed.
          </p>
        </div>
      </div>
    </section>
  );
}
