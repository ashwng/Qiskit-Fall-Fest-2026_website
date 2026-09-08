"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { socials } from "@/data/socials";
import { event } from "@/data/event";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/utils";

/**
 * A small island docked bottom-right that opens the ways to reach the team.
 *
 * Channels come straight from `src/data/socials.ts`, so this stays in step
 * with the Socials section rather than duplicating a second list of links.
 * Entries still parked on a placeholder href are filtered out — a dead link in
 * a contact panel is worse than one fewer option.
 */
export function ContactDock() {
  const [open, setOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  const channels = socials.filter(
    (social) => social.href && social.href !== "#",
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: MouseEvent) => {
      if (!dockRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={dockRef}
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 print:hidden"
    >
      {open ? (
        <div
          id="contact-panel"
          className="qff-island w-[17.5rem] origin-bottom-right overflow-hidden rounded-3xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-line/70 px-4 py-3.5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-ink">
                Get in touch
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {event.organizer}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close contact panel"
              className="-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-ink/[0.06] hover:text-ink dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <ul className="p-1.5">
            {channels.map((channel) => (
              <li key={channel.platform}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-ink/[0.05] dark:hover:bg-white/[0.07]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink/12 text-pink-ink">
                    <SocialIcon
                      platform={channel.platform}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold text-ink">
                      {platformLabel[channel.platform]}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {channel.handle}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="border-t border-line/70 px-4 py-2.5 text-[11px] leading-relaxed text-muted">
            Questions about registration? Reach us on any channel above.
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="contact-panel"
        className={cn(
          "qff-island inline-flex items-center gap-2 rounded-full py-2.5 pl-3.5 pr-4 text-[13px] font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5",
        )}
      >
        <MessageCircle className="h-4 w-4 text-pink-ink" />
        Contact
      </button>
    </div>
  );
}
