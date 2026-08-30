/**
 * Signature hero visual: a wireframe Bloch sphere with a precessing state
 * vector. Grounded directly in the subject matter (every Qiskit tutorial
 * opens with this exact diagram) rather than a generic abstract blob.
 * Pure SVG + CSS animation — no 3D/canvas library, keeping JS minimal.
 */
export function QubitSphere({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="sphereGlow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#8a3ffc" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#8a3ffc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vectorGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4fd1e8" />
            <stop offset="100%" stopColor="#f2b84b" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="170" fill="url(#sphereGlow)" />

        {/* Outer sphere */}
        <circle cx="200" cy="200" r="150" stroke="#232b46" strokeWidth="1.25" fill="none" />

        {/* Equator + tilted latitude ellipses */}
        <ellipse cx="200" cy="200" rx="150" ry="38" stroke="#2c3557" strokeWidth="1" fill="none" />
        <g className="animate-orbit" style={{ transformOrigin: "200px 200px" }}>
          <ellipse cx="200" cy="200" rx="38" ry="150" stroke="#2c3557" strokeWidth="1" fill="none" />
        </g>
        <ellipse
          cx="200"
          cy="200"
          rx="150"
          ry="90"
          stroke="#1c2340"
          strokeWidth="1"
          fill="none"
          transform="rotate(20 200 200)"
        />

        {/* Poles */}
        <line x1="200" y1="50" x2="200" y2="350" stroke="#232b46" strokeWidth="1" />
        <circle cx="200" cy="50" r="3" fill="#8791ac" />
        <circle cx="200" cy="350" r="3" fill="#8791ac" />
        <text x="212" y="46" fill="#8791ac" fontSize="13" fontFamily="var(--font-mono)">|0⟩</text>
        <text x="212" y="360" fill="#8791ac" fontSize="13" fontFamily="var(--font-mono)">|1⟩</text>

        {/* Precessing state vector group */}
        <g className="animate-orbit" style={{ transformOrigin: "200px 200px", animationDuration: "14s" }}>
          <line x1="200" y1="200" x2="330" y2="120" stroke="url(#vectorGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="330" cy="120" r="6" fill="#4fd1e8" className="animate-pulse-slow" />
        </g>

        <circle cx="200" cy="200" r="4" fill="#edeff7" />
      </svg>
    </div>
  );
}
