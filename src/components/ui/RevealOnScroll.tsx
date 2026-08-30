"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "li";
}

/**
 * Lightweight, dependency-free scroll-reveal primitive.
 * Uses IntersectionObserver rather than a motion library to keep the
 * client bundle minimal (see architecture notes on performance budget).
 */
export function RevealOnScroll({ children, className, delayMs = 0, as = "div" }: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const sharedProps = {
    ref: ref as React.Ref<HTMLDivElement & HTMLLIElement>,
    className: cn("reveal", visible && "is-visible", className),
    style: { transitionDelay: `${delayMs}ms` },
  };

  if (as === "li") {
    return <li {...sharedProps}>{children}</li>;
  }

  return <div {...sharedProps}>{children}</div>;
}
