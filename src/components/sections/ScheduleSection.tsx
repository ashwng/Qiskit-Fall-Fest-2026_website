"use client";

import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { schedule } from "@/data/schedule";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

const RUN_DATES = "28 Oct — 1 Nov 2026";

export function ScheduleSection() {
  const days = useMemo(
    () => Array.from(new Set(schedule.map((item) => item.day))),
    [],
  );
  const [activeDay, setActiveDay] = useState(days[0]);

  const items = schedule.filter((item) => item.day === activeDay);

  return (
    <Section id="schedule" className="relative">
      <SectionHeading title="Schedule" />

      {/* The run of the fest, stated once as a fact rather than as a sentence
          under the heading. Its own block, so it sits below the heading rather
          than flowing inline beside the day tabs. */}
      <div className="mt-7">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-pink/30 bg-pink/10 px-5 py-3">
          <CalendarDays aria-hidden className="h-5 w-5 text-pink-ink" />
          <span className="font-mono text-sm font-semibold tracking-wide text-pink-ink">
            {RUN_DATES}
          </span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Schedule day"
        className="mt-8 flex w-fit flex-wrap gap-1 rounded-full border border-line bg-surface-2/70 p-1.5 backdrop-blur-sm"
      >
        {days.map((day) => (
          <button
            key={day}
            role="tab"
            aria-selected={activeDay === day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300",
              activeDay === day
                ? "bg-pink-fill text-white shadow-[0_6px_18px_-6px_rgba(208,38,112,0.9)]"
                : "text-muted hover:bg-surface hover:text-ink",
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* A rail with the time set on it, so the eye runs down the times and
          the titles sit in one column beside them. */}
      <ol className="mt-12 space-y-3">
        {items.map((item, i) => (
          <RevealOnScroll key={item.id} as="li" delayMs={i * 50}>
            <div className="group grid gap-4 rounded-2xl border border-line bg-surface/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-pink/45 hover:bg-surface/80 sm:grid-cols-[10.5rem_1fr_auto] sm:items-center sm:gap-6 sm:p-6">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-8 w-[3px] shrink-0 rounded-full bg-pink/40 transition-colors duration-300 group-hover:bg-pink"
                />
                <span className="font-mono text-sm font-semibold tabular-nums text-pink-ink">
                  {item.time}
                </span>
              </div>

              <div className="min-w-0">
                <p className="font-display text-xl font-bold tracking-tight text-ink">
                  {item.title}
                </p>
                {item.description ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {item.track ? (
                <span className="w-fit shrink-0 rounded-full border border-line bg-surface-2 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-dim transition-colors duration-300 group-hover:border-pink/40 group-hover:text-pink-ink">
                  {item.track}
                </span>
              ) : null}
            </div>
          </RevealOnScroll>
        ))}
      </ol>
    </Section>
  );
}
