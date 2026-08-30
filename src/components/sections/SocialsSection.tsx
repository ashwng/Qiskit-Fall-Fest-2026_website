import { socials } from "@/data/socials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";

export function SocialsSection() {
  return (
    <Section id="socials">
      <SectionHeading
        eyebrow="06 · Socials"
        title="Stay in the loop"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Follow along for announcements, drops, and behind-the-scenes updates."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {socials.map((s, i) => (
          <RevealOnScroll key={s.platform} delayMs={i * 50}>
            <a
              href={s.href}
              className="glass group flex items-center gap-4 rounded-xl p-5 transition-colors hover:border-cyan/40"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-line bg-surface text-cyan">
                <SocialIcon platform={s.platform} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-sm font-semibold text-ink">
                  {platformLabel[s.platform]}
                </span>
                <span className="block font-mono text-xs text-muted">{s.handle}</span>
              </span>
            </a>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
