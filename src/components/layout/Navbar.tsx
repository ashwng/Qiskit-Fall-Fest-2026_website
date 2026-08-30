"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/nav";
import { event } from "@/data/event";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-16"
        aria-label="Primary"
      >
        <a
          href="#top"
          className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-ink"
        >
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-md border border-violet-bright/60 bg-violet/20 text-[11px] font-mono text-cyan"
          >
            Q
          </span>
          <span className="hidden sm:inline">{event.fullName}</span>
          <span className="sm:hidden">{event.shortName}</span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-[13px] uppercase tracking-wide text-ink-dim transition-colors hover:text-cyan"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <a
            href={event.registerHref}
            className="whitespace-nowrap rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-wide text-cyan transition-colors hover:bg-cyan/20"
          >
            Register Now
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-md border border-line text-ink lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden border-t border-line bg-bg/95 backdrop-blur-md transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 font-mono text-sm uppercase tracking-wide text-ink-dim transition-colors hover:bg-surface hover:text-cyan"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={event.registerHref}
                onClick={() => setOpen(false)}
                className="block whitespace-nowrap rounded-md border border-cyan/40 bg-cyan/10 px-3 py-3 text-center font-mono text-sm uppercase tracking-wide text-cyan"
              >
                Register Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
