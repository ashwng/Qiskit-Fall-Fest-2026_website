import Image from "next/image";
import { team } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";

/**
 * The organising committee: photo, name, role, and links underneath.
 *
 * Cards wrap four to a row on desktop (two on phones) and a short last row is
 * centred rather than left hanging. Links to `#` are dropped rather than
 * rendered as dead icons.
 */
export function TeamSection() {
  return (
    <Section id="team" className="bg-surface/30">
      <SectionHeading title="Organizing Committee" meta={`${team.length} members`} />

      <div className="mt-12 flex flex-wrap justify-center gap-4 sm:mt-14">
        {team.map((member, i) => {
          const links = member.socials.filter((s) => s.href && s.href !== "#");
          return (
            <RevealOnScroll
              key={member.id}
              variant="soft"
              delayMs={i * 45}
              className="w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
            >
              <div className="qff-card qff-card-interactive group h-full p-4 text-center sm:p-5">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderAvatar
                      seed={member.imageSeed}
                      className="mx-auto aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-4 font-display text-sm font-bold text-ink sm:text-base">
                  {member.name}
                </p>
                <p className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-pink-ink">
                  {member.role}
                </p>
                {member.note ? (
                  <p className="mt-1.5 text-xs leading-snug text-muted">{member.note}</p>
                ) : null}
                {links.length > 0 ? (
                  <ul className="mt-3.5 flex justify-center gap-2">
                    {links.map((s) => (
                      <li key={s.platform}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} on ${platformLabel[s.platform]}`}
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
