import { eventDetails, event } from "@/data/event";
import { detailIconMap } from "@/components/ui/icon-map";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function DetailsSection() {
  return (
    <Section id="details">
      <SectionHeading
        eyebrow="00 · Details"
        title="Everything you need to know"
        description={event.description}
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {eventDetails.map((detail, i) => {
          const Icon = detailIconMap[detail.icon];
          return (
            <RevealOnScroll key={detail.label} delayMs={i * 60}>
              <div className="glass group h-full rounded-xl p-6 transition-colors hover:border-cyan/40">
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-cyan">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
                  {detail.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{detail.value}</p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </Section>
  );
}
