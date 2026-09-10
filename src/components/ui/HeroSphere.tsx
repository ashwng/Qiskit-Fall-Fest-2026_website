"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const QubitSphere = dynamic(() => import("@/components/ui/QubitSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full border border-pink/20 bg-pink/5" />
    </div>
  ),
});

/**
 * The qubit, desktop only.
 *
 * It is a cursor-driven object, so it has nothing to say on a touch screen —
 * and it is the single heaviest thing on the page. Gating on a media query
 * rather than a `hidden` class means three.js is never fetched on a phone at
 * all, instead of being downloaded and then hidden.
 */
export function HeroSphere() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;
  return <QubitSphere />;
}
