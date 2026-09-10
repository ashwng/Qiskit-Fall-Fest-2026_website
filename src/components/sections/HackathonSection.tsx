import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hackathonCards, hackathonIntro } from "@/data/hackathon";
import { hackathonIconMap } from "@/components/ui/icon-map";
import { event } from "@/data/event";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { QffFigure } from "@/components/ui/QffFigure";
import { Pending, isPending } from "@/components/ui/Pending";

/**
 * The hackathon, given the weight it actually carries.
 *
 * It used to be the third of five identical card grids. It is now the only
 * full-bleed panel on the page: a fixed deep-indigo band whose cells share
 * hairline borders instead of each being its own floating rounded box, so the
 * six facts read as one blueprint rather than six repetitions.
 */
export function HackathonSection() {
  return (
    <section
      id="hackathon"
      className="qff-band relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-32"
    >
      <QffFigure
        name="bird-eagle"
        className="pointer-events-none absolute -right-12 -top-2 w-36 opacity-[0.16] sm:right-0 sm:top-6 sm:w-64 sm:opacity-25 lg:right-[4%] lg:top-10 lg:w-80"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-pink">
            24 hours
          </p>
          <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-[color:var(--band-ink)] sm:text-6xl lg:text-7xl">
            Hackathon
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[color:var(--band-ink-dim)]">
            {hackathonIntro}
          </p>
          <Link
            href={event.registerHref}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-pink-fill px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover"
          >
            Take part
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* One grid, hairline-ruled. The gap is the border. */}
        <div className="qff-band-grid mt-14 grid gap-px overflow-hidden rounded-2xl sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {hackathonCards.map((card, i) => {
            const Icon = hackathonIconMap[card.icon];
            return (
              <RevealOnScroll
                key={card.id}
                variant="soft"
                delayMs={i * 60}
                className="qff-band-cell p-7 sm:p-8"
              >
                <Icon aria-hidden className="h-5 w-5 text-pink" />
                <h3 className="mt-5 font-display text-lg font-bold text-[color:var(--band-ink)]">
                  {card.title}
                </h3>
                <div className="mt-2 text-sm leading-relaxed text-[color:var(--band-ink-dim)]">
                  {isPending(card.description) ? (
                    <Pending />
                  ) : (
                    card.description
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
