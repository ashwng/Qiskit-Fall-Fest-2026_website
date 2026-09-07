import { ArrowRight, Sparkles } from "lucide-react";
import { event } from "@/data/event";
import ThreeBackground from "@/components/ui/QubitSphere";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-24 pt-36 sm:px-10 sm:pt-44 lg:px-16"
    >
      <div className="circuit-field pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-8">
        <div
          className="animate-[fadeUp_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0 [animation-fill-mode:forwards]"
          style={{ animationDelay: "120ms" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-surface/50 backdrop-blur-md px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan shadow-[0_0_15px_rgba(8,189,186,0.15)]">
            <Sparkles className="h-3.5 w-3.5 animate-pulse-glow" />
            {event.organizer} &middot; PLUS Qiskit Fall Fest
          </div>

          <h1 className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            BITS GOA
            <br />
            PLUS Qiskit Fall Fest
            <br />
            <span className="text-gradient">2026</span>
          </h1>

          <p className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-muted">
            {event.shortName}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-5">
            <a
              href={event.registerHref}
              className="glow-button group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-surface border border-line px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={event.exploreHref}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/30 backdrop-blur-sm px-8 py-3.5 text-sm font-bold text-ink-dim transition-all duration-300 hover:border-violet/50 hover:bg-surface-2 hover:text-white"
            >
              Explore Event
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-[fadeUp_1s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: "300ms" }}>
          <div className="absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(138,63,252,0.15),transparent_70%)] blur-2xl" />
          <div className="glass-dark relative rounded-full p-4 md:p-8 aspect-square overflow-hidden shadow-[0_0_40px_rgba(138,63,252,0.1)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(138,63,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(138,63,252,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <ThreeBackground />
          </div>
        </div>
      </div>
    </section>
  );
}
