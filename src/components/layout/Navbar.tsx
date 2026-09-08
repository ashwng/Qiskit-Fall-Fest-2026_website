"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/nav";
import { event } from "@/data/event";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-line bg-surface/80 backdrop-blur-md shadow-lg"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex w-full items-center justify-between px-4 sm:px-8 lg:px-12 transition-all duration-300",
          scrolled ? "h-16" : "h-20"
        )}
        aria-label="Primary"
      >
        <a
          href="#top"
          className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-ink group"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-line bg-surface-2 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/image-removebg-preview.png"
              alt=""
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-[13px] font-medium text-ink-dim transition-all duration-300 hover:text-pink-ink hover:drop-shadow-[0_0_8px_rgba(255,126,182,0.5)]"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* DESKTOP ACTIONS */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          <a
            href={event.registerHref}
            className="glow-button inline-block whitespace-nowrap rounded-full bg-surface-2 border border-line px-6 py-2.5 font-display text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:border-violet-bright"
          >
            Register Now
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-md border border-line bg-surface-2/50 text-ink transition-colors hover:bg-surface-2 hover:text-pink-ink"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden border-t border-line bg-surface/95 backdrop-blur-xl transition-[grid-template-rows] duration-300 lg:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 px-4 py-4 sm:px-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 font-mono text-sm font-semibold text-ink-dim transition-all duration-300 hover:bg-surface-2 hover:text-pink-ink hover:pl-5"
                >
                  {item.label}
                </a>
              </li>
            ))}

            {/* MOBILE BUTTON */}
            <li className="pt-4 pb-2">
              <a
                href={event.registerHref}
                onClick={() => setOpen(false)}
                className="glow-button block whitespace-nowrap rounded-md bg-surface-2 border border-line px-3 py-3.5 text-center font-display text-sm font-bold text-ink transition-all duration-300 hover:text-white"
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

