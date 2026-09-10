import { eventDetails, event } from "@/data/event";
import { detailIconMap } from "@/components/ui/icon-map";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Pending, isPending } from "@/components/ui/Pending";

/**
 * The event's facts, as a spec sheet.
 *
 * These were six identical icon cards in a three-column grid — the same shape
 * the next four sections also used, and on a phone six full-width blocks for
 * six short strings. A run of ruled rows says the same thing in a third of the
 * height and stops the page opening on the structure it then repeats.
 */
export function DetailsSection() {
  return (
    <Section id="details">
      <SectionHeading title="Details" description={event.description} />

      <dl className="mt-12 border-t border-line-soft sm:mt-14">
        {eventDetails.map((detail, i) => {
          const Icon = detailIconMap[detail.icon];
          return (
            <RevealOnScroll
              key={detail.label}
              variant="side"
              delayMs={i * 55}
              className="border-b border-line-soft"
            >
              <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 py-5 transition-colors duration-300 sm:grid-cols-[auto_13rem_1fr] sm:items-center sm:gap-x-6 sm:py-6">
                <Icon
                  aria-hidden
                  className="h-[18px] w-[18px] shrink-0 translate-y-[3px] text-pink-ink transition-transform duration-300 group-hover:scale-110 sm:translate-y-0"
                />
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-pink-ink">
                  {detail.label}
                </dt>
                <dd className="col-start-2 text-base font-medium leading-snug text-ink sm:col-start-3 sm:text-lg">
                  {isPending(detail.value) ? <Pending /> : detail.value}
                </dd>
              </div>
            </RevealOnScroll>
          );
        })}
      </dl>
    </Section>
  );
}
