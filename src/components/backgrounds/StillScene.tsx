/**
 * Still — the same palette and composition as the animated scenes, with
 * nothing moving. Useful as a baseline when judging the others, and as the
 * option to ship if the team decides motion is a distraction.
 */
export function StillScene() {
  return (
    <div className="qff-scene" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(170deg,var(--qff-periwinkle)_0%,var(--bg)_48%,var(--bg)_100%)] opacity-80" />
      <div className="absolute -left-[8%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(circle,rgba(255,126,182,0.16),transparent_68%)] blur-3xl" />
      <div className="absolute -right-[10%] top-[44%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(138,63,252,0.14),transparent_70%)] blur-3xl" />
      <div className="circuit-field absolute inset-0 opacity-60" />
    </div>
  );
}
