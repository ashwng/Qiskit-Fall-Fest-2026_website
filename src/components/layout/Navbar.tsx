"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/nav";
import { event } from "@/data/event";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * A floating capsule nav — the "dynamic island" treatment.
 *
 * Rather than a full-width bar pinned to the top edge, the nav is an inset
 * pill that the page scrolls under. It tightens slightly once you leave the
 * top of the page, and a scroll-spy slides a filled pill onto whichever
 * section you are reading, so the island always says where you are.
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onRegistration = pathname === "/registration";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy. The observation band sits in the upper part of the viewport so
  // a section becomes "current" as its heading reaches reading position, not
  // when its last pixel finally leaves the screen.
  useEffect(() => {
    if (!isHome) return;
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter((node): node is Element => node !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(`#${visible[0].target.id}`);
      },
      { rootMargin: "-12% 0px -68% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const registerTarget = isHome ? event.registerHref : "#form-section";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 print:hidden">
      <nav
        className={cn(
          "qff-island mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full transition-all duration-300",
          scrolled ? "p-1.5 sm:p-2" : "p-2 sm:p-2.5",
        )}
        aria-label="Primary"
      >
        <Link
          href={isHome ? "#top" : "/"}
          className="group flex shrink-0 items-center gap-2.5 rounded-full pl-1 pr-2"
        >
          <span className="relative block h-9 w-9 overflow-hidden rounded-full border border-line bg-surface-2 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/image-removebg-preview.png"
              alt=""
              width={36}
              height={36}
              className="object-cover"
            />
          </span>
          <span className="sr-only">{event.fullName}</span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const active = isHome && activeId === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={isHome ? item.href : `/${item.href}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "block rounded-full px-3.5 py-2 text-[13px] transition-colors duration-200",
                    active
                      ? "bg-ink/[0.07] font-semibold text-ink dark:bg-white/10"
                      : "font-medium text-ink-dim hover:bg-ink/[0.04] hover:text-ink dark:hover:bg-white/[0.06]",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href={registerTarget}
            aria-current={onRegistration ? "page" : undefined}
            className="inline-flex items-center whitespace-nowrap rounded-full bg-pink-ink px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_-6px_rgba(208,38,112,0.9)] transition-all duration-300 hover:bg-pink-deep hover:shadow-[0_8px_26px_-6px_rgba(208,38,112,1)]"
          >
            Register
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-dim transition-colors hover:bg-ink/[0.06] hover:text-ink lg:hidden dark:hover:bg-white/10"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "mx-auto grid max-w-6xl overflow-hidden transition-[grid-template-rows,margin] duration-300 lg:hidden",
          open ? "mt-2 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="qff-island flex flex-col gap-1 rounded-3xl p-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={isHome ? item.href : `/${item.href}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink-dim transition-colors hover:bg-ink/[0.05] hover:text-ink dark:hover:bg-white/[0.07]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
