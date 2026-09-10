import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { QffFigure } from "@/components/ui/QffFigure";
import { event } from "@/data/event";
import { ExternalLink } from "lucide-react";

export function VenueSection() {
  return (
    <Section id="venue">
      <SectionHeading title="Venue" meta="Goa, India" />

      <RevealOnScroll className="mt-12 sm:mt-14">
        <div className="qff-card relative overflow-hidden">
          <QffFigure
            name="cloud-b"
            className="pointer-events-none absolute -right-10 bottom-0 w-72 opacity-[0.18] dark:opacity-[0.07] sm:w-96"
          />
          <div className="relative flex flex-col gap-8 p-7 sm:p-10 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="max-w-md font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
                {event.venueName}
              </h3>
              <address className="mt-3 max-w-sm not-italic leading-relaxed text-muted">
                {event.venueAddress}
              </address>
            </div>

            <a
              href={event.venueMapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/70 px-6 py-3 font-display text-sm font-bold text-ink-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-pink/60 hover:text-ink"
            >
              Open in Google Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </RevealOnScroll>
    </Section>
  );
}
