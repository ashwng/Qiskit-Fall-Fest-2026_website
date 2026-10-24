"use server";

import crypto from "node:crypto";
import { getDb, hasDatabase } from "@/lib/db";
import { clientIp, rateLimit, sweepRateLimits } from "@/lib/rate-limit";
import { LIMITS, takeText, type FieldError } from "@/lib/validation";
import { sendTeamEmails, type TeamEmailMember } from "@/lib/team-email";
import { hackathon } from "@/data/event";
import type {
  TeamRegistrationInput,
  TeamRegistrationResult,
  TeamTracksInput,
} from "@/types";

/**
 * Ten attempts per IP per hour, shared by both actions here. Also what keeps
 * the form from being used to probe which QFF codes exist.
 */
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const QFF_CODE = /^QFF-[0-9A-F]{6}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRACK_IDS = hackathon.tracks.map((track) => track.id);

/** Shown for "no such code" and "wrong email" alike, so codes can't be probed. */
const NO_MATCH =
  "Your QFF code and email don't match a confirmed fest registration. Use the email you registered with.";

/**
 * Accept a QFF code the way people actually type it: any case, stray spaces,
 * or the six characters without the "QFF-" prefix.
 */
function normalizeQffCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.toUpperCase().replace(/\s+/g, "");
  if (!compact) return null;
  const code = /^[0-9A-F]{6}$/.test(compact) ? `QFF-${compact}` : compact;
  return QFF_CODE.test(code) ? code : null;
}

/** Known track ids only, de-duplicated, in the site's own order. */
function takeTracks(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > TRACK_IDS.length * 2) return null;
  if (value.some((item) => typeof item !== "string" || !TRACK_IDS.includes(item))) return null;
  const picked = TRACK_IDS.filter((id) => value.includes(id));
  return picked.length > 0 ? picked : null;
}

function inTrackOrder(ids: string[]): string[] {
  return TRACK_IDS.filter((id) => ids.includes(id));
}

function generateTeamId(): string {
  // No 0/O or 1/I, so the code survives being read aloud or copied by hand.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i += 1) id += alphabet[crypto.randomInt(alphabet.length)];
  return `TEAM-${id}`;
}

function fail(error: string, statusCode: number): TeamRegistrationResult {
  return { success: false, error, statusCode };
}

function emailStatus(sent: number, total: number): TeamRegistrationResult["emailStatus"] {
  return sent === total ? "sent" : sent === 0 ? "failed" : "partial";
}

