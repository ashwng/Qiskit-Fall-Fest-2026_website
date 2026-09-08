import { eventDetails, event } from "@/data/event";
import { detailIconMap } from "@/components/ui/icon-map";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function DetailsSection() {
  return (
    <Section id="details" className="relative">
      <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_left,rgba(255,126,182,0.08),transparent_70%)] pointer-events-none" />
      
      <SectionHeading
        eyebrow="00 · Details"
        title="Everything you need to know"
        description={event.description}
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {eventDetails.map((detail, i) => {
          const Icon = detailIconMap[detail.icon];
          return (
            <RevealOnScroll key={detail.label} delayMs={i * 60}>
              <div className="glass-dark group h-full rounded-2xl p-7 transition-all duration-300 hover:border-pink/50 hover:shadow-[0_0_30px_rgba(255,126,182,0.1)] hover:-translate-y-1">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface-2 text-pink-ink transition-colors duration-300 group-hover:bg-pink/10 group-hover:border-pink/30 group-hover:text-pink-ink shadow-[0_0_15px_rgba(255,126,182,0.0)] group-hover:shadow-[0_0_20px_rgba(255,126,182,0.2)]">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-pink-ink font-bold">
                  {detail.label}
                </p>
                <p className="mt-2 font-display text-sm leading-relaxed text-ink font-medium">{detail.value}</p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </Section>
  );
}
