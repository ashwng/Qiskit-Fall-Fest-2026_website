import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";
import { clientIp, rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { LIMITS, takeText, type FieldError } from "@/lib/validation";
import type { PassLookupResponse } from "@/types";
import { sendPassEmail } from "@/lib/pass-email";

export const dynamic = "force-dynamic";

const MAX_LOOKUP_BODY_BYTES = 2048;
const SUCCESS_MESSAGE =
  "If this email address is registered, your pass will be emailed shortly. Please check your inbox and spam folder.";

function acknowledged() {
  return NextResponse.json<PassLookupResponse>(
    { success: true, message: SUCCESS_MESSAGE },
    { headers: { "Cache-Control": "no-store" } },
  );
}

function failure(error: string, status: number, headers?: Record<string, string>) {
  return NextResponse.json<PassLookupResponse>(
    { success: false, error },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return failure("Content-Type must be application/json.", 415);
  }

  if (Number(request.headers.get("content-length")) > MAX_LOOKUP_BODY_BYTES) {
    return failure("Request body is too large.", 413);
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_LOOKUP_BODY_BYTES) {
      return failure("Request body is too large.", 413);
    }
    payload = JSON.parse(raw);
  } catch {
    return failure("Please provide your registered email address.", 400);
  }

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return failure("Please provide your registered email address.", 400);
  }

  const fields = payload as Record<string, unknown>;
  const errors: FieldError[] = [];
  const email = takeText(fields.email, "Email", LIMITS.email, errors)?.toLowerCase();
  if (errors.length > 0) return failure(errors[0].message, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return failure("Please provide a valid registered email address.", 400);
  }

  if (!hasDatabase()) {
    return failure("Pass retrieval is temporarily unavailable. Please try again later.", 503);
  }

  try {
    const ip = await clientIp();
    const limit = await rateLimit(`pass-lookup:${ip}`, 20, 15 * 60 * 1000);
    if (!limit.ok) {
      return failure("Too many lookup attempts. Please try again later.", 429, {
        "Retry-After": String(limit.retryAfterSeconds),
      });
    }
    // Hash the address so limiter records don't store contact details.
    const recipientKey = createHash("sha256").update(email).digest("hex");
    const recipientLimit = await rateLimit(`pass-email:${recipientKey}`, 3, 60 * 60 * 1000);
    if (!recipientLimit.ok) {
      return failure("A pass has already been requested several times for this address. Please try again later.", 429, {
        "Retry-After": String(recipientLimit.retryAfterSeconds),
      });
    }
    void sweepRateLimits();

    const sql = getDb();
    const rows = await sql`
      SELECT ticket_id, full_name, email, institution, attendance_mode, referral_code
      FROM registrations
      WHERE LOWER(email) = ${email}
        AND status = 'confirmed'
      LIMIT 1;
    `;
    const row = rows[0];
    if (!row) return acknowledged();
    if (row.attendance_mode !== "offline" && row.attendance_mode !== "online") {
      return failure("Unable to retrieve this pass. Please contact the organizers.", 503);
    }

    // Always send to the saved address. No ticket or attendee data is returned
    // to the browser, and unknown addresses get the same acknowledgement.
    await sendPassEmail(row.email, {
      ticketId: row.ticket_id,
      fullName: row.full_name,
      institution: row.institution,
      attendanceMode: row.attendance_mode,
    }, row.referral_code || undefined);
    return acknowledged();
  } catch (err) {
    console.error("Pass retrieval failed:", { code: (err as { code?: string })?.code });
    return failure("Unable to email your pass right now. Please try again later.", 503);
  }
}
