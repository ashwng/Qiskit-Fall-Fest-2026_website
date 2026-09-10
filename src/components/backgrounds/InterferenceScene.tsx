/**
 * Interference — the waveform tile from the fest sticker set (the one with the
 * pink and blue nodes riding a standing wave), pulled apart into layers.
 *
 * Each wave path is drawn two full tiles wide inside a viewBox that is also
 * two tiles wide, then translated by exactly -50%. Because the sine is
 * periodic over one tile, the wrap is seamless — no snap, no JS.
 *
 * Layers differ in wavelength, amplitude and speed, so they slide through each
 * other and the crossings drift, which is what makes it read as interference
 * rather than as parallel decoration.
 */

const TILE = 100; // viewBox units per period-set; the path spans two of these
const VIEW_H = 100;

type Wave = {
  /** periods per tile — higher is a tighter wave */
  periods: number;
  amplitude: number;
  /** vertical centre, in viewBox units */
  mid: number;
  stroke: string;
  width: number;
  opacity: number;
  /** seconds for one tile to pass */
  duration: number;
  reverse?: boolean;
};

/* Widths are in px, not viewBox units — `non-scaling-stroke` below means the
   stretch of the viewBox never thins them out. */
const WAVES: Wave[] = [
  { periods: 1, amplitude: 26, mid: 30, stroke: "var(--qiskit-violet)", width: 2, opacity: 0.5, duration: 34 },
  { periods: 2, amplitude: 16, mid: 44, stroke: "var(--qff-pink)", width: 2.5, opacity: 0.65, duration: 22, reverse: true },
  { periods: 1.5, amplitude: 22, mid: 56, stroke: "var(--qff-blue)", width: 1.5, opacity: 0.42, duration: 46 },
  { periods: 3, amplitude: 11, mid: 66, stroke: "var(--qff-pink-deep)", width: 1.4, opacity: 0.4, duration: 18 },
  { periods: 0.75, amplitude: 30, mid: 72, stroke: "var(--qiskit-violet-bright)", width: 1.8, opacity: 0.38, duration: 58, reverse: true },
];

/** Sine sampled into a polyline path, two tiles wide so it can wrap at -50%. */
function sinePath(periods: number, amplitude: number, mid: number) {
  const steps = Math.max(48, Math.round(periods * 64)) * 2;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * TILE * 2;
    const y = mid + amplitude * Math.sin((x / TILE) * periods * Math.PI * 2);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

/** Nodes that sit on the crest and trough of the mid wave, as on the sticker. */
const NODES = [
  { x: 22, y: 28, r: 1.8, fill: "var(--qff-pink)", delay: 0 },
  { x: 50, y: 60, r: 1.4, fill: "var(--qff-blue)", delay: -1.3 },
  { x: 74, y: 34, r: 1.6, fill: "var(--qff-pink-deep)", delay: -2.6 },
  { x: 88, y: 66, r: 1.2, fill: "var(--qiskit-violet)", delay: -0.7 },
  { x: 9, y: 58, r: 1.3, fill: "var(--qff-pink)", delay: -3.1 },
];

export function InterferenceScene() {
  return (
    <div className="qff-scene" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(200deg,var(--bg)_0%,var(--qff-periwinkle)_50%,var(--bg)_100%)] opacity-75" />
      <div className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,126,182,0.14),transparent_65%)] blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${TILE} ${VIEW_H}`}
        preserveAspectRatio="none"
        role="presentation"
      >
        {WAVES.map((wave, i) => (
          <g
            key={i}
            className="qff-wave"
            style={{
              animationDuration: `${wave.duration}s`,
              animationDirection: wave.reverse ? "reverse" : "normal",
              animationDelay: `${-wave.duration / (i + 2)}s`,
            }}
          >
            <path
              d={sinePath(wave.periods, wave.amplitude, wave.mid)}
              fill="none"
              stroke={wave.stroke}
              strokeWidth={wave.width}
              strokeLinecap="round"
              opacity={wave.opacity}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      {/* Nodes live in their own un-stretched svg so they stay circular. */}
      <svg className="absolute inset-0 h-full w-full" role="presentation">
        {NODES.map((node, i) => (
          <circle
            key={i}
            className="qff-orbit-node"
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.r * 3}
            fill={node.fill}
            opacity={0.75}
            style={{ animationDelay: `${node.delay}s` }}
          />
        ))}
      </svg>

    </div>
  );
}
