import { navItems } from "@/data/nav";
import { socials } from "@/data/socials";
import { event } from "@/data/event";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";

export function Footer() {
  return (
    <footer className="border-t border-line-soft px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold text-ink">{event.fullName}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-cyan">{event.shortName}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-mono text-xs uppercase tracking-wide text-ink-dim transition-colors hover:text-cyan"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Follow along</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.href}
                  aria-label={platformLabel[s.platform]}
                  className="grid h-10 w-10 place-items-center rounded-md border border-line text-ink-dim transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  <SocialIcon platform={s.platform} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-line-soft pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; 2026 {event.fullName}. All rights reserved.</p>
        <p className="font-mono">Built for BITS Pilani &middot; Powered by Qiskit</p>
      </div>
    </footer>
  );
}
