/**
 * Lattice — the dot-grid motif from the fest's sticker set, read as a qubit
 * register with a probability wave sweeping across it.
 *
 * Every node runs the same swell keyframe; the wave is produced entirely by
 * `animation-delay` derived from the node's position, so a diagonal front
 * moves across the grid with no JS and no per-frame work. Cell colour is fixed
 * (a deterministic 7/3/1 mix of violet, pink and blue) and the animation only
 * touches transform and opacity.
 */

const COLS = 22;
const ROWS = 13;
const CYCLE = 7; // seconds; matches the qff-swell keyframe

const INK = [
  "var(--qiskit-violet)",
  "var(--qff-pink)",
  "var(--qff-blue)",
] as const;

/** Deterministic colour pick — no Math.random, so SSR and client agree. */
function inkFor(col: number, row: number) {
  const h = (col * 7 + row * 13) % 11;
  if (h === 0) return INK[2];
  if (h < 4) return INK[1];
  return INK[0];
}

const NODES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  // Diagonal wavefront, wrapped into one cycle so delays stay small.
  const phase = (col * 0.16 + row * 0.22) % CYCLE;
  return {
    x: ((col + 0.5) / COLS) * 100,
    y: ((row + 0.5) / ROWS) * 100,
    delay: -phase,
    fill: inkFor(col, row),
    // A quiet size variation keeps the grid from looking machine-stamped.
    r: 2 + ((col * 3 + row * 5) % 4) * 0.45,
  };
});

export function LatticeScene() {
  return (
    <div className="qff-scene" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--qff-periwinkle)_0%,var(--bg)_45%,var(--bg)_100%)] opacity-80" />
      <div className="absolute left-[8%] top-[10%] h-72 w-72 sm:h-[36rem] sm:w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,126,182,0.15),transparent_70%)] blur-2xl sm:blur-3xl" />
      <div className="absolute right-[4%] bottom-[6%] h-80 w-80 sm:h-[40rem] sm:w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(138,63,252,0.13),transparent_70%)] blur-2xl sm:blur-3xl" />

      <svg
        className="qff-lattice absolute inset-0 h-full w-full opacity-45"
        role="presentation"
      >
        {NODES.map((node, i) => (
          <circle
            key={i}
            className="qff-node"
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.r}
            fill={node.fill}
            style={{ animationDelay: `${node.delay}s` }}
          />
        ))}
      </svg>

    </div>
  );
}
