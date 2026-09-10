import { QFF_ART, type QffArtName } from "@/components/ui/qff-art";
import { cn } from "@/lib/utils";

interface QffFigureProps {
  name: QffArtName;
  className?: string;
  /** Mirror horizontally. The source artwork all faces left. */
  flip?: boolean;
  style?: React.CSSProperties;
}

/**
 * One piece of official fest artwork, placed in the page rather than in a
 * background scene.
 *
 * The symbols themselves are defined once per document by <QffArtDefs /> in
 * the root layout, so this only ever emits a <use>. Sizing is left to CSS:
 * the viewBox carries the figure's real aspect ratio, so setting a width is
 * enough and nothing letterboxes.
 */
export function QffFigure({ name, className, flip, style }: QffFigureProps) {
  const { id, aspect } = QFF_ART[name];
  const w = 100;
  const h = 100 / aspect;

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-auto", className)}
      style={{ ...style, transform: flip ? "scaleX(-1)" : style?.transform }}
    >
      <use href={`#${id}`} width={w} height={h} />
    </svg>
  );
}
