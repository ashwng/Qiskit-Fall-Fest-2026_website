import { ArrowRight } from "lucide-react";
import { event } from "@/data/event";
import ThreeBackground from "@/components/ui/QubitSphere";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-10 sm:pt-44 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-8">
        <div
          className="animate-[fadeUp_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0 [animation-fill-mode:forwards]"
          style={{ animationDelay: "120ms" }}
        >
          <p className="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.22em] text-pink-ink">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-pink shadow-[0_0_10px_rgba(255,126,182,0.9)]"
            />
            {event.organizer} · {event.shortName}
          </p>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            BITS GOA
            <br />
            IBM PLUS Qiskit Fall Fest
            <br />
            <span className="text-gradient">2026</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            {event.tagline}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={event.registerHref}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-pink-ink px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(208,38,112,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-deep"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={event.exploreHref}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-8 py-3.5 text-sm font-bold text-ink-dim backdrop-blur-sm transition-all duration-300 hover:border-pink/60 hover:bg-surface-2 hover:text-ink"
            >
              Explore Event
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-[fadeUp_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "300ms" }}>
          <div className="absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,126,182,0.22),transparent_70%)] blur-2xl" />
          <div className="glass-dark relative aspect-square overflow-hidden rounded-full p-4 shadow-[0_0_40px_rgba(255,126,182,0.14)] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(138,63,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(138,63,252,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <ThreeBackground />
          </div>
        </div>
      </div>
    </section>
  );
}
