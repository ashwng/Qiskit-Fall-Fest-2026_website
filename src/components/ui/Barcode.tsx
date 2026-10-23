import React from "react";
import { cn } from "@/lib/utils";
import { buildCode39 } from "@/lib/barcode";

interface BarcodeProps {
  value: string;
  className?: string;
  height?: number;
  narrowWidth?: number;
  wideWidth?: number;
  showText?: boolean;
}

export function Barcode({
  value,
  className,
  height = 54,
  narrowWidth = 2,
  wideWidth = 5,
  showText = true,
}: BarcodeProps) {
  const { safeValue, bars, totalWidth } = buildCode39(value, narrowWidth, wideWidth);

  return (
    <div className={cn("inline-flex flex-col items-center bg-white p-3 text-black", className)}>
      <svg
        data-barcode
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="block w-full max-w-full"
        style={{ height }}
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        aria-label={`Barcode for ${safeValue}`}
        role="img"
      >
        <rect data-barcode-background width={totalWidth} height={height} fill="#ffffff" />
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.width}
            height={height}
            fill="#000000"
          />
        ))}
      </svg>
      {showText && (
        <span className="mt-2 font-mono text-[11px] tracking-[0.28em] text-black">
          {safeValue}
        </span>
      )}
    </div>
  );
}

