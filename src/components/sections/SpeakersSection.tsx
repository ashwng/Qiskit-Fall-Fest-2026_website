import { speakers } from "@/data/speakers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";

export function SpeakersSection() {
  return (
    <Section id="speakers" className="bg-surface/30">
      <SectionHeading
        eyebrow="03 · Speakers"
        title="Voices from the field"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Speaker lineup to be announced."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {speakers.map((speaker, i) => (
          <RevealOnScroll key={speaker.id} delayMs={i * 60}>
            <div className="glass group h-full rounded-xl p-5 transition-colors hover:border-violet-bright/40">
              <PlaceholderAvatar seed={speaker.imageSeed} className="aspect-square w-full rounded-lg" />
              <p className="mt-4 font-display text-base font-semibold text-ink">{speaker.name}</p>
              <p className="mt-0.5 text-sm text-cyan">{speaker.designation}</p>
              <p className="text-xs text-muted">{speaker.organization}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{speaker.bio}</p>
              <ul className="mt-4 flex gap-2">
                {speaker.socials.map((s) => (
                  <li key={s.platform}>
                    <a
                      href={s.href}
                      aria-label={`${speaker.name} on ${platformLabel[s.platform]}`}
                      className="grid h-8 w-8 place-items-center rounded-md border border-line text-ink-dim transition-colors hover:border-cyan/50 hover:text-cyan"
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
