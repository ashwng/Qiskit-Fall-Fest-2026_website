"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Light/dark switch. Lives in the bottom-right dock beside Contact, so it
 * wears the same island surface as its neighbour rather than the bordered
 * square it used inside the nav capsule.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Reserve the same box before hydration, so the dock does not reflow when
  // the real control arrives.
  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden />;
  }

  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="qff-island grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink transition-transform duration-300 hover:-translate-y-0.5"
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? (
        <Moon className="h-4 w-4 text-pink-ink" />
      ) : (
        <Sun className="h-4 w-4 text-pink-ink" />
      )}
    </button>
  );
}
