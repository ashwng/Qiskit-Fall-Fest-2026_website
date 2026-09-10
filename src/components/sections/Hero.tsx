import Image from "next/image";
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

/** The qubits the hero bird lets fall, and how they are scattered beneath it. */
const QUBITS = [
  { v: "1", left: "6%", delay: "0s", size: "0.95rem" },
  { v: "0", left: "26%", delay: "0.18s", size: "1.15rem" },
  { v: "1", left: "48%", delay: "0.42s", size: "0.85rem" },
  { v: "0", left: "68%", delay: "0.62s", size: "1.05rem" },
  { v: "1", left: "86%", delay: "0.86s", size: "0.9rem" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-10 sm:pt-40 lg:px-16 lg:pb-28"
    >
      {/* The fest's own sky, behind the headline. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <QffFigure
          name="cloud-a"
          className="qff-drift absolute -left-16 top-24 w-[22rem] opacity-[0.22] dark:opacity-[0.07] sm:w-[30rem] lg:left-[6%] lg:top-32"
        />
        <QffFigure
          name="cloud-b"
          className="qff-drift-slow absolute -right-24 top-[58%] w-[26rem] opacity-[0.16] dark:opacity-[0.06] sm:w-[34rem] lg:right-[2%]"
        />
      </div>

      {/* The one bird you can reach. Hover it and the superposition collapses:
          it dips, and a few measured qubits fall out from under it. Focusable
          so it is not a mouse-only secret. */}
      <div
        className="qff-roost group absolute right-[6%] top-16 z-10 w-28 sm:w-36 lg:right-[36%] lg:top-24"
        tabIndex={0}
        role="img"
        aria-label="A Qiskit Fall Fest bird. Hover to measure a few qubits."
      >
        <QffFigure
          name="bird-glide"
          flip
          className="qff-roost-bird w-full drop-shadow-[0_6px_18px_rgba(208,38,112,0.35)]"
        />
        <div aria-hidden className="absolute inset-x-0 top-full h-20">
          {QUBITS.map((q, i) => (
            <span
              key={i}
              className="qff-qubit absolute top-0 tabular-nums"
              style={{
                left: q.left,
                fontSize: q.size,
                animationDelay: q.delay,
              }}
            >
              {q.v}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-10">
        <div
          className="animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0"
          style={{ animationDelay: "120ms" }}
        >
          {/* The fest's own lettering, from the official sticker pack, instead
              of the name typed out in the site's display face. */}
          <h1 className="flex flex-col items-start gap-3 sm:gap-4">
            <span className="sr-only">{`${event.organizer} — ${event.fullName}`}</span>

            <span
              aria-hidden
              className="font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl"
            >
              BITS GOA
            </span>

            <span aria-hidden className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Image
                src="/brand/qiskit.svg"
                alt=""
                width={204}
                height={81}
                priority
                className="h-11 w-auto sm:h-14 lg:h-16"
              />
              <Image
                src="/brand/fall-fest.svg"
                alt=""
                width={268}
                height={81}
                priority
                className="h-11 w-auto sm:h-14 lg:h-16"
              />
            </span>

            <Image
              aria-hidden
              src="/brand/2026.svg"
              alt=""
              width={159}
              height={81}
              priority
              className="h-11 w-auto sm:h-14 lg:h-16"
            />
          </h1>

          <p className="mt-7 max-w-lg font-display text-xl font-bold leading-snug text-ink dark:text-white sm:mt-8 sm:text-2xl">
            A campus-wide gathering for{" "}
            <span className="text-pink-ink">quantum computing</span>, in
            circuits and in community.
          </p>

          {/* The facts as a spec strip. Hairlines between them, so it reads as
              one line of record. */}
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
          className="relative mx-auto hidden w-full max-w-sm animate-[fadeUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 sm:max-w-md lg:block lg:max-w-none"
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
