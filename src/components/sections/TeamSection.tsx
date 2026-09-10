import { team } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";
import { Pending, isPending } from "@/components/ui/Pending";

/**
 * The organising team.
 *
 * The roles are real and the names are not yet, so the role leads each card
 * and the name sits under it — the reverse of the old order, which put a blank
 * line where the name should be and the only real information beneath it.
 * Links to `#` are dropped rather than rendered as dead icons.
 */
export function TeamSection() {
  return (
    <Section id="team" className="bg-surface/30">
      <SectionHeading title="Organizing Team" meta={`${team.length} roles`} />

      <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-3 lg:grid-cols-4">
        {team.map((member, i) => {
          const links = member.socials.filter((s) => s.href && s.href !== "#");
          return (
            <RevealOnScroll key={member.id} variant="soft" delayMs={i * 45}>
              <div className="qff-card qff-card-interactive group h-full p-4 text-center sm:p-5">
                <div className="overflow-hidden rounded-xl">
                  <PlaceholderAvatar
                    seed={member.imageSeed}
                    className="mx-auto aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-pink-ink">
                  {member.role}
                </p>
                <p className="mt-1.5 font-display text-sm font-bold text-ink">
                  {isPending(member.name) ? (
                    <Pending label="Name soon" />
                  ) : (
                    member.name
                  )}
                </p>
                {links.length > 0 ? (
                  <ul className="mt-3.5 flex justify-center gap-2">
                    {links.map((s) => (
                      <li key={s.platform}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.role} on ${platformLabel[s.platform]}`}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-transparent bg-surface-2/60 text-muted transition-colors duration-300 hover:border-pink/50 hover:text-pink-ink"
                        >
                          <SocialIcon platform={s.platform} className="h-3.5 w-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </Section>
  );
}
