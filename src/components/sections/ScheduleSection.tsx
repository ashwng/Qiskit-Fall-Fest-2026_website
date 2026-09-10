"use client";

import { useMemo, useState } from "react";
import { schedule } from "@/data/schedule";
import { event } from "@/data/event";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

/**
 * The programme, as a timeline.
 *
 * The rows used to be another set of bordered boxes in another vertical
 * stack. A rail with a node per session reads as a day rather than as a list,
 * and it is the one shape on the page that carries the passage of time — which
 * is the only thing this section is about.
 */
export function ScheduleSection() {
  const days = useMemo(
    () => Array.from(new Set(schedule.map((item) => item.day))),
    [],
  );
  const [activeDay, setActiveDay] = useState(days[0]);

  const items = schedule.filter((item) => item.day === activeDay);

  return (
    <Section id="schedule">
      <SectionHeading title="Schedule" meta={event.dates} />

      <div
        role="tablist"
        aria-label="Schedule day"
        className="mt-10 flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-line bg-surface-2/70 p-1.5"
      >
        {days.map((day) => (
          <button
            key={day}
            role="tab"
            aria-selected={activeDay === day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-all duration-300 sm:px-5",
              activeDay === day
                ? "bg-pink-fill text-white shadow-[0_6px_16px_-8px_rgba(208,38,112,0.9)]"
                : "text-muted hover:bg-surface hover:text-ink",
            )}
          >
            {day}
          </button>
        ))}
      </div>

      {/* The rail is a border on the list itself, so it ends exactly at the
          last session instead of running past it. */}
      <ol className="qff-rail mt-10 pl-6 sm:mt-12 sm:pl-9">
        {items.map((item, i) => (
          <RevealOnScroll
            key={item.id}
            as="li"
            variant="side"
            delayMs={i * 55}
            className="group relative pb-9 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[1.75rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-pink transition-transform duration-300 group-hover:scale-125 sm:-left-[2.5rem]"
            />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-sm font-semibold tabular-nums text-pink-ink">
                {item.time}
              </span>
              {item.track ? (
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                  {item.track}
                </span>
              ) : null}
            </div>
            <p className="mt-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {item.title}
            </p>
            {item.description ? (
              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            ) : null}
          </RevealOnScroll>
        ))}
      </ol>
    </Section>
  );
}
