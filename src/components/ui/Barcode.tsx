import { encodeCode39 } from "@/lib/barcode";
import React from "react";
import { cn } from "@/lib/utils";

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
  const { bars, totalWidth, safeValue } = encodeCode39(value, narrowWidth, wideWidth);

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full max-w-full overflow-visible"
        style={{ height }}
        preserveAspectRatio="none"
        aria-label={`Barcode for ${value}`}
        role="img"
      >
        <rect width={totalWidth} height={height} fill="white" />
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.width}
            height={height}
            fill="black"
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

