"use client";

import dynamic from "next/dynamic";

const QubitSphere = dynamic(() => import("@/components/ui/QubitSphere"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-40 w-40 rounded-full border border-pink/20 bg-pink/5 animate-pulse" />
    </div>
  ),
});

export function HeroSphere() {
  return <QubitSphere />;
}
