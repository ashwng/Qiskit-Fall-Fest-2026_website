import { team } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";

export function TeamSection() {
  return (
    <Section id="team" className="bg-surface/30">
      <SectionHeading
        eyebrow="05 · Organizing Team"
        title="The people behind QFF"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Meet the students organizing this year's fest."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {team.map((member, i) => (
          <RevealOnScroll key={member.id} delayMs={i * 45}>
            <div className="glass group rounded-xl p-4 text-center transition-colors hover:border-cyan/40">
              <PlaceholderAvatar seed={member.imageSeed} className="mx-auto aspect-square w-full rounded-lg" />
              <p className="mt-3 font-display text-sm font-semibold text-ink">{member.name}</p>
              <p className="text-xs text-cyan">{member.role}</p>
              <ul className="mt-2 flex justify-center gap-2">
                {member.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      aria-label={`${member.name} on ${platformLabel[s.platform]}`}
                      className="grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:text-cyan"
                    >
                      <SocialIcon platform={s.platform} className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
