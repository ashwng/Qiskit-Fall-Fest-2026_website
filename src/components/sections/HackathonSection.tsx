import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { hackathon } from "@/data/event";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QffFigure } from "@/components/ui/QffFigure";
import { Pending, isPending } from "@/components/ui/Pending";

/**
 * The hackathon: a short brief, its tracks, the rulebook, and a way in.
 *
 * The full rules live in the downloadable rulebook rather than on the page, so
 * this section stays a summary. Everything it shows comes from `hackathon` in
 * src/data/event.ts.
 */
export function HackathonSection() {
  return (
    <Section id="hackathon" className="relative overflow-hidden bg-surface/30">
      <QffFigure
        name="bird-eagle"
        className="pointer-events-none absolute -right-12 -top-2 w-36 opacity-[0.16] sm:right-0 sm:top-6 sm:w-64 sm:opacity-25 lg:right-[4%] lg:top-10 lg:w-80"
      />

      <div className="relative">
        <SectionHeading
          title="Hackathon"
          meta={hackathon.duration}
          description={
            isPending(hackathon.details) ? (
              <Pending label="Details announcing soon" />
            ) : (
              hackathon.details
            )
          }
        />

        {/* One card per track. A team can enter any of them under one code. */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {hackathon.tracks.map((track) => (
            <li
              key={track.id}
              className="rounded-2xl border border-line-soft bg-surface-2/80 p-5 backdrop-blur-sm sm:p-6"
            >
              <h3 className="font-display text-xl font-bold text-ink">{track.label}</h3>
              <div className="mt-3 text-sm leading-relaxed text-ink-dim">
                {isPending(track.details) ? (
                  <Pending label="Details announcing soon" />
                ) : (
                  <p className="whitespace-pre-line">{track.details}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {hackathon.rulebookHref ? (
            <a
              href={hackathon.rulebookHref}
              download
              className="group inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-7 py-3 text-sm font-bold text-pink-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-pink"
            >
              <FileText aria-hidden className="h-4 w-4" />
              Read the Rulebook
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line px-7 py-3 text-sm font-bold text-muted"
            >
              <FileText aria-hidden className="h-4 w-4" />
              Rulebook coming soon
            </span>
          )}

          <Link
            href={hackathon.registerHref}
            className="group inline-flex items-center gap-2 rounded-full bg-pink-fill px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover"
          >
            Register for the Hackathon
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
