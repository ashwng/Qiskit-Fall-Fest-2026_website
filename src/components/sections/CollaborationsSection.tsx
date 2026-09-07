import { collaborations } from "@/data/collaborations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const tierLabel: Record<string, string> = {
  title: "Title Sponsor",
  partner: "Partners",
  collaborator: "Collaborators",
};

export function CollaborationsSection() {
  const tiers = ["title", "partner", "collaborator"] as const;

  return (
    <Section id="collaborations" className="relative">
      <SectionHeading
        eyebrow="04 · Collaborations"
        title="Built with the community"
        description="To be announced."
      />

      <div className="mt-14 space-y-12 relative z-10">
        {tiers.map((tier) => {
          const items = collaborations.filter((c) => c.tier === tier);
          if (items.length === 0) return null;
          return (
            <div key={tier}>
              <p className="font-mono text-xs uppercase tracking-widest text-violet-bright font-bold">{tierLabel[tier]}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((c, i) => (
                  <RevealOnScroll key={c.id} delayMs={i * 50}>
                    <div className="glass-dark group flex h-28 flex-col items-center justify-center gap-3 rounded-2xl px-4 text-center transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_20px_rgba(8,189,186,0.15)] hover:-translate-y-1">
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-2 font-display text-base font-bold text-cyan transition-colors duration-300 group-hover:bg-cyan/10 group-hover:border-cyan/40">
                        {c.logoInitial}
                      </span>
                      <span className="font-body text-xs font-medium text-ink-dim transition-colors group-hover:text-ink">{c.name}</span>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
