"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 text-ink transition-all duration-300 hover:border-violet-bright hover:text-cyan hover:shadow-[0_0_15px_rgba(138,63,252,0.3)] hover:-translate-y-0.5"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
