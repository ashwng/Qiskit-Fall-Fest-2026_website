import { hackathonCards, hackathonIntro } from "@/data/hackathon";
import { hackathonIconMap } from "@/components/ui/icon-map";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function HackathonSection() {
  return (
    <Section id="hackathon" className="bg-surface/30">
      <SectionHeading eyebrow="01 · Hackathon" title="Build something quantum" description={hackathonIntro} />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hackathonCards.map((card, i) => {
          const Icon = hackathonIconMap[card.icon];
          return (
            <RevealOnScroll key={card.id} delayMs={i * 70}>
              <div className="glass relative h-full overflow-hidden rounded-xl p-6">
                <div
                  aria-hidden
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-bright/10 blur-2xl"
                />
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-violet-bright/30 bg-violet/15 text-violet-bright">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.description}</p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </Section>
  );
}
