import Image from "next/image";
import { speakers } from "@/data/speakers";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { PlaceholderAvatar } from "@/components/ui/PlaceholderAvatar";
import { QffFigure } from "@/components/ui/QffFigure";
import { isPending } from "@/components/ui/Pending";

/**
 * The lineup, or an honest note that there isn't one yet.
 *
 * Until a speaker is confirmed the section rendered four portrait cards, each
 * repeating "To be announced" four times over a generated avatar and two links
 * to `#`. Four fake people is worse than none: while every entry is a
 * placeholder the section says so once, and the grid returns on its own as
 * soon as a real name lands in the data.
 */
export function SpeakersSection() {
  const announced = speakers.filter((s) => !isPending(s.name));

  return (
    <Section id="speakers" className="bg-surface/30">
      <SectionHeading
        title="Speakers"
        meta={announced.length > 0 ? `${announced.length} confirmed` : undefined}
      />

      {announced.length === 0 ? (
        <RevealOnScroll variant="soft" className="mt-12 sm:mt-14">
          <div className="qff-card relative overflow-hidden px-7 py-12 sm:px-12 sm:py-16">
            <QffFigure
              name="bird-hummingbirds"
              className="pointer-events-none absolute -right-6 -top-4 w-40 opacity-20 sm:right-8 sm:top-6 sm:w-52"
            />
            <p className="relative max-w-md font-display text-2xl font-bold leading-snug text-ink dark:text-white sm:text-3xl">
              The lineup is{" "}
              <span className="text-pink-ink">still being confirmed</span>.
            </p>
            <p className="relative mt-4 max-w-md text-base leading-relaxed text-muted">
              Speakers are announced here as they are booked. Register and
              you&rsquo;ll hear about each one first.
            </p>
          </div>
        </RevealOnScroll>
      ) : (
        <div className="mt-12 flex flex-wrap justify-center gap-5 sm:mt-14">
          {announced.map((speaker, i) => (
            <RevealOnScroll
              key={speaker.id}
              delayMs={i * 60}
              className="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <div className="qff-card qff-card-interactive group flex h-full flex-col p-6">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                  {speaker.image ? (
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderAvatar
                      seed={speaker.imageSeed}
                      className="aspect-square w-full rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-5 font-display text-lg font-bold text-ink">
                  {speaker.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {speaker.description}
                </p>
                <ul className="mt-auto flex gap-2 pt-5">
                  {speaker.socials
                    .filter((s) => s.href && s.href !== "#")
                    .map((s) => (
                      <li key={s.platform}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${speaker.name} on ${platformLabel[s.platform]}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 text-ink-dim transition-colors duration-300 hover:border-pink/60 hover:text-pink-ink"
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
      )}
    </Section>
  );
}
