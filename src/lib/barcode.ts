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

export function encodeCode39(value: string, narrowWidth = 2, wideWidth = 5) {
  // Sanitize to Code 39 supported chars, uppercase, and surround with '*' start/stop
  const safeValue = value.toUpperCase().replace(/[^0-9A-Z\-.$/+% ]/g, "");
  const encodedStr = `*${safeValue}*`;

  // Code 39 readers need clear, blank space around the start and stop symbols.
  // Keep a 10-module quiet zone on each side inside the SVG itself so it is
  // preserved in screenshots and printed passes.
  const quietZone = narrowWidth * 10;

  // Build the list of bars to draw
  const bars: { x: number; width: number }[] = [];
  let currentX = quietZone;

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

  const totalWidth = currentX + quietZone;

  return { bars, totalWidth, safeValue };
}
