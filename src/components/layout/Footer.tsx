import { navItems } from "@/data/nav";
import { socials } from "@/data/socials";
import { event } from "@/data/event";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";
import { QffFigure } from "@/components/ui/QffFigure";
import { isPending } from "@/components/ui/Pending";

export function Footer() {
  const links = socials.filter((s) => s.href !== "#" && !isPending(s.handle));

  return (
    <footer className="relative overflow-hidden border-t border-line-soft bg-surface/40 px-5 pb-10 pt-16 sm:px-10 sm:pt-20 lg:px-16">
      {/* The flock leaves the way it arrived. */}
      <QffFigure
        name="bird-soar"
        className="pointer-events-none absolute -right-6 top-8 w-32 opacity-[0.22] sm:right-[6%] sm:w-44"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-bold leading-tight text-ink">
            {event.fullName}
          </p>
          <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-pink-ink">
            {event.shortName}
          </p>
          <p className="mt-5 leading-relaxed text-muted">{event.tagline}</p>
          <p className="mt-5 font-mono text-xs tracking-wide text-ink-dim">
            {event.dates} · {event.venueShort}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors duration-300 hover:text-pink-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Follow along
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {links.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platformLabel[s.platform]}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface-2 text-ink-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-pink/60 hover:text-pink-ink"
                >
                  <SocialIcon platform={s.platform} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-line-soft pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 {event.fullName}. All rights reserved.</p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-ink-dim">
          Built for BITS Pilani &middot; Powered by Qiskit
        </p>
      </div>
    </footer>
  );
}
