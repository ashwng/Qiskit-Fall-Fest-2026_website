import { ArrowUpRight } from "lucide-react";
import { learnSteps, learnIntro, learnMore } from "@/data/learn";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

/**
 * The run-up to the hackathon.
 *
 * A numbered path rather than a card grid: the order is the whole point, and
 * each row is a link off the site, so the arrow and the source belong on the
 * row itself.
 */
export function LearnSection() {
  return (
    <Section id="learn">
      <SectionHeading
        title="Head start"
        meta="Free · IBM Quantum"
        description={learnIntro}
      />

      <ol className="mt-12 border-t border-line-soft sm:mt-14">
        {learnSteps.map((item, i) => (
          <RevealOnScroll
            key={item.id}
            as="li"
            variant="side"
            delayMs={i * 60}
            className="border-b border-line-soft"
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 gap-y-2 py-6 transition-colors duration-300 sm:gap-x-8 sm:py-7"
            >
              <span className="font-mono text-sm font-bold tabular-nums text-pink-ink">
                {item.step}
              </span>

              <span className="min-w-0">
                <span className="block font-display text-lg font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-pink-ink dark:text-white sm:text-xl">
                  {item.title}
                </span>
                <span className="mt-2 block max-w-[62ch] text-sm leading-relaxed text-muted">
                  {item.description}
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  <span className="text-pink-ink">{item.source}</span>
                  <span aria-hidden>·</span>
                  <span>{item.effort}</span>
                </span>
              </span>

              <ArrowUpRight
                aria-hidden
                className="h-5 w-5 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pink-ink"
              />
            </a>
          </RevealOnScroll>
        ))}
      </ol>

      <ul className="mt-8 flex flex-wrap gap-3">
        {learnMore.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-5 py-2.5 text-sm font-semibold text-ink-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-pink/60 hover:text-ink"
            >
              {link.label}
              <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
