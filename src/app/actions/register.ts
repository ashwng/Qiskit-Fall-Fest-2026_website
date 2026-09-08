"use server";

import crypto from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";
import { RegistrationFormData, RegistrationActionResult } from "@/types";

function generateTicketId(): string {
  // Generates a readable 6-character hex code, e.g. "QFF-9A4F2C"
  const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `QFF-${randomHex}`;
}

/**
 * Server Action: Validates and writes attendee registration directly into Neon PostgreSQL.
 */
export async function registerAttendee(
  payload: Partial<RegistrationFormData>
): Promise<RegistrationActionResult> {
  try {
    // Preview builds ship without a Neon connection string. Say so plainly
    // rather than surfacing a raw "DATABASE_URL is missing" to the visitor —
    // that reads as a crash, not as a deliberately unwired preview.
    if (!hasDatabase()) {
      return {
        success: false,
        error:
          "This is a preview build — registration isn't wired up to a database yet, so nothing was saved.",
        statusCode: 503,
      };
    }

    // 1. Validate required fields
    const fullName = payload.fullName?.trim();
    const email = payload.email?.trim().toLowerCase();
    const phone = payload.phone?.trim();
    const institution = payload.institution?.trim();
    const attendanceMode = payload.attendanceMode;
    const agreedToTerms = payload.agreedToTerms;

    if (!fullName) {
      return { success: false, error: "Full name is required.", statusCode: 400 };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "A valid email address is required.", statusCode: 400 };
    }

    if (!phone) {
      return { success: false, error: "Contact phone number is required.", statusCode: 400 };
    }

    if (!institution) {
      return { success: false, error: "Institution / university name is required.", statusCode: 400 };
    }

    if (!attendanceMode || !["offline", "online"].includes(attendanceMode)) {
      return {
        success: false,
        error: "Please select a valid attendance mode (offline or online).",
        statusCode: 400,
      };
    }

    if (!agreedToTerms) {
      return {
        success: false,
        error: "You must agree to the Code of Conduct to register.",
        statusCode: 400,
      };
    }

    // 2. Normalize optional fields (empty strings to SQL nulls)
    const studyLevel = payload.studyLevel?.trim() || null;
    const graduationYear = payload.graduationYear?.trim() || null;
    const quantumExperience = payload.quantumExperience?.trim() || "beginner";
    const interests = Array.isArray(payload.interests) ? payload.interests : [];
    const githubUrl = payload.githubUrl?.trim() || null;
    const linkedinUrl = payload.linkedinUrl?.trim() || null;
    const tshirtSize = payload.tshirtSize?.trim() || "M (38\")";

    const ticketId = generateTicketId();

    // 3. Connect to Neon and insert record
    const sql = getDb();

    const result = await sql`
      INSERT INTO registrations (
        ticket_id,
        full_name,
        email,
        phone,
        institution,
        study_level,
        graduation_year,
        attendance_mode,
        quantum_experience,
        interests,
        github_url,
        linkedin_url,
        tshirt_size,
        agreed_to_terms
      ) VALUES (
        ${ticketId},
        ${fullName},
        ${email},
        ${phone},
        ${institution},
        ${studyLevel},
        ${graduationYear},
        ${attendanceMode},
        ${quantumExperience},
        ${interests},
        ${githubUrl},
        ${linkedinUrl},
        ${tshirtSize},
        ${Boolean(agreedToTerms)}
      )
      RETURNING id, ticket_id, email, created_at;
    `;

    const inserted = result[0];

    return {
      success: true,
      ticketId: inserted.ticket_id,
      message: "Registration successfully recorded in database.",
      statusCode: 201,
    };
  } catch (err: unknown) {
    const pgError = err as { code?: string; message?: string };

    // PostgreSQL Unique Constraint Violation (duplicate email or ticketId)
    if (
      pgError?.code === "23505" ||
      pgError?.message?.includes("idx_registrations_email_lower") ||
      pgError?.message?.includes("registrations_email_key")
    ) {
      return {
        success: false,
        error: "This email address has already been registered for BITS Qiskit Fall Fest 2026.",
        statusCode: 409,
      };
    }

    console.error("Neon database registration error:", err);
    return {
      success: false,
      error: "Unable to store registration in database. Please check connection and try again.",
      statusCode: 500,
    };
  }
}
