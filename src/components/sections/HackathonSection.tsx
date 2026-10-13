import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { event } from "@/data/event";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QffFigure } from "@/components/ui/QffFigure";

/**
 * The hackathon: its length and a way in. Details (problem statements,
 * rules, prizes) go here once they are announced.
 */
export function HackathonSection() {
  return (
    <Section id="hackathon" className="relative overflow-hidden bg-surface/30">
      <QffFigure
        name="bird-eagle"
        className="pointer-events-none absolute -right-12 -top-2 w-36 opacity-[0.16] sm:right-0 sm:top-6 sm:w-64 sm:opacity-25 lg:right-[4%] lg:top-10 lg:w-80"
      />

      <div className="relative">
        <SectionHeading title="Hackathon" meta="72 hours" />

        <Link
          href={event.registerHref}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-pink-fill px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover"
        >
          Take part
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}
