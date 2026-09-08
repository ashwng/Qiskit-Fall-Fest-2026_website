/**
 * Bloch — the sphere from the fest badge pictogram, drawn large and slow.
 *
 * A great circle is faked the honest way: an ellipse whose vertical radius is
 * animated between nearly flat and full (`qff-squash`) inside a group that
 * rotates (`qff-spin`). Because the two run at different, non-harmonic
 * periods, the rings never resynchronise into an obvious loop.
 *
 * Three spheres sit at different scales and opacities; the largest is mostly
 * off-canvas, which keeps the composition from turning into three medallions
 * in a row.
 */

type Sphere = {
  /** centre, % of viewport */
  x: number;
  y: number;
  /** radius in rem */
  r: number;
  opacity: number;
  spin: number;
  /** ring squash periods — deliberately not multiples of each other */
  rings: number[];
  /** seconds for the state-vector marker to complete one orbit */
  marker: number;
};

const SPHERES: Sphere[] = [
  { x: 18, y: 26, r: 17, opacity: 0.5, spin: 90, rings: [11, 17, 23], marker: 26 },
  { x: 82, y: 68, r: 24, opacity: 0.36, spin: 140, rings: [13, 19, 29], marker: 38 },
  { x: 56, y: 8, r: 9, opacity: 0.6, spin: 64, rings: [7, 12], marker: 19 },
];

function Sphere({ sphere, index }: { sphere: Sphere; index: number }) {
  const size = `${sphere.r * 2}rem`;
  return (
    <div
      className="absolute"
      style={{
        left: `${sphere.x}%`,
        top: `${sphere.y}%`,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        opacity: sphere.opacity,
      }}
    >
      <svg viewBox="-50 -50 100 100" className="h-full w-full" role="presentation">
        {/* equator + meridian, the fixed frame */}
        <circle
          r={44}
          fill="none"
          stroke="var(--qiskit-violet)"
          strokeWidth={0.6}
          opacity={0.45}
        />
        <circle
          r={44}
          fill="var(--qff-pink)"
          opacity={0.05}
        />

        {sphere.rings.map((period, i) => (
          <g
            key={i}
            className="qff-spin"
            style={{
              animationDuration: `${sphere.spin + i * 24}s`,
              animationDirection: i % 2 ? "reverse" : "normal",
            }}
          >
            <ellipse
              className="qff-squash"
              rx={44}
              ry={44}
              fill="none"
              stroke={
                i === 1 ? "var(--qff-pink)" : "var(--qiskit-violet-bright)"
              }
              strokeWidth={0.55}
              opacity={0.6}
              style={{
                animationDuration: `${period}s`,
                animationDelay: `${-period / (i + 2)}s`,
              }}
            />
          </g>
        ))}

        {/* state vector: a marker swept around the equator, with its tail */}
        <g
          className="qff-spin"
          style={{ animationDuration: `${sphere.marker}s` }}
        >
          <line
            x1={0}
            y1={0}
            x2={44}
            y2={0}
            stroke="var(--qff-pink-deep)"
            strokeWidth={0.7}
            opacity={0.55}
          />
          <circle
            cx={44}
            cy={0}
            r={3}
            fill="var(--qff-pink)"
          />
        </g>

        <circle r={2} fill="var(--qff-pink-deep)" opacity={0.8} />

        {/* a second marker on a slower, counter-rotating path */}
        <g
          className="qff-spin"
          style={{
            animationDuration: `${sphere.marker * 1.7}s`,
            animationDirection: "reverse",
          }}
        >
          <circle
            cx={0}
            cy={44}
            r={2.2}
            fill="var(--qff-blue)"
            opacity={0.7}
          />
        </g>
      </svg>
      <span className="sr-only">{`sphere ${index + 1}`}</span>
    </div>
  );
}

export function BlochScene() {
  return (
    <div className="qff-scene" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(150deg,var(--qff-periwinkle)_0%,var(--bg)_40%,var(--bg)_70%,var(--qff-periwinkle)_100%)] opacity-70" />
      <div
        className="qff-breathe absolute left-[12%] top-[18%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(255,126,182,0.18),transparent_68%)] blur-3xl"
        style={{ animationDuration: "14s" }}
      />
      <div
        className="qff-breathe absolute right-[6%] bottom-[10%] h-[46rem] w-[46rem] rounded-full bg-[radial-gradient(circle,rgba(138,63,252,0.15),transparent_70%)] blur-3xl"
        style={{ animationDuration: "19s", animationDelay: "-6s" }}
      />

      {SPHERES.map((sphere, i) => (
        <Sphere key={i} sphere={sphere} index={i} />
      ))}

    </div>
  );
}
