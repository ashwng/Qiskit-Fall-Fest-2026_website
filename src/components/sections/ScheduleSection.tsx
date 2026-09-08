"use client";

import { useMemo, useState } from "react";
import { schedule } from "@/data/schedule";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { cn } from "@/lib/utils";

export function ScheduleSection() {
  const days = useMemo(
    () => Array.from(new Set(schedule.map((item) => item.day))),
    [],
  );
  const [activeDay, setActiveDay] = useState(days[0]);

  const items = schedule.filter((item) => item.day === activeDay);

  return (
    <Section id="schedule" className="relative">
      <SectionHeading
        eyebrow="02 · Schedule"
        title="Five days, one continuous circuit"
        description="28th October to 1st November"
      />

      <div
        role="tablist"
        aria-label="Schedule day"
        className="mt-10 inline-flex gap-1 rounded-full border border-line bg-surface-2 p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.2)]"
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
                ? "bg-violet-bright text-white shadow-[0_0_15px_rgba(165,110,255,0.4)]"
                : "text-muted hover:bg-surface hover:text-ink",
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <ol className="relative mt-12 space-y-4 border-l-2 border-line pl-8">
        {items.map((item, i) => (
          <RevealOnScroll
            key={item.id}
            as="li"
            delayMs={i * 50}
            className="relative group"
          >
            <span
              aria-hidden
              className="absolute -left-[calc(2rem+7px)] top-4 h-3 w-3 rounded-full border-2 border-violet-bright bg-surface transition-all duration-300 group-hover:bg-violet-bright group-hover:shadow-[0_0_12px_rgba(165,110,255,0.8)] group-hover:scale-125"
            />
            <div className="glass-dark flex flex-col gap-3 rounded-2xl p-6 sm:flex-row sm:items-center sm:gap-6 transition-all duration-300 hover:border-violet-bright/50 hover:shadow-[0_0_25px_rgba(138,63,252,0.15)] hover:bg-surface-2/80 hover:-translate-x-1 hover:translate-y-0.5">
              <div className="w-32 sm:w-40 shrink-0 font-mono text-sm font-bold text-pink-ink">
                {item.time}
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold text-ink">
                  {item.title}
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
              {item.track ? (
                <span className="w-fit shrink-0 rounded-full border border-pink/30 bg-pink/10 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-pink-ink">
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
