"use client";

import { useEffect, useRef } from "react";

import { QFF_ART, type QffArtName } from "@/components/ui/qff-art";

/**
 * Official fest birds that fly in from the page margins as you scroll.
 *
 * The flock starts below the hero — the fold is busy enough already. Each bird
 * is pinned to a point down the page and glides inward as that point crosses
 * the viewport, so the further you scroll the further in it gets. Its wings
 * beat on the way, driven by the same scroll progress, which keeps the motion
 * tied to the scroll rather than running on its own clock.
 *
 * They stay in the margins: each bird's travel is capped at its own `inset`
 * (in vw) from the edge, and the layer sits behind the content, so nothing
 * crosses the text column. Below `lg` there are no margins to fly in, so the
 * layer is not rendered at all.
 */

type Bird = {
  art: QffArtName;
  side: "left" | "right";
  /** Vertical position, as a percentage of the container's height. */
  top: number;
  /** Rendered width in px at desktop size. */
  width: number;
  opacity: number;
  /** How far in from the edge it ends up, in vw. */
  inset: number;
};

/*
 * Species alternate down each side and across sides, so the same silhouette
 * never appears twice in a row or directly opposite itself. Vertical spacing
 * is deliberately uneven — an even cadence reads as a pattern rather than as
 * birds — and left/right entries are offset so the two sides never arrive in
 * pairs.
 */
const BIRDS: Bird[] = [
  { art: "bird-glide", side: "left", top: 17, width: 128, opacity: 0.9, inset: 3 },
  { art: "bird-eagle", side: "right", top: 23, width: 150, opacity: 0.8, inset: 2 },
  { art: "bird-hummingbirds", side: "left", top: 31, width: 112, opacity: 0.85, inset: 4 },
  { art: "bird-soar", side: "right", top: 38, width: 138, opacity: 0.9, inset: 3.5 },
  { art: "bird-eagle", side: "left", top: 46, width: 142, opacity: 0.78, inset: 2.5 },
  { art: "bird-glide", side: "right", top: 54, width: 120, opacity: 0.88, inset: 4 },
  { art: "bird-soar", side: "left", top: 62, width: 134, opacity: 0.82, inset: 3 },
  { art: "bird-hummingbirds", side: "right", top: 70, width: 108, opacity: 0.86, inset: 4.5 },
  { art: "bird-glide", side: "left", top: 78, width: 126, opacity: 0.8, inset: 2.5 },
  { art: "bird-eagle", side: "right", top: 86, width: 146, opacity: 0.78, inset: 3 },
  { art: "bird-soar", side: "left", top: 93, width: 118, opacity: 0.85, inset: 4 },
];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ScrollBirds() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const nodes = Array.from(
      layer.querySelectorAll<HTMLElement>("[data-bird]"),
    );
    if (nodes.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    const update = () => {
      frame = undefined;
      // Below lg (1024px) the layer is hidden; avoid forced reflows / getBoundingClientRect
      if (window.innerWidth < 1024) return;
      const viewport = window.innerHeight;

      for (const node of nodes) {
        const side = node.dataset.side as "left" | "right";
        const width = Number(node.dataset.width);
        const inset = Number(node.dataset.inset);
        const rect = node.getBoundingClientRect();

        // 0 as the anchor enters the bottom of the viewport, 1 by the time it
        // has risen to a third of the way up. Reaching 1 early means the bird
        // is settled while it is still comfortably on screen, rather than
        // arriving just as it leaves.
        const raw = (viewport - rect.top) / (viewport * 0.7);
        const progress = easeOutCubic(clamp01(raw));

        const insetPx = (inset / 100) * window.innerWidth;
        const offscreen = width + 48;
        const travel = offscreen - progress * (offscreen + insetPx);
        const x = side === "left" ? -travel : travel;

        // Wings beat as it comes, and settle once it has arrived.
        const beat = reduceMotion.matches
          ? 0
          : Math.sin(progress * Math.PI * 7) * (1 - progress) * 0.16;
        const bank = reduceMotion.matches ? 0 : beat * 26;

        node.style.transform = `translate3d(${x}px, 0, 0) rotate(${
          side === "left" ? bank : -bank
        }deg) scaleY(${1 - Math.abs(beat)})`;
        node.style.opacity = String(progress);
      }
    };

    const schedule = () => {
      if (window.innerWidth < 1024) return;
      frame ??= window.requestAnimationFrame(update);
    };

    if (window.innerWidth >= 1024) {
      update();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
    >
      {BIRDS.map((bird, i) => {
        const height = bird.width / QFF_ART[bird.art].aspect;
        return (
          <div
            key={i}
            data-bird
            data-side={bird.side}
            data-width={bird.width}
            data-inset={bird.inset}
            className="absolute will-change-transform"
            style={{
              top: `${bird.top}%`,
              [bird.side]: 0,
              width: bird.width,
              height,
              opacity: 0,
            }}
          >
            {/* The mirror lives on the svg, not the animated wrapper: the CSS
                `scale` property composes with `transform`, so a flip on the
                wrapper would also negate the translate and send the bird out
                of the opposite side. */}
            <svg
              viewBox={`0 0 ${bird.width} ${height}`}
              width={bird.width}
              height={height}
              style={{
                opacity: bird.opacity,
                // The artwork faces left, so only birds entering from the left
                // — and therefore travelling rightward — get mirrored.
                transform: bird.side === "left" ? "scaleX(-1)" : undefined,
              }}
            >
              <use
                href={`#${QFF_ART[bird.art].id}`}
                width={bird.width}
                height={height}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
