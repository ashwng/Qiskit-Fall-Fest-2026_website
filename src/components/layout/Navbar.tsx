"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems } from "@/data/nav";
import { event } from "@/data/event";
import { cn } from "@/lib/utils";
import { QffFigure } from "@/components/ui/QffFigure";
import { QbitsMark, IbmMark } from "@/components/layout/BrandMarks";


/**
 * A floating capsule nav — the "dynamic island" treatment, on desktop only.
 *
 * Above `lg` the nav is an inset pill that the page scrolls under. It tightens
 * once you leave the top of the page, and a scroll-spy slides a filled pill
 * onto whichever section you are reading, so the island always says where you
 * are.
 *
 * On a phone the island was most of the screen's width and sat on top of every
 * heading it passed, so there is no capsule at all: just the menu button in
 * the top-right corner, and the sheet it opens.
 */
/** Breathing room between the bottom of the fixed nav and a section it lands. */
const NAV_GAP = 16;

/**
 * How far below the landing line a section's top may sit and still count as
 * the one being read. It must exceed the island's own shrink (it loses 8px of
 * padding once the page scrolls), so a section reached by a click or a hash is
 * always the active one, and stay far smaller than any section's padding, so
 * the next section can never be mistaken for it.
 */
const ACTIVATION_SLACK = 24;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onRegistration = pathname === "/registration";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const barRef = useRef<HTMLDivElement>(null);

  // Publish where the fixed bar really ends as --qff-nav-offset. The html
  // element turns it into scroll-padding-top, so every way of reaching a
  // section (a nav click, a typed or shared /#hash, back/forward, the forms'
  // own scrollIntoView) lands it just below the bar at any breakpoint, rather
  // than at a guessed constant. The open mobile sheet is outside the measured
  // row, so it never inflates the offset.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const publish = () => {
      const offset = Math.ceil(bar.getBoundingClientRect().bottom) + NAV_GAP;
      root.style.setProperty("--qff-nav-offset", `${offset}px`);
    };
    publish();
    const resize = new ResizeObserver(publish);
    resize.observe(bar);
    return () => {
      resize.disconnect();
      root.style.removeProperty("--qff-nav-offset");
    };
  }, []);

  // Scroll state and scroll-spy, from one rAF-throttled pass.
  //
  // The rule: the active section is the last one, in page order, whose top
  // has reached the line just under the bar (the landing line plus a little
  // slack). It is recomputed from the layout every time instead of being
  // pieced together from IntersectionObserver batches, which only report the
  // sections that changed; a tall section that never left the band was never
  // re-reported, so the previous item stayed lit. Every section in <main>
  // takes part, so the hero, FAQs and venue, which have no nav item, clear
  // the highlight instead of leaving the last one stuck on.
  useEffect(() => {
    const bar = barRef.current;
    const sections = isHome
      ? Array.from(document.querySelectorAll<HTMLElement>("main section[id]"))
      : [];
    const navHrefs = new Set(navItems.map((item) => item.href));
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
      if (sections.length === 0 || !bar) return;

      const line = bar.getBoundingClientRect().bottom + NAV_GAP + ACTIVATION_SLACK;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top > line) break;
        current = `#${section.id}`;
      }
      setActiveId(navHrefs.has(current) ? current : "");
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    // Late layout (images, fonts, reveals) moves sections without a scroll.
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      resize.disconnect();
    };
  }, [isHome]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const registerTarget = onRegistration ? "#form-section" : event.registerHref;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-5 sm:pt-5 lg:pt-9 print:hidden">
      {/* Three parts: who runs the fest, where you are in it, what it runs on.
          Below `lg` the middle is only the menu button, so the rail collapses
          to a plain row with the mark at one end and the button at the other. */}
      <div
        ref={barRef}
        className="flex items-start justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr]"
      >
        <QbitsMark className="justify-self-start" />

        <nav
          className={cn(
            "flex w-fit max-w-full items-center gap-2 rounded-full transition-all duration-300",
            "lg:qff-island",
            scrolled ? "lg:p-2" : "lg:p-3",
          )}
          aria-label="Primary"
        >
          <Link
            href={isHome ? "#top" : "/#top"}
            className="group hidden shrink-0 items-center gap-2.5 rounded-full pl-1 pr-2 lg:flex"
          >
            <span className="relative block h-11 w-11 overflow-hidden rounded-full border border-line bg-surface-2 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/image-removebg-preview.png"
                alt=""
                width={44}
                height={44}
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
                      "block whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm transition-colors duration-200",
                      active
                        ? "bg-ink/[0.07] font-semibold text-ink dark:bg-white/10"
                        : "font-medium text-ink-dim hover:bg-ink/[0.04] hover:text-ink dark:hover:bg-white/[0.06]",
                    )}
                  >
                    {/* Bold and regular labels differ in width. A hidden bold
                        copy holds the slot at its widest, so lighting one
                        item never nudges its neighbours along the rail. */}
                    <span className="grid">
                      <span className="col-start-1 row-start-1">{item.label}</span>
                      <span aria-hidden className="invisible col-start-1 row-start-1 font-semibold">
                        {item.label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            {/* A bird comes down to perch on the button when you reach for it. */}
            <Link
              href={registerTarget}
              aria-current={onRegistration ? "page" : undefined}
              className="qff-beacon qff-perch relative hidden items-center whitespace-nowrap rounded-full bg-pink-fill px-6 py-3 text-sm font-bold text-white shadow-[0_6px_20px_-6px_rgba(208,38,112,0.9)] transition-all duration-300 hover:bg-pink-fill-hover hover:shadow-[0_8px_26px_-6px_rgba(208,38,112,1)] lg:inline-flex"
            >
              <span aria-hidden className="qff-perch-roost absolute -top-7 right-2 block w-10 origin-bottom">
                <QffFigure name="bird-soar" flip className="qff-perch-bird w-full" />
              </span>
              Register
            </Link>

            {/* The phone's only nav affordance. It carries the island surface
              itself, since there is no capsule behind it any more. */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="qff-island ml-auto grid h-12 w-12 place-items-center rounded-full text-ink transition-transform duration-300 hover:-translate-y-0.5 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <IbmMark className="hidden justify-self-end lg:inline-flex" />
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "ml-auto grid w-full max-w-sm overflow-hidden transition-[grid-template-rows,margin] duration-300 lg:hidden",
          open ? "mt-2 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="qff-island flex flex-col gap-1 rounded-3xl p-2">
            <li>
              <Link
                href={registerTarget}
                onClick={() => setOpen(false)}
                className="mb-1 block rounded-2xl bg-pink-fill px-4 py-3 text-center text-sm font-bold text-white"
              >
                Register
              </Link>
            </li>
            {navItems.map((item) => {
              const active = isHome && activeId === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={isHome ? item.href : `/${item.href}`}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-sm transition-colors",
                      active
                        ? "bg-ink/[0.07] font-semibold text-ink dark:bg-white/10"
                        : "font-medium text-ink-dim hover:bg-ink/[0.05] hover:text-ink dark:hover:bg-white/[0.07]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 flex justify-center">
            <IbmMark className="inline-flex" />
          </div>
        </div>
      </div>
    </header>
  );
}
