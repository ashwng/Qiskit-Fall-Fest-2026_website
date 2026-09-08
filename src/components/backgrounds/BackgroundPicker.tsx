"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";

import { BACKGROUNDS, type BackgroundId } from "./registry";
import { cn } from "@/lib/utils";

/**
 * A preview control for comparing the candidate backgrounds on the real page.
 *
 * This is scaffolding for choosing, not a site feature — once the team picks
 * one, drop `picker` from <SiteBackground /> in the layout and set
 * DEFAULT_BACKGROUND to the winner.
 */
export function BackgroundPicker({
  active,
  onChange,
}: {
  active: BackgroundId;
  onChange: (id: BackgroundId) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={panelRef}
      className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2 print:hidden"
    >
      {open ? (
        <div className="glass w-72 overflow-hidden rounded-xl shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-deep">
              Background
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close background picker"
              className="grid h-6 w-6 place-items-center rounded text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <ul className="p-1.5">
            {BACKGROUNDS.map((option) => {
              const selected = option.id === active;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => onChange(option.id)}
                    aria-current={selected}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                      selected
                        ? "bg-pink/10 text-ink"
                        : "text-ink-dim hover:bg-surface-2",
                    )}
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-deep",
                        !selected && "opacity-0",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-semibold">
                        {option.label}
                      </span>
                      <span className="block text-xs leading-snug text-muted">
                        {option.note}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="border-t border-line px-4 py-2.5 font-mono text-[10px] leading-relaxed text-muted">
            Saved to this browser. Share one with{" "}
            <span className="text-pink-deep">?bg={active}</span>
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-xs font-medium text-ink-dim shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:text-ink"
      >
        <Sparkles className="h-3.5 w-3.5 text-pink-deep" />
        Background
      </button>
    </div>
  );
}
