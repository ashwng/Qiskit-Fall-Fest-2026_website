import { socials } from "@/data/socials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { isPending } from "@/components/ui/Pending";

/**
 * Six links.
 *
 * They were six full-width cards in the same grid as the details, the
 * hackathon and the sponsors — a quarter of the page's height spent on a link
 * list. Pills say the same thing in two lines, and an account the fest has not
 * opened yet is shown as a slot rather than as a link to nowhere.
 */
export function SocialsSection() {
  return (
    <Section id="socials">
      <SectionHeading title="Socials" meta="qBITS · BITS Goa" />

      <ul className="mt-10 flex flex-wrap gap-3">
        {socials.map((s, i) => {
          const label = platformLabel[s.platform];
          const pending = isPending(s.handle) || s.href === "#";

          return (
            <RevealOnScroll
              key={s.platform}
              as="li"
              variant="soft"
              delayMs={i * 45}
            >
              {pending ? (
                <span className="inline-flex items-center gap-3 rounded-full border border-dashed border-line px-5 py-3 text-muted">
                  <SocialIcon platform={s.platform} className="h-4 w-4" />
                  <span className="font-display text-sm font-bold">{label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
                    soon
                  </span>
                </span>
              ) : (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-line bg-surface/70 px-5 py-3 text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-pink/60 hover:bg-surface"
                >
                  <SocialIcon
                    platform={s.platform}
                    className="h-4 w-4 text-pink-ink"
                  />
                  <span className="font-display text-sm font-bold">{label}</span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted transition-colors group-hover:text-ink-dim">
                    {s.handle}
                  </span>
                </a>
              )}
            </RevealOnScroll>
          );
        })}
      </ul>
    </Section>
  );
}
