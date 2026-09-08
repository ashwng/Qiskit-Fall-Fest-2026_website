import { team } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";

export function TeamSection() {
  return (
    <Section id="team" className="relative bg-surface/30">
      <div className="absolute top-1/2 left-0 w-1/4 h-1/3 bg-[radial-gradient(ellipse_at_left,rgba(255,126,182,0.05),transparent_70%)] pointer-events-none" />

      <SectionHeading
        eyebrow="05 · Organizing Team"
        title="The people behind QFF"
        description="  "
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-3 lg:grid-cols-4 relative z-10">
        {team.map((member, i) => (
          <RevealOnScroll key={member.id} delayMs={i * 45}>
            <div className="glass-dark group rounded-2xl p-5 text-center transition-all duration-300 hover:border-pink/50 hover:shadow-[0_0_25px_rgba(255,126,182,0.1)] hover:-translate-y-1">
              <div className="overflow-hidden rounded-xl">
                <PlaceholderAvatar seed={member.imageSeed} className="mx-auto aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-4 font-display text-base font-bold text-ink">{member.name}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-pink-ink font-bold">{member.role}</p>
              <ul className="mt-4 flex justify-center gap-2">
                {member.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      aria-label={`${member.name} on ${platformLabel[s.platform]}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-transparent bg-surface-2/50 text-muted transition-all duration-300 hover:border-violet-bright hover:text-pink-ink hover:bg-surface-2 hover:shadow-[0_0_10px_rgba(138,63,252,0.2)] hover:-translate-y-0.5"
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
