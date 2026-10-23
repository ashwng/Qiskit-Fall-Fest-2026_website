import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import { buildCode39 } from "@/lib/barcode";
import { event } from "@/data/event";
import type { AttendeePassData } from "@/types";

let fontBytes: Promise<Buffer[]> | undefined;

function loadFonts() {
  // Traced explicitly in next.config.ts so serverless builds include the fonts.
  fontBytes ??= Promise.all([400, 600].map((weight) => readFile(path.join(
    process.cwd(), "node_modules/@fontsource/ibm-plex-sans/files",
    `ibm-plex-sans-latin-${weight}-normal.woff`,
  ))));
  return fontBytes;
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.replace(/\s+/g, " ").trim().split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const character of word) {
      if (line && font.widthOfTextAtSize(line + character, size) > width) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** In-memory, vector PDF: no browser process or temporary attendee files. */
export async function createPassPdf(pass: AttendeePassData): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const [regularBytes, boldBytes] = await loadFonts();
  const regular = await pdf.embedFont(regularBytes, { subset: true });
  const bold = await pdf.embedFont(boldBytes, { subset: true });
  const page = pdf.addPage([595.28, 841.89]);
  pdf.setTitle(`${event.shortName} attendee pass - ${pass.ticketId}`);
  pdf.setAuthor(event.shortName);

  const ink = rgb(0.14, 0.07, 0.2);
  const muted = rgb(0.38, 0.33, 0.43);
  const violet = rgb(0.54, 0.25, 0.99);
  const lineColor = rgb(0.85, 0.82, 0.89);
  const left = 54;
  const width = 487;
  const dates = event.dates.replace(/[\u2010-\u2015]/g, "-");
  const nameSize = [22, 18, 16, 14, 12].find((size) => wrap(pass.fullName, bold, size, width).length <= 3) ?? 12;
  const institutionSize = [12, 11, 10].find((size) => wrap(pass.institution, regular, size, width).length <= 4) ?? 10;
  let y = 776;

  const text = (value: string, x: number, top: number, size = 12, font = regular, maxWidth = width) => {
    const lines = wrap(value, font, size, maxWidth);
    lines.forEach((line, index) => page.drawText(line, { x, y: top - index * size * 1.4, size, font, color: ink }));
    return top - lines.length * size * 1.4;
  };
  const label = (value: string, x: number, top: number) => {
    page.drawText(value.toUpperCase(), { x, y: top, size: 8, font: bold, color: muted });
  };
  const rule = (top: number) => page.drawLine({ start: { x: left, y: top }, end: { x: left + width, y: top }, thickness: 0.7, color: lineColor });

  page.drawRectangle({ x: 32, y: 44, width: 531, height: 754, color: rgb(1, 1, 1), borderColor: lineColor, borderWidth: 1 });
  page.drawRectangle({ x: 32, y: 795, width: 531, height: 4, color: violet });
  label("QFF 2026 / Attendee pass", left, y);
  label("Confirmed", 480, y);
  y = text(event.fullName, left, y - 32, 24, bold) - 12;
  rule(y);
  y -= 24;
  label("Event dates", left, y);
  label("Venue", 306, y);
  y = Math.min(
    text(dates, left, y - 19, 11, regular, 225),
    text(event.venueName, 306, y - 19, 11, regular, 235),
  ) - 12;
  rule(y);
  y -= 25;
  label("Attendee name", left, y);
  y = text(pass.fullName, left, y - 25, nameSize, bold) - 16;
  label("Institution / University", left, y);
  y = text(pass.institution, left, y - 20, institutionSize) - 16;
  label("Attendance", left, y);
  y = text(pass.attendanceMode === "offline" ? "In person" : "Online", left, y - 19, 12) - 20;

  rule(y);
  y -= 24;
  y = text("Campus entry requirements", left, y, 12, bold) - 10;
  y = text(`1. Your QFF code ${pass.ticketId} permits campus entry for all 5 days (${dates}). Entry will be checked at the gate every time throughout this period.`, left, y, 11) - 10;
  text("2. Carry both a government-issued ID card and an institute-issued ID card for campus entry.", left, y, 11, bold);

  rule(202);
  label("Your QFF entry code", 251, 182);
  const barcode = buildCode39(pass.ticketId);
  const barcodeWidth = 350;
  const barcodeX = (595.28 - barcodeWidth) / 2;
  const scale = barcodeWidth / barcode.totalWidth;
  page.drawRectangle({ x: barcodeX, y: 104, width: barcodeWidth, height: 56, color: rgb(1, 1, 1) });
  for (const bar of barcode.bars) {
    page.drawRectangle({ x: barcodeX + bar.x * scale, y: 104, width: bar.width * scale, height: 56, color: rgb(0, 0, 0) });
  }
  const ticketWidth = bold.widthOfTextAtSize(pass.ticketId, 12);
  text(pass.ticketId, (595.28 - ticketWidth) / 2, 83, 12, bold);
  const hint = "Keep this pass ready for entry verification.";
  text(hint, (595.28 - regular.widthOfTextAtSize(hint, 9)) / 2, 62, 9);

  return Buffer.from(await pdf.save());
}
