"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Which entrance this element makes. One identical rise on every element down
 * the page reads as a template, so each section picks the motion that suits
 * its own structure: rows wipe in from their start edge, walls of logos just
 * resolve, and the rise is kept for things that genuinely sit on the page.
 */
type RevealVariant = "up" | "side" | "soft";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: "reveal",
  side: "reveal-side",
  soft: "reveal-soft",
};

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "li";
  variant?: RevealVariant;
}

/**
 * Lightweight, dependency-free scroll-reveal primitive.
 * Uses IntersectionObserver rather than a motion library to keep the
 * client bundle minimal (see architecture notes on performance budget).
 */
export function RevealOnScroll({
  children,
  className,
  delayMs = 0,
  as = "div",
  variant = "up",
}: RevealOnScrollProps) {
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
    className: cn(VARIANT_CLASS[variant], visible && "is-visible", className),
    style: { transitionDelay: `${delayMs}ms` },
  };

  if (as === "li") {
    return <li {...sharedProps}>{children}</li>;
  }

  return <div {...sharedProps}>{children}</div>;
}
