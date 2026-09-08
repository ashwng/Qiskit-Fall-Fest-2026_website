import { neon } from "@neondatabase/serverless";

/**
 * Normalizes the database URL by removing trailing inline comments and whitespace
 */
function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL || "";
  const cleaned = raw.split("#")[0].trim();
  return cleaned;
}

/** Whether a database is configured at all. */
export function hasDatabase(): boolean {
  return getDatabaseUrl().length > 0;
}

/**
 * Returns a Neon SQL execution client for serverless/edge route handlers.
 * Uses HTTP fetch under the hood for zero connection pool latency.
 */
export function getDb() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is missing. Please check your .env.local file."
    );
  }
  return neon(url);
}
