"use client";

import { useMemo, useState } from "react";
import { schedule } from "@/data/schedule";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

export function ScheduleSection() {
  const days = useMemo(() => Array.from(new Set(schedule.map((item) => item.day))), []);
  const [activeDay, setActiveDay] = useState(days[0]);

  const items = schedule.filter((item) => item.day === activeDay);

  return (
    <Section id="schedule">
      <SectionHeading
        eyebrow="02 · Schedule"
        title="Three days, one continuous circuit"
        description="Lorem ipsum dolor sit amet — a placeholder run of show. The final schedule will replace every row below without touching this layout."
      />

      <div
        role="tablist"
        aria-label="Schedule day"
        className="mt-10 inline-flex gap-1 rounded-full border border-line bg-surface p-1"
      >
        {days.map((day) => (
          <button
            key={day}
            role="tab"
            aria-selected={activeDay === day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
              activeDay === day ? "bg-violet-bright text-ink" : "text-muted hover:text-ink-dim"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <ol className="relative mt-10 space-y-2 border-l border-line pl-8">
        {items.map((item, i) => (
          <RevealOnScroll key={item.id} as="li" delayMs={i * 50} className="relative">
            <span
              aria-hidden
              className="absolute -left-[calc(2rem+5px)] top-2 h-2.5 w-2.5 rounded-full border border-cyan bg-bg"
            />
            <div className="glass flex flex-col gap-3 rounded-xl p-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="w-28 shrink-0 font-mono text-sm text-cyan">{item.time}</div>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
              {item.track ? (
                <span className="w-fit shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-dim">
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
