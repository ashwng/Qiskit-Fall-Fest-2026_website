import { navItems } from "@/data/nav";
import { socials } from "@/data/socials";
import { event } from "@/data/event";
import { SocialIcon, platformLabel } from "@/components/ui/SocialIcon";

export function Footer() {
  return (
    <footer className="relative border-t border-line-soft bg-surface/30 px-6 py-14 sm:px-10 lg:px-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(138,63,252,0.05),transparent_70%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:justify-between z-10">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-bold text-ink">
            {event.fullName}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gradient font-bold">
            {event.shortName}
          </p>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted">
            To be announced.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-mono text-[11px] uppercase tracking-widest text-ink-dim transition-all duration-300 hover:text-cyan hover:drop-shadow-[0_0_8px_rgba(8,189,186,0.5)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Follow along
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.platform}>
                <a
                  href={s.href}
                  aria-label={platformLabel[s.platform]}
                  className="grid h-10 w-10 place-items-center rounded-md border border-line bg-surface-2 text-ink-dim transition-all duration-300 hover:border-violet-bright hover:text-cyan hover:shadow-[0_0_15px_rgba(138,63,252,0.3)] hover:-translate-y-0.5"
                >
                  <SocialIcon platform={s.platform} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-line-soft pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between z-10">
        <p className="font-body">&copy; 2026 {event.fullName}. All rights reserved.</p>
        <p className="font-mono text-[10px] tracking-widest text-ink-dim">
          Built for BITS Pilani &middot; Powered by Qiskit
        </p>
      </div>
    </footer>
  );
}
