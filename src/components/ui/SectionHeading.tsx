import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** The section's name, and the whole heading. Set in the fest pink. */
  title: string;
  /**
   * Only pass this where there is genuinely something to read. Most sections
   * say everything they need to in the title, and a line of filler under
   * every heading is what makes a page feel padded out.
   */
  description?: ReactNode;
  /**
   * A short fact that belongs to the section itself — a count, a date range.
   * It rides the rule beside the title instead of becoming another line.
   */
  meta?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * One loud word per section, sitting on a rule.
 *
 * The title alone was already the whole heading, but nine of them down the
 * page read as nine identical drops rather than as structure. The rule gives
 * each one a baseline to sit on and somewhere for the section's own fact to
 * live, which is what turns a stack of headings into a contents page.
 */
export function SectionHeading({
  title,
  description,
  meta,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div
        className={cn(
          "flex flex-wrap items-baseline gap-x-6 gap-y-2",
          align === "center" && "justify-center",
        )}
      >
        <h2 className="min-w-0 font-display text-[2rem] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-pink-ink sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {meta ? (
          <span className="min-w-0 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {meta}
          </span>
        ) : null}
      </div>

      <hr className="qff-rule mt-6" />

      {description ? (
        <p className="mt-7 max-w-[68ch] text-lg leading-relaxed text-ink-dim sm:text-xl sm:leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
