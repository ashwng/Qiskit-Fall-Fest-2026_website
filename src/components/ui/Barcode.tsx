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

// Code 39 character patterns (9 bits: 1 = wide, 0 = narrow. 3 wide out of 9)
const CODE39: Record<string, string> = {
  "0": "000110100",
  "1": "100100001",
  "2": "001100001",
  "3": "101100000",
  "4": "000110001",
  "5": "100110000",
  "6": "001110000",
  "7": "000100101",
  "8": "100100100",
  "9": "001100100",
  "A": "100001001",
  "B": "001001001",
  "C": "101001000",
  "D": "000011001",
  "E": "100011000",
  "F": "001011000",
  "G": "000001101",
  "H": "100001100",
  "I": "001001100",
  "J": "000011100",
  "K": "100000011",
  "L": "001000011",
  "M": "101000010",
  "N": "000010011",
  "O": "100010010",
  "P": "001010010",
  "Q": "000000111",
  "R": "100000110",
  "S": "001000110",
  "T": "000010110",
  "U": "110000001",
  "V": "011000001",
  "W": "111000000",
  "X": "010010001",
  "Y": "110010000",
  "Z": "011010000",
  "-": "010000101",
  ".": "110000100",
  " ": "011000100",
  "$": "010101000",
  "/": "010100010",
  "+": "010001010",
  "%": "000101010",
  "*": "010010100",
};

export function Barcode({
  value,
  className,
  height = 54,
  narrowWidth = 2,
  wideWidth = 5,
  showText = true,
}: BarcodeProps) {
  // Sanitize to Code 39 supported chars, uppercase, and surround with '*' start/stop
  const safeValue = value.toUpperCase().replace(/[^0-9A-Z\-.$/+% ]/g, "");
  const encodedStr = `*${safeValue}*`;

  // Build the list of bars to draw
  const bars: { x: number; width: number }[] = [];
  let currentX = 0;

  for (let cIndex = 0; cIndex < encodedStr.length; cIndex++) {
    const char = encodedStr[cIndex];
    const pattern = CODE39[char] || CODE39["-"];

    for (let i = 0; i < 9; i++) {
      const isBar = i % 2 === 0;
      const isWide = pattern[i] === "1";
      const elemWidth = isWide ? wideWidth : narrowWidth;

      if (isBar) {
        bars.push({ x: currentX, width: elemWidth });
      }

      currentX += elemWidth;
    }

    // Inter-character narrow space gap
    currentX += narrowWidth;
  }

  const totalWidth = currentX;

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
        {bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y={0}
            width={bar.width}
            height={height}
            className="fill-pink-ink transition-colors print:fill-black"
          />
        ))}
      </svg>
      {showText && (
        <span className="mt-2 font-mono text-[11px] tracking-[0.28em] text-pink-ink print:text-black">
          {safeValue}
        </span>
      )}
    </div>
  );
}