/** Database-unavailable, rate limit and leader-credential checks both actions share. */
async function openRequest(payload: { leaderCode?: unknown; leaderEmail?: unknown } | undefined) {
  if (!hasDatabase()) {
    return {
      error: fail(
        "This is a preview build — hackathon registration isn't wired up to a database yet, so nothing was saved.",
        503,
      ),
    };
  }

  const ip = await clientIp();
  const limit = await rateLimit(`hackathon-team:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.ok) {
    return {
      error: {
        ...fail("Too many attempts from this network. Please try again later.", 429),
        retryAfterSeconds: limit.retryAfterSeconds,
      },
    };
  }
  void sweepRateLimits();

  const errors: FieldError[] = [];
  const leaderEmail = takeText(payload?.leaderEmail, "Email", LIMITS.email, errors)?.toLowerCase();
  if (errors.length > 0) return { error: fail(errors[0].message, 400) };
  if (!leaderEmail || !EMAIL.test(leaderEmail)) {
    return { error: fail("Enter the email address you registered for the fest with.", 400) };
  }
  const leaderCode = normalizeQffCode(payload?.leaderCode);
  if (!leaderCode) return { error: fail("Enter your QFF code, e.g. QFF-9A4F2C.", 400) };

  return { leaderCode, leaderEmail };
}

/** Database errors both actions can hit, turned into something a visitor can read. */
function databaseFailure(err: unknown, context: string): TeamRegistrationResult {
  const pgError = err as { code?: string; constraint?: string };

  // 42703 undefined_column / 42P01 undefined_table: the migration hasn't run.
  if (pgError?.code === "42703" || pgError?.code === "42P01") {
    console.error(
      "Hackathon registration is INACTIVE: the team columns or hackathon_teams table are missing. " +
        "Run `npm run db:init` against this database.",
    );
    return fail("Hackathon registration isn't open yet. Please try again later.", 503);
  }
  // 23505: the one-leader index or the team primary key caught a concurrent duplicate.
  if (pgError?.code === "23505") {
    return fail("This team was just registered. Check your email for the team code.", 409);
  }

  // Shape only, never values: driver errors can echo parameters back.
  console.error(`${context}:`, { code: pgError?.code, constraint: pgError?.constraint });
  return fail("Unable to register your team right now. Please try again.", 500);
}

interface RegistrationRow {
  ticket_id: string;
  full_name: string;
  email: string;
  status: string;
  team_id: string | null;
  is_team_leader?: boolean;
}

interface MemberRow {
  ticket_id: string;
  full_name: string;
  email: string;
  is_team_leader: boolean;
}

const toEmailMember = (row: MemberRow): TeamEmailMember => ({
  ticketId: row.ticket_id,
  fullName: row.full_name,
  email: row.email,
  isLeader: row.is_team_leader,
});

const toSummary = ({ ticketId, fullName, isLeader }: TeamEmailMember) => ({
  ticketId,
  fullName,
  isLeader,
});

/**
 * Server Action: register a hackathon team of 1-4 people who all hold a fest
 * registration, entering one or more tracks under a single team code.
 *
 * The person filling the form is the leader and proves it with their own QFF
 * code and registered email. Teammates are named by their QFF codes. Every
 * member's registration row gets the team code (the leader's is also flagged),
 * the team's tracks go in hackathon_teams, and every member is emailed.
 */
export async function registerTeam(
  payload: Partial<TeamRegistrationInput>,
): Promise<TeamRegistrationResult> {
  try {
    const opened = await openRequest(payload);
    if ("error" in opened) return opened.error!;
    const { leaderCode, leaderEmail } = opened;

    // 1. Shape and format. Nothing touches the database until this passes.
    const tracks = takeTracks(payload?.tracks);
    if (!tracks) return fail("Pick at least one track: Rookie, Novice or Advanced.", 400);

    const rawMembers = Array.isArray(payload?.memberCodes) ? payload.memberCodes : [];
    const filled = rawMembers.filter((value) => typeof value === "string" && value.trim() !== "");
    if (filled.length > hackathon.maxTeamSize - 1) {
      return fail(`A team can have at most ${hackathon.maxTeamSize} members, including you.`, 400);
    }
    const memberCodes: string[] = [];
    for (const value of filled) {
      const code = normalizeQffCode(value);
      if (!code) return fail(`"${String(value).slice(0, 20)}" is not a valid QFF code.`, 400);
      memberCodes.push(code);
    }

    const codes = [leaderCode, ...memberCodes];
    const repeated = codes.find((code, i) => codes.indexOf(code) !== i);
    if (repeated) return fail(`${repeated} is entered more than once.`, 400);

    const sql = getDb();

    // 2. Check each code for a clear, specific error. This read is only for the
    //    message; the guarded statement below is what actually prevents conflicts.
    const rows = (await sql`
      SELECT ticket_id, full_name, email, status, team_id
      FROM registrations
      WHERE ticket_id = ANY(${codes}::text[]);
    `) as RegistrationRow[];
    const byCode = new Map(rows.map((row) => [row.ticket_id, row]));

    const leader = byCode.get(leaderCode);
    if (!leader || leader.email.toLowerCase() !== leaderEmail || leader.status !== "confirmed") {
      return fail(NO_MATCH, 400);
    }
    if (leader.team_id) {
      return fail(
        `You already lead or belong to team ${leader.team_id}. To enter more tracks, use "Add tracks to my team".`,
        409,
      );
    }

    for (const code of memberCodes) {
      const member = byCode.get(code);
      if (!member || member.status !== "confirmed") {
        return fail(
          `${code} doesn't match a confirmed fest registration. Each member has to register for the fest first.`,
          400,
        );
      }
      if (member.team_id) return fail(`${code} is already on a hackathon team.`, 409);
    }

    // 3. Pick a team code nobody has.
    let teamId = generateTeamId();
    for (let attempt = 0; ; attempt += 1) {
      const taken = await sql`
        SELECT 1 FROM registrations WHERE team_id = ${teamId}
        UNION ALL
        SELECT 1 FROM hackathon_teams WHERE team_id = ${teamId}
        LIMIT 1;
      `;
      if (taken.length === 0) break;
      if (attempt >= 11) throw new Error("Unable to generate a unique team code.");
      teamId = generateTeamId();
    }

    // 4. One statement: claim every member and create the team, or do nothing.
    //    `picked` locks the members' rows; if two teams race for the same
    //    person, the second statement waits, then sees that person already has
    //    a team, its tally falls short, it claims nobody, and so creates no team.
    const size = codes.length;
    const claimed = (await sql`
      WITH picked AS (
        SELECT id, team_id
        FROM registrations
        WHERE ticket_id = ANY(${codes}::text[]) AND status = 'confirmed'
        FOR UPDATE
      ),
      tally AS (
        SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE team_id IS NULL) AS free
        FROM picked
      ),
      claimed AS (
        UPDATE registrations AS r
        SET team_id = ${teamId},
            is_team_leader = (r.ticket_id = ${leaderCode}),
            updated_at = NOW()
        FROM tally
        WHERE r.id IN (SELECT id FROM picked)
          AND tally.total = ${size}
          AND tally.free = ${size}
        RETURNING r.ticket_id, r.full_name, r.email, r.is_team_leader
      ),
      team AS (
        INSERT INTO hackathon_teams (team_id, tracks)
        SELECT ${teamId}, ${tracks}::text[]
        WHERE (SELECT COUNT(*) FROM claimed) = ${size}
        RETURNING team_id
      )
      SELECT claimed.* FROM claimed;
    `) as MemberRow[];

    if (claimed.length !== size) {
      return fail(
        "Someone on this team was just added to another team. Check the codes and try again.",
        409,
      );
    }

    // 5. Committed. Email failures are reported, never undone.
    //    Leader first, then teammates in the order they were entered.
    const members = codes.map((code) => toEmailMember(claimed.find((row) => row.ticket_id === code)!));
    const { sent, total } = await sendTeamEmails(teamId, members, tracks);

    return {
      success: true,
      teamId,
      tracks,
      members: members.map(toSummary),
      emailStatus: emailStatus(sent, total),
      statusCode: 201,
    };
  } catch (err: unknown) {
    return databaseFailure(err, "Hackathon team registration error");
  }
}

