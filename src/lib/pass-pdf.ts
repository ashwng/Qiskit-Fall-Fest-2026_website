import { encodeCode39 } from "./barcode.ts";
import { event } from "../data/event.ts";
import { LIMITS } from "./validation.ts";

export interface PassDetails {
  ticketId: string;
  fullName: string;
  institution: string;
  attendanceMode: "offline" | "online";
  tshirtSize: string;
  referralCode: string;
}

const PAGE_WIDTH = 419.53;
const PAGE_HEIGHT = 595.28;
const SCALE = 3; // 216 dpi artwork; the barcode stays vector sharp at any scale.

/** TypeScript types disappear at runtime; reject malformed/oversized inputs
 * before measuring text, encoding bars or allocating the artwork canvas. */
function validatePassDetails(details: PassDetails) {
  if (!details || typeof details !== "object") throw new Error("Invalid pass details.");
  for (const [field, limit] of [
    ["fullName", LIMITS.fullName], ["institution", LIMITS.institution],
    ["tshirtSize", LIMITS.tshirtSize], ["referralCode", LIMITS.referralCode],
  ] as const) {
    const value = details[field];
    if (typeof value !== "string" || value.length > limit || (field !== "referralCode" && !value.trim())) {
      throw new Error(`Invalid pass field: ${field}.`);
    }
  }
  if (typeof details.ticketId !== "string" || !/^QFF-[A-F0-9]{6}$/.test(details.ticketId)) {
    throw new Error("Invalid ticket ID.");
  }
  if (details.attendanceMode !== "offline" && details.attendanceMode !== "online") {
    throw new Error("Invalid attendance mode.");
  }
  if (details.referralCode && !/^[A-Z0-9]{6,20}$/.test(details.referralCode)) {
    throw new Error("Invalid referral code.");
  }
}

