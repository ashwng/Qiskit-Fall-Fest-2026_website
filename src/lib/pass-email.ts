import nodemailer from "nodemailer";
import { createPassPdf } from "@/lib/pass-pdf";
import { event } from "@/data/event";
import type { AttendeePassData } from "@/types";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

/** Separate message construction lets tests inspect the real PDF without sending. */
export async function buildPassEmail(to: string, pass: AttendeePassData, referralCode?: string) {
  const pdf = await createPassPdf(pass);
  const details = [
    `Hello ${pass.fullName},`,
    `Your ${event.shortName} attendee pass is attached as a PDF. Save it on your phone or print a copy.`,
    `QFF entry code: ${pass.ticketId}`,
    `Dates: ${event.dates}`,
    `Venue: ${event.venueName}`,
    "Your QFF code permits campus entry for all 5 days. Entry will be checked at the gate every time.",
    "Carry both a government-issued ID card and an institute-issued ID card for campus entry.",
    ...(referralCode ? [`Your referral code: ${referralCode}`] : []),
    "See you at the fest!",
    "The QFF 2026 organizing team",
  ];
  return {
    from: process.env.SMTP_FROM,
    // An address object prevents treating a saved address as a recipient list.
    to: { address: to },
    subject: `Your QFF 2026 pass - ${pass.ticketId}`,
    text: details.join("\n\n"),
    html: `<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;color:#241333;line-height:1.6;border-top:4px solid #8a3ffc;padding:24px"><h1 style="font-size:24px">Your QFF 2026 pass</h1>${details.map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}</div>`,
    attachments: [{
      filename: `${pass.ticketId.replace(/[^A-Za-z0-9-]/g, "")}-pass.pdf`,
      content: pdf,
      contentType: "application/pdf",
    }],
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

/**
 * The configured SMTP transport. Throws when the configuration is incomplete,
 * so callers treat "not configured" the same as "send failed".
 */
export function createSmtpTransport() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
    throw new Error("Pass email SMTP configuration is incomplete.");
  }
  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT is invalid.");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/** Await SMTP acceptance; callers handle failures independently of registration. */
export async function sendPassEmail(to: string, pass: AttendeePassData, referralCode?: string) {
  const smtp = createSmtpTransport();
  const result = await smtp.sendMail(await buildPassEmail(to, pass, referralCode));
  if (result.accepted.length === 0 || result.rejected.length > 0) {
    throw new Error("The pass email recipient was not accepted by SMTP.");
  }
}
