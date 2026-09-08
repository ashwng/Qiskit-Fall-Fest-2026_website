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
/*
 * Hues are drawn from the fest palette rather than the full colour wheel. The
 * seed used to pick any hue in 0–360, which produced browns and olives that
 * appear nowhere else on the site; now it only chooses *which* brand hue, so
 * the cards stay varied without leaving the palette.
 */
const HUES = [
  322, // pink
  268, // violet
  292, // purple
  222, // blue
];

export function PlaceholderAvatar({ seed, className }: PlaceholderAvatarProps) {
  const hash = hashSeed(seed);
  const hue = HUES[hash % HUES.length];
  const hue2 = HUES[(hash + 1 + (hash % 2)) % HUES.length];

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-line", className)}
      style={{
        background: `linear-gradient(155deg, hsl(${hue} 42% 20%), hsl(${hue2} 48% 13%))`,
      }}
      role="img"
      aria-label="Placeholder headshot"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full opacity-70">
        <circle cx="50" cy="38" r="16" fill={`hsl(${hue} 70% 62% / 0.35)`} />
        <circle cx="50" cy="98" r="34" fill={`hsl(${hue2} 70% 62% / 0.3)`} />
        <circle cx="50" cy="38" r="16" stroke={`hsl(${hue} 80% 72% / 0.6)`} strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
