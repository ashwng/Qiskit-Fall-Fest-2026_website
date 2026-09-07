import { cn } from "@/lib/utils";

/** Tiny deterministic string hash — good enough to pick a stable hue per seed. */
function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface PlaceholderAvatarProps {
  seed: string;
  className?: string;
}

/**
 * Renders a generative circuit-node placeholder in place of a photo.
 * Purely CSS/SVG — no network request — so it's safe to ship before real
 * headshots exist. Once photos are available, swap this for next/image
 * without touching the surrounding card markup.
 */
export function PlaceholderAvatar({ seed, className }: PlaceholderAvatarProps) {
  const hue = hashSeed(seed) % 360;
  const hue2 = (hue + 40) % 360;

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-line", className)}
      style={{
        background: `linear-gradient(155deg, hsl(${hue} 45% 14%), hsl(${hue2} 55% 10%))`,
      }}
      role="img"
      aria-label="Placeholder headshot"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-70">
        <circle cx="50" cy="38" r="16" fill={`hsl(${hue} 60% 55% / 0.35)`} />
        <circle cx="50" cy="98" r="34" fill={`hsl(${hue2} 60% 55% / 0.3)`} />
        <circle cx="50" cy="38" r="16" stroke={`hsl(${hue} 70% 65% / 0.6)`} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
