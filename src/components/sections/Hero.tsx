import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { event } from "@/data/event";
import { HeroSphere } from "@/components/ui/HeroSphere";
import { QffFigure } from "@/components/ui/QffFigure";

/** The three things anyone landing here wants to know first. */
const facts = [
  { label: "When", value: event.dates },
  { label: "Where", value: event.venueShort },
  { label: "What", value: event.format },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10 sm:pt-40 lg:px-16 lg:pb-28"
    >
      {/* The fest's own sky. Clouds sit behind the headline at the density the
          brand sheet uses them, and one bird crosses above it — the only piece
          of the flock that appears on a phone, where the margin birds cannot. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <QffFigure
          name="cloud-a"
          className="qff-drift absolute -left-16 top-24 w-[22rem] opacity-[0.22] dark:opacity-[0.07] sm:w-[30rem] lg:left-[6%] lg:top-32"
        />
        <QffFigure
          name="cloud-b"
          className="qff-drift-slow absolute -right-24 top-[58%] w-[26rem] opacity-[0.16] dark:opacity-[0.06] sm:w-[34rem] lg:right-[2%]"
        />
        <QffFigure
          name="bird-glide"
          flip
          className="qff-glide absolute right-[8%] top-16 w-24 opacity-60 sm:w-32 lg:right-[38%] lg:top-24"
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-10">
        <div
          className="animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0"
          style={{ animationDelay: "120ms" }}
        >
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[0.92] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem]">
            BITS GOA
            <br />
            IBM PLUS Qiskit Fall Fest
            <br />
            {/* The year carries the emphasis by size, the way the fest's own
                lettering does — not by a gradient across the glyphs. */}
            <span className="text-[1.12em] leading-none text-pink-ink">2026</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-dim sm:mt-7 sm:text-xl">
            {event.tagline}
          </p>

          {/* The facts as a spec strip rather than six cards further down the
              page. Hairlines between them, so it reads as one line of record. */}
          <dl className="mt-9 flex flex-col gap-px overflow-hidden rounded-xl border border-line bg-line/60 sm:mt-10 sm:flex-row">
            {facts.map((fact) => (
              <div key={fact.label} className="flex-1 bg-surface/80 px-5 py-4">
                <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-pink-ink">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold leading-snug text-ink">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-4 sm:mt-10">
            <Link
              href={event.registerHref}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-pink-fill px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(208,38,112,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover hover:shadow-[0_16px_32px_-14px_rgba(208,38,112,0.95)]"
            >
              Register Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={event.exploreHref}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-8 py-3.5 text-sm font-bold text-ink-dim transition-all duration-300 hover:border-pink/60 hover:bg-surface-2 hover:text-ink"
            >
              Explore Event
            </a>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-sm animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 sm:max-w-md lg:max-w-none"
          style={{ animationDelay: "300ms" }}
        >
          <div className="pointer-events-none absolute inset-0 -m-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,126,182,0.22),transparent_70%)] blur-2xl" />
          <div className="glass-dark relative aspect-square overflow-hidden rounded-full">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(138,63,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(138,63,252,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <HeroSphere />
          </div>
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            One qubit · move your cursor
          </p>
        </div>
      </div>
    </section>
  );
}
