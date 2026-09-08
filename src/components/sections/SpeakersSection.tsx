import { speakers } from "@/data/speakers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";

export function SpeakersSection() {
  return (
    <Section id="speakers" className="relative bg-surface/30">
      <div className="absolute top-1/3 right-0 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_right,rgba(138,63,252,0.08),transparent_70%)] pointer-events-none" />

      <SectionHeading
        eyebrow="03 · Speakers"
        title="Voices from the field"
        description="To be announced."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        {speakers.map((speaker, i) => (
          <RevealOnScroll key={speaker.id} delayMs={i * 60}>
            <div className="glass-dark group h-full rounded-2xl p-6 transition-all duration-300 hover:border-violet-bright/50 hover:shadow-[0_0_30px_rgba(138,63,252,0.15)] hover:-translate-y-1">
              <div className="overflow-hidden rounded-xl">
                <PlaceholderAvatar seed={speaker.imageSeed} className="aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-5 font-display text-lg font-bold text-ink">{speaker.name}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-pink-ink font-bold">{speaker.designation}</p>
              <p className="mt-1 text-xs text-muted">{speaker.organization}</p>
              <p className="mt-4 font-body text-sm leading-relaxed text-muted">{speaker.bio}</p>
              <ul className="mt-5 flex gap-2">
                {speaker.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      aria-label={`${speaker.name} on ${platformLabel[s.platform]}`}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 text-ink-dim transition-all duration-300 hover:border-violet-bright hover:text-pink-ink hover:shadow-[0_0_15px_rgba(138,63,252,0.3)] hover:-translate-y-0.5"
                    >
                      <SocialIcon platform={s.platform} className="h-4 w-4" />
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