/**
 * Server Action: the team leader enters their existing team in more tracks.
 *
 * Tracks are only ever added here, so a mistyped request can't knock a team
 * out of a track it already entered; removing one is for the organisers. The
 * team code stays the same, and every member is told about the change.
 */
export async function addTeamTracks(
  payload: Partial<TeamTracksInput>,
): Promise<TeamRegistrationResult> {
  try {
    const opened = await openRequest(payload);
    if ("error" in opened) return opened.error!;
    const { leaderCode, leaderEmail } = opened;

    const requested = takeTracks(payload?.tracks);
    if (!requested) return fail("Pick at least one track to add.", 400);

    const sql = getDb();
    const [leader] = (await sql`
      SELECT ticket_id, full_name, email, status, team_id, is_team_leader
      FROM registrations
      WHERE ticket_id = ${leaderCode};
    `) as RegistrationRow[];

    if (!leader || leader.email.toLowerCase() !== leaderEmail || leader.status !== "confirmed") {
      return fail(NO_MATCH, 400);
    }
    if (!leader.team_id) {
      return fail(`You're not on a hackathon team yet. Choose "Register a new team" instead.`, 404);
    }
    if (!leader.is_team_leader) {
      return fail("Only your team leader can add tracks. Ask them to fill in this form.", 403);
    }
    const teamId = leader.team_id;

    const existing = (await sql`
      SELECT tracks FROM hackathon_teams WHERE team_id = ${teamId};
    `) as { tracks: string[] }[];
    const before = existing[0]?.tracks ?? [];
    const added = requested.filter((id) => !before.includes(id));
    if (added.length === 0) {
      return fail("Your team is already entered in those tracks.", 409);
    }

    // Upsert, merging rather than replacing, so a concurrent add from another
    // tab can only ever add as well.
    const [team] = (await sql`
      INSERT INTO hackathon_teams (team_id, tracks)
      VALUES (${teamId}, ${requested}::text[])
      ON CONFLICT (team_id) DO UPDATE
      SET tracks = ARRAY(
            SELECT DISTINCT unnest(hackathon_teams.tracks || EXCLUDED.tracks)
          ),
          updated_at = NOW()
      RETURNING tracks;
    `) as { tracks: string[] }[];
    const tracks = inTrackOrder(team.tracks);

    const rows = (await sql`
      SELECT ticket_id, full_name, email, is_team_leader
      FROM registrations
      WHERE team_id = ${teamId}
      ORDER BY is_team_leader DESC, full_name;
    `) as MemberRow[];
    const members = rows.map(toEmailMember);
    const { sent, total } = await sendTeamEmails(teamId, members, tracks, added);

    return {
      success: true,
      teamId,
      tracks,
      addedTracks: added,
      members: members.map(toSummary),
      emailStatus: emailStatus(sent, total),
      statusCode: 200,
    };
  } catch (err: unknown) {
    return databaseFailure(err, "Hackathon add-tracks error");
  }
}
