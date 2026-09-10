import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function Section({
  id,
  children,
  className,
  bordered = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-line-soft px-5 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-28",
        bordered && "border-t",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
