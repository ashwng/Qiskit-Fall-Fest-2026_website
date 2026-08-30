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
    <Section id="collaborations">
      <SectionHeading
        eyebrow="04 · Collaborations"
        title="Built with the community"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sponsor and partner logos placeholder — swap the data file to update this wall."
      />

      <div className="mt-14 space-y-12">
        {tiers.map((tier) => {
          const items = collaborations.filter((c) => c.tier === tier);
          if (items.length === 0) return null;
          return (
            <div key={tier}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{tierLabel[tier]}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((c, i) => (
                  <RevealOnScroll key={c.id} delayMs={i * 50}>
                    <div className="glass flex h-24 flex-col items-center justify-center gap-2 rounded-xl px-4 text-center">
                      <span className="grid h-9 w-9 place-items-center rounded-full border border-line-soft bg-surface-2 font-display text-sm text-cyan">
                        {c.logoInitial}
                      </span>
                      <span className="text-xs text-ink-dim">{c.name}</span>
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
