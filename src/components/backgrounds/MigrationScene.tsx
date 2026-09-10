import { QFF_ART, type QffArtName } from "@/components/ui/qff-art";

/**
 * Migration — the 2026 fest's own birds crossing a periwinkle sky.
 *
 * Depth is the organising idea: a bird's size, opacity and crossing time all
 * come from one `depth` value (0 = far, 1 = near), so the flock reads as three
 * dimensional rather than as sprites on a conveyor. Distant birds are small,
 * pale and slow; near ones are large, saturated and quick.
 *
 * The artwork faces left, so lanes run right-to-left by default (the crossing
 * keyframe played in reverse). A lane marked `mirrored` flips the bird and
 * runs forwards instead, which keeps a flock from looking like a parade.
 */

type Lane = {
  art: QffArtName;
  /** 0 = far haze, 1 = close overhead. Drives size, opacity and speed. */
  depth: number;
  /** vertical position, % of viewport height */
  top: number;
  /** seconds; negative so lanes are already mid-flight on first paint */
  delay: number;
  mirrored?: boolean;
  /** seconds for one bob cycle — slower for big birds */
  bob: number;
};

const LANES: Lane[] = [
  { art: "bird-eagle", depth: 0.18, top: 9, delay: -34, bob: 7.5 },
  { art: "bird-glide", depth: 0.42, top: 21, delay: -8, bob: 5.2, mirrored: true },
  { art: "bird-soar", depth: 0.3, top: 34, delay: -52, bob: 6.1 },
  { art: "bird-hummingbirds", depth: 0.22, top: 47, delay: -19, bob: 4.4 },
  { art: "bird-glide", depth: 0.62, top: 58, delay: -71, bob: 4.8 },
  { art: "bird-soar", depth: 0.15, top: 69, delay: -41, bob: 6.8, mirrored: true },
  { art: "bird-eagle", depth: 0.5, top: 78, delay: -26, bob: 5.6 },
  { art: "bird-glide", depth: 0.24, top: 88, delay: -60, bob: 5.9 },
];

const CLOUDS = [
  { art: "cloud-a" as const, top: 6, width: 34, opacity: 0.55, duration: 210, delay: -40 },
  { art: "cloud-b" as const, top: 28, width: 46, opacity: 0.42, duration: 280, delay: -160 },
  { art: "cloud-a" as const, top: 52, width: 28, opacity: 0.5, duration: 240, delay: -90 },
  { art: "cloud-b" as const, top: 74, width: 52, opacity: 0.36, duration: 320, delay: -230 },
  { art: "cloud-a" as const, top: 92, width: 38, opacity: 0.45, duration: 260, delay: -20 },
];

/** Far birds are small and slow, near birds large and quick. */
function sizeFor(depth: number) {
  return 44 + depth * 130;
}
function durationFor(depth: number) {
  return 150 - depth * 95;
}
/* Kept low enough that page text stays the highest-contrast thing on screen —
   the ink is near-black on a pale ground, so the birds can hold real colour
   without competing. There is deliberately no flat scrim over the flock: one
   washes the brand palette out to grey. */
function opacityFor(depth: number) {
  return 0.26 + depth * 0.42;
}

export function MigrationScene() {
  return (
    <div className="qff-scene" aria-hidden>

      {/* Sky: periwinkle at the horizon fading up into the page background,
          with two soft blooms in the fest pink and purple. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--qff-periwinkle)_0%,var(--bg)_58%,var(--qff-periwinkle)_100%)] opacity-90" />
      <div className="absolute -left-[10%] top-[6%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,126,182,0.16),transparent_68%)] blur-2xl" />
      <div className="absolute -right-[14%] top-[46%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(138,63,252,0.14),transparent_70%)] blur-2xl" />

      {CLOUDS.map((cloud, i) => {
        const width = cloud.width;
        return (
          <div
            key={`cloud-${i}`}
            className="qff-lane"
            style={{
              top: `${cloud.top}%`,
              animationDuration: `${cloud.duration}s`,
              animationDelay: `${cloud.delay}s`,
              animationDirection: "reverse",
              ["--qff-rest" as string]: `${30 + i * 12}vw`,
            }}
          >
            <svg
              width={`${width}vw`}
              height={`${width / QFF_ART[cloud.art].aspect}vw`}
              style={{ opacity: cloud.opacity, color: "var(--qff-cloud)" }}
            >
              <use
                href={`#${QFF_ART[cloud.art].id}`}
                width="100%"
                height="100%"
              />
            </svg>
          </div>
        );
      })}

      {LANES.map((lane, i) => {
        const width = sizeFor(lane.depth);
        const height = width / QFF_ART[lane.art].aspect;
        return (
          <div
            key={`bird-${i}`}
            className="qff-lane"
            style={{
              top: `${lane.top}%`,
              animationDuration: `${durationFor(lane.depth)}s`,
              animationDelay: `${lane.delay}s`,
              animationDirection: lane.mirrored ? "normal" : "reverse",
              ["--qff-rest" as string]: `${18 + i * 9}vw`,
            }}
          >
            <div
              className="qff-bob"
              style={{
                animationDuration: `${lane.bob}s`,
                animationDelay: `${lane.delay / 3}s`,
              }}
            >
              {/* viewBox + a CSS width lets the bird scale with the viewport:
                  at full size on desktop, down to ~45% on a phone, where a
                  desktop-sized bird would span half the screen. */}
              <svg
                viewBox={`0 0 ${width} ${height}`}
                style={{
                  width: `clamp(${Math.round(width * 0.45)}px, ${(width / 14).toFixed(2)}vw, ${width}px)`,
                  height: "auto",
                  opacity: opacityFor(lane.depth),
                  transform: lane.mirrored ? "scaleX(-1)" : undefined,
                  filter: lane.depth < 0.3 ? "blur(1.5px)" : undefined,
                }}
              >
                <use
                  href={`#${QFF_ART[lane.art].id}`}
                  width={width}
                  height={height}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
