import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hackathonCards, hackathonIntro } from "@/data/hackathon";
import { hackathonIconMap } from "@/components/ui/icon-map";
import { event } from "@/data/event";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { QffFigure } from "@/components/ui/QffFigure";
import { Pending, isPending } from "@/components/ui/Pending";

/**
 * The hackathon.
 *
 * It keeps the structure that made it the page's loudest moment — one grid of
 * cells sharing hairline borders, rather than six floating rounded boxes — but
 * it no longer paints its own fixed indigo panel. That read as a different
 * site dropped into the middle of this one; the weight now comes from scale
 * and the pink, in the palette everything else already uses.
 */
export function HackathonSection() {
  const allPending = hackathonCards.every((c) => isPending(c.description));

  return (
    <Section id="hackathon" className="relative overflow-hidden bg-surface/30">
      <QffFigure
        name="bird-eagle"
        className="pointer-events-none absolute -right-12 -top-2 w-36 opacity-[0.16] sm:right-0 sm:top-6 sm:w-64 sm:opacity-25 lg:right-[4%] lg:top-10 lg:w-80"
      />

      <div className="relative">
        <SectionHeading title="Hackathon" meta="24 hours" />

        <p className="mt-7 max-w-xl font-display text-xl font-bold leading-snug text-ink dark:text-white sm:text-2xl">
          {hackathonIntro}
        </p>

        <Link
          href={event.registerHref}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-pink-fill px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover"
        >
          Take part
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        {/* One grid, hairline-ruled. The gap is the border. */}
        <div className="qff-band-grid mt-12 grid gap-px overflow-hidden rounded-2xl border border-line sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {hackathonCards.map((card, i) => {
            const Icon = hackathonIconMap[card.icon];
            return (
              <RevealOnScroll
                key={card.id}
                variant="soft"
                delayMs={i * 60}
                className="qff-band-cell p-7 sm:p-8"
              >
                <Icon aria-hidden className="h-5 w-5 text-pink-ink" />
                <h3 className="mt-5 font-display text-lg font-bold text-ink">
                  {card.title}
                </h3>
                {/* A placeholder is not content. When every entry is still
                    waiting the section says so once, underneath. */}
                {isPending(card.description) ? null : (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {card.description}
                  </p>
                )}
              </RevealOnScroll>
            );
          })}
        </div>

        {allPending ? (
          <p className="mt-5">
            <Pending label="Details for all six announcing soon" />
          </p>
        ) : null}
      </div>
    </Section>
  );
}
