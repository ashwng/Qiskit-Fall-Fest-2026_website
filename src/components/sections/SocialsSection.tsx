import { socials } from "@/data/socials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";

export function SocialsSection() {
  return (
    <Section id="socials" className="relative">
      <SectionHeading title="Socials" />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {socials.map((s, i) => (
          <RevealOnScroll key={s.platform} delayMs={i * 50}>
            <a
              href={s.href}
              className="glass-dark group flex items-center gap-5 rounded-2xl p-5 transition-all duration-300 hover:border-pink/50 hover:shadow-[0_0_20px_rgba(255,126,182,0.15)] hover:-translate-y-1"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-pink-ink transition-colors duration-300 group-hover:bg-pink/10 group-hover:border-pink/30 group-hover:shadow-[0_0_15px_rgba(255,126,182,0.2)]">
                <SocialIcon platform={s.platform} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-base font-bold text-ink transition-colors group-hover:text-pink-ink">
                  {platformLabel[s.platform]}
                </span>
                <span className="block mt-0.5 font-mono text-[11px] text-muted">{s.handle}</span>
              </span>
            </a>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
