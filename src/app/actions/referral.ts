"use server";

import { randomBytes } from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validateReferrer } from "@/lib/referral-validation";

export interface ReferralResult {
  referralCode?: string;
  error?: string;
  errors?: Record<string, string>;
}

export async function registerReferrer(
  _previous: ReferralResult,
  formData: FormData,
): Promise<ReferralResult> {
  const { data, errors } = validateReferrer(Object.fromEntries(formData));
  if (!data) return { errors };
  if (!hasDatabase()) {
    return { error: "Referrer signup is currently unavailable. Please try again later." };
  }

  const limit = await rateLimit(`referral:${await clientIp()}`, 10, 60 * 60 * 1000);
  if (!limit.ok) {
    return { error: "Too many signup attempts from this network. Please try again later." };
  }

  try {
    const sql = getDb();
    for (let attempt = 0; attempt < 12; attempt += 1) {
      // A distinct prefix keeps these codes separate from attendee QBITS codes.
      const code = `QREF${randomBytes(5).toString("hex").toUpperCase()}`;
      try {
        const rows = await sql`
          INSERT INTO referrers (full_name, email, phone, institution, referral_code, agreed_to_terms)
          VALUES (${data.fullName}, ${data.email}, ${data.phone}, ${data.institution}, ${code}, TRUE)
          ON CONFLICT (email) DO UPDATE SET email = referrers.email
          RETURNING referral_code;
        `;
        // Repeat submissions return the same public code without changing personal details.
        return { referralCode: rows[0].referral_code as string };
      } catch (error) {
        const pg = error as { code?: string; constraint?: string };
        if (pg.code === "23505" && pg.constraint?.includes("referral_code")) continue;
        throw error;
      }
    }
    return { error: "We couldn't create your code. Please try again." };
  } catch (error) {
    const pg = error as { code?: string; constraint?: string };
    console.error("Referrer signup failed:", { code: pg.code, constraint: pg.constraint });
    return { error: "We couldn't save your referrer signup. Please try again later." };
  }
}