/** Build a single-page PDF locally, with no external service or new dependencies. */
export function createPassPdf(details: PassDetails, createCanvas = () => document.createElement("canvas")): Uint8Array {
  validatePassDetails(details);
  const canvas = createCanvas();
  canvas.width = Math.round(PAGE_WIDTH * SCALE);
  canvas.height = Math.round(PAGE_HEIGHT * SCALE);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable.");
  ctx.scale(SCALE, SCALE);
  const ink = "#1c1033";
  const muted = "#62596e";
  const pink = "#d02670";
  const x = 42;
  const contentWidth = PAGE_WIDTH - x * 2;
  const sans = '"IBM Plex Sans", Arial, sans-serif';
  const display = '"Bricolage Grotesque", "IBM Plex Sans", Arial, sans-serif';
  const mono = '"IBM Plex Mono", monospace';
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  ctx.textBaseline = "top";

  function text(value: string, left: number, top: number, size = 10, weight = 400, color = ink, family = sans) {
    ctx!.font = `${weight} ${size}px ${family}`;
    ctx!.fillStyle = color;
    ctx!.fillText(value, left, top);
  }
  function label(value: string, top: number, left = x) { text(value, left, top, 8, 400, muted, mono); }
  function rule(top: number) {
    ctx!.strokeStyle = "#dcd6e4";
    ctx!.lineWidth = 0.6;
    ctx!.beginPath(); ctx!.moveTo(x, top); ctx!.lineTo(PAGE_WIDTH - x, top); ctx!.stroke();
  }
  function fitted(value: string, top: number, initialSize: number, minimumSize: number, weight: number) {
    let size = initialSize;
    ctx!.font = `${weight} ${size}px ${sans}`;
    while (size > minimumSize && ctx!.measureText(value).width > contentWidth) {
      size -= 0.5;
      ctx!.font = `${weight} ${size}px ${sans}`;
    }
    const lines: string[] = [];
    let current = "";
    for (const character of value) {
      if (current && ctx!.measureText(current + character).width > contentWidth) {
        const space = current.lastIndexOf(" ");
        if (space > 0) { lines.push(current.slice(0, space)); current = current.slice(space + 1) + character; }
        else { lines.push(current); current = character; }
      } else current += character;
    }
    if (current) lines.push(current);
    lines.forEach((value, index) => text(value, x, top + index * (size + 3), size, weight));
    return top + lines.length * (size + 3);
  }

  ctx.strokeStyle = "#dcd6e4";
  ctx.lineWidth = 0.7;
  ctx.strokeRect(20, 20, PAGE_WIDTH - 40, PAGE_HEIGHT - 40);
  ctx.fillStyle = pink;
  ctx.fillRect(20, 20, PAGE_WIDTH - 40, 6);
  text("qBITS / BITS GOA", x, 43, 9, 400, pink, mono);
  text("ATTENDEE PASS", x, 74, 29, 800, ink, display);
  text(event.fullName, x, 115, 13, 600);
  text(event.dates, x, 139, 10, 400, muted);
  text(event.venueShort, x, 156, 10, 400, muted);
  rule(183);
  label("ATTENDEE", 201);
  let top = fitted(details.fullName.trim(), 218, 23, 11, 600) + 10;
  label("INSTITUTION / UNIVERSITY", top);
  top = fitted(details.institution.trim(), top + 15, 11, 8, 400) + 12;
  label("ATTENDANCE", top);
  label("T-SHIRT", top, x + 225);
  text(details.attendanceMode === "offline" ? "In person / BITS Goa" : "Virtual / Remote access", x, top + 17, 11, 600);
  text(details.tshirtSize.split(" ")[0], x + 225, top + 17, 11, 600);
  top += 43;
  if (details.referralCode) {
    label("REFERRAL CODE", top);
    text(details.referralCode, x, top + 17, 10, 400, pink, mono);
    top += 35;
  }
  const barcodeTop = Math.max(444, top + 12);
  if (barcodeTop > 474) throw new Error("Details exceed the pass layout. Use browser print instead.");
  rule(barcodeTop - 16);
  ctx.font = `400 10px ${mono}`;
  text(details.ticketId, (PAGE_WIDTH - ctx.measureText(details.ticketId).width) / 2, barcodeTop + 54, 10, 400, ink, mono);
  text("CONFIRMED", x, 548, 8, 400, pink, mono);
  ctx.font = `400 8px ${sans}`;
  text("Keep this pass for check-in.", PAGE_WIDTH - x - ctx.measureText("Keep this pass for check-in.").width, 548, 8, 400, muted);

  // Embed the artwork as a high-resolution JPEG. Canvas uses the same fonts as
  // the page, including fallback fonts for names outside the Latin alphabet.
  const jpeg = Uint8Array.from(atob(canvas.toDataURL("image/jpeg", 0.98).split(",")[1]), (char) => char.charCodeAt(0));
  const { bars, totalWidth } = encodeCode39(details.ticketId);
  const barScale = contentWidth / totalWidth;
  const vectorBars = bars.map((bar) => `${(x + bar.x * barScale).toFixed(4)} ${(PAGE_HEIGHT - barcodeTop - 46).toFixed(4)} ${(bar.width * barScale).toFixed(4)} 46 re f`).join("\n");
  const contents = `q ${PAGE_WIDTH} 0 0 ${PAGE_HEIGHT} 0 0 cm /Artwork Do Q\n0.11 0.06 0.2 rg\n${vectorBars}\n`;
  const encode = (value: string) => new TextEncoder().encode(value);
  const chunks: Uint8Array[] = [];
  let length = 0;
  const offsets = [0];
  function append(bytes: Uint8Array) { chunks.push(bytes); length += bytes.length; }
  function object(id: number, body: string, stream?: Uint8Array) {
    offsets[id] = length;
    append(encode(`${id} 0 obj\n${body}`));
    if (stream) { append(encode("\nstream\n")); append(stream); append(encode("\nendstream")); }
    append(encode("\nendobj\n"));
  }
  append(encode("%PDF-1.4\n"));
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /XObject << /Artwork 4 0 R >> >> /Contents 5 0 R >>`);
  object(4, `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>`, jpeg);
  const contentBytes = encode(contents);
  object(5, `<< /Length ${contentBytes.length} >>`, contentBytes);
  const xref = length;
  append(encode(`xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`));
  const output = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) { output.set(chunk, position); position += chunk.length; }
  return output;
}

export async function downloadPassPdf(details: PassDetails) {
  validatePassDetails(details);
  await Promise.all([
    document.fonts.load('800 29px "Bricolage Grotesque"'),
    document.fonts.load('400 11px "IBM Plex Sans"'),
    document.fonts.load('600 23px "IBM Plex Sans"'),
    document.fonts.load('400 10px "IBM Plex Mono"'),
  ]);
  const bytes = createPassPdf(details);
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${details.ticketId}-pass.pdf`;
  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}
