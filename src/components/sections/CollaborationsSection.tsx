import { collaborations } from "@/data/collaborations";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { isPending } from "@/components/ui/Pending";

const tierLabel: Record<string, string> = {
  title: "Title sponsor",
  partner: "Partners",
  collaborator: "Collaborators",
};

/**
 * The sponsor wall.
 *
 * Every slot is still unconfirmed, and six rounded cards each reading "To be
 * announced" made the section look broken rather than early. An unfilled slot
 * is drawn as a slot — a dashed outline the eye skips — so the tiers read as a
 * wall that is waiting to be filled, which is exactly what they are.
 */
export function CollaborationsSection() {
  const tiers = ["title", "partner", "collaborator"] as const;

  return (
    <Section id="collaborations">
      <SectionHeading title="Collaborations" meta="Slots open" />

      <div className="mt-12 space-y-10 sm:mt-14 sm:space-y-12">
        {tiers.map((tier) => {
          const items = collaborations.filter((c) => c.tier === tier);
          if (items.length === 0) return null;

          return (
            <div key={tier}>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink-ink">
                {tierLabel[tier]}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((c, i) => (
                  <RevealOnScroll key={c.id} variant="soft" delayMs={i * 50}>
                    {isPending(c.name) ? (
                      <div className="grid h-24 place-items-center rounded-xl border border-dashed border-line">
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                          Open
                        </span>
                      </div>
                    ) : (
                      <div className="qff-card qff-card-interactive flex h-24 flex-col items-center justify-center gap-2.5 px-4 text-center">
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface-2 font-display text-sm font-bold text-pink-ink">
                          {c.logoInitial}
                        </span>
                        <span className="text-xs font-medium text-ink-dim">
                          {c.name}
                        </span>
                      </div>
                    )}
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
