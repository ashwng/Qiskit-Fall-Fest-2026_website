import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Every section opens with a "gate" marker — a small square node, the way a
 * quantum-circuit diagram marks an operation on a wire. This is a literal
 * nod to the circuit-rail motif that threads down the page, not a decorative
 * 01/02/03 counter.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-cyan",
          align === "center" && "justify-center",
        )}
      >
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full border border-cyan bg-cyan/20 shadow-[0_0_8px_rgba(8,189,186,0.8)]"
        />
        <span className="font-mono text-violet-bright">{eyebrow}</span>
      </div>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
