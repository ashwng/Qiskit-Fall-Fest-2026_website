import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
                <dt className="text-base font-medium leading-snug text-ink sm:text-lg">
                  {detail.label}
                </dt>
                <dd className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-3 text-base font-medium leading-snug text-ink sm:col-start-3 sm:text-lg">
                  {isPending(detail.value) ? <Pending /> : detail.value}
                  {detail.cta ? (
                    <Link
                      href={detail.cta.href}
                      className="group inline-flex items-center gap-2 rounded-full bg-pink-fill px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover"
                    >
                      {detail.cta.label}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ) : null}
                </dd>
              </div>
            </RevealOnScroll>
          );
        })}
      </dl>
    </Section>
  );
}
