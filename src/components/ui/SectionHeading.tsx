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
  align?: "left" | "center";
  className?: string;
}

/**
 * One loud word per section.
 *
 * This used to render a numbered eyebrow ("00 · DETAILS"), a sentence-long
 * title, and a description that was usually the placeholder "To be
 * announced." The numbering carried nothing the nav didn't already say, and
 * three stacked layers of text above every section read as filler.
 */
export function SectionHeading({
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-pink-ink sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 text-xl leading-relaxed text-ink sm:text-2xl sm:leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
