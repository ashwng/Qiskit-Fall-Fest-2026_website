import { hackathonCards, hackathonIntro } from "@/data/hackathon";
import { hackathonIconMap } from "@/components/ui/icon-map";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function HackathonSection() {
  return (
    <Section id="hackathon" className="relative bg-surface/30">
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_right,rgba(138,63,252,0.08),transparent_60%)] pointer-events-none" />

      <SectionHeading eyebrow="01 · Hackathon" title="Build something quantum" description={hackathonIntro} />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {hackathonCards.map((card, i) => {
          const Icon = hackathonIconMap[card.icon];
          return (
            <RevealOnScroll key={card.id} delayMs={i * 70}>
              <div className="glass-dark group relative h-full overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:border-violet-bright/50 hover:shadow-[0_0_30px_rgba(138,63,252,0.15)] hover:-translate-y-1">
                <div
                  aria-hidden
                  className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-violet-bright/20 blur-3xl transition-opacity duration-300 group-hover:bg-violet-bright/30"
                />
                <div className="relative grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface-2 text-pink-ink transition-colors duration-300 group-hover:bg-violet-bright/20 group-hover:border-violet-bright/50">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-6 font-display text-lg font-bold text-ink">{card.title}</h3>
                <p className="relative mt-2 font-body text-sm leading-relaxed text-muted">{card.description}</p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </Section>
  );
}
