import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTs } from "./test-support/load-ts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));

function registered() {
  return [
    { ticket_id: "QFF-AAAAAA", full_name: "Ada Leader", email: "ada@example.test", status: "confirmed", team_id: null, is_team_leader: false },
    { ticket_id: "QFF-BBBBBB", full_name: "Bo Member", email: "bo@example.test", status: "confirmed", team_id: null, is_team_leader: false },
    { ticket_id: "QFF-CCCCCC", full_name: "Cy Taken", email: "cy@example.test", status: "confirmed", team_id: "TEAM-XXXXXX", is_team_leader: false },
    { ticket_id: "QFF-DDDDDD", full_name: "Di Lead", email: "di@example.test", status: "confirmed", team_id: "TEAM-XXXXXX", is_team_leader: true },
  ];
}

// A database double that understands just the statements the team actions issue.
function setup() {
  const rows = registered();
  const teams = new Map([["TEAM-XXXXXX", ["rookie"]]]);
  const claims = [];
  const sql = async (parts, ...params) => {
    const text = parts.join("?");
    if (text.includes("UPDATE registrations AS r")) {
      const [codes, teamId, leaderCode, , , , tracks] = params;
      claims.push({ codes, teamId, tracks });
      teams.set(teamId, tracks);
      return rows
        .filter((row) => codes.includes(row.ticket_id))
        .map((row) => ({ ...row, team_id: teamId, is_team_leader: row.ticket_id === leaderCode }));
    }
    if (text.includes("WHERE ticket_id = ANY")) return rows.filter((row) => params[0].includes(row.ticket_id));
    if (text.includes("WHERE ticket_id = ?")) return rows.filter((row) => row.ticket_id === params[0]);
    if (text.includes("SELECT 1 FROM registrations WHERE team_id")) return [];
    if (text.includes("SELECT tracks FROM hackathon_teams")) {
      return teams.has(params[0]) ? [{ tracks: teams.get(params[0]) }] : [];
    }
    if (text.includes("INSERT INTO hackathon_teams")) {
      const merged = [...new Set([...(teams.get(params[0]) ?? []), ...params[1]])];
      teams.set(params[0], merged);
      return [{ tracks: merged }];
    }
    if (text.includes("WHERE team_id = ?")) return rows.filter((row) => row.team_id === params[0]);
    throw new Error(`Unexpected query: ${text}`);
  };
  const emails = [];
  const actions = loadTs(path.join(root, "src/app/actions/register-team.ts"), {
    "@/lib/db": { hasDatabase: () => true, getDb: () => sql },
    "@/lib/rate-limit": { clientIp: async () => "192.0.2.1", rateLimit: async () => ({ ok: true }), sweepRateLimits: async () => {} },
    "@/lib/team-email": { sendTeamEmails: async (teamId, members, tracks, added) => {
      emails.push({ teamId, members, tracks, added });
      return { sent: members.length, total: members.length };
    } },
  });
  return { ...actions, claims, emails, teams };
}

test("a team is claimed with its tracks in one statement and every member is emailed", async () => {
  const app = setup();
  const result = await app.registerTeam({
    leaderCode: "qff-aaaaaa", leaderEmail: "ADA@example.test", memberCodes: ["bbbbbb"],
    tracks: ["advanced", "rookie", "rookie"],
  });
  assert.equal(result.success, true, result.error);
  assert.match(result.teamId, /^TEAM-[A-HJ-NP-Z2-9]{6}$/);
  assert.deepEqual(app.claims[0].codes, ["QFF-AAAAAA", "QFF-BBBBBB"]);
  assert.deepEqual(app.claims[0].tracks, ["rookie", "advanced"], "de-duplicated, in site order");
  assert.deepEqual(result.tracks, ["rookie", "advanced"]);
  assert.deepEqual(result.members.map((m) => [m.ticketId, m.isLeader]), [["QFF-AAAAAA", true], ["QFF-BBBBBB", false]]);
  assert.equal(app.emails.length, 1);
  assert.deepEqual(app.emails[0].tracks, ["rookie", "advanced"]);
});

test("a team must pick at least one real track", async () => {
  const app = setup();
  for (const tracks of [undefined, [], ["expert"], ["rookie", 7]]) {
    const result = await app.registerTeam({ leaderCode: "QFF-AAAAAA", leaderEmail: "ada@example.test", memberCodes: [], tracks });
    assert.equal(result.statusCode, 400, JSON.stringify(tracks));
    assert.match(result.error, /track/);
  }
  assert.equal(app.claims.length, 0);
});

test("the leader must prove their code with the email they registered with", async () => {
  const app = setup();
  const result = await app.registerTeam({ leaderCode: "QFF-AAAAAA", leaderEmail: "bo@example.test", memberCodes: [], tracks: ["rookie"] });
  assert.equal(result.statusCode, 400);
  assert.equal(app.claims.length, 0);
});

test("someone already on a team blocks the whole team, and nobody is emailed", async () => {
  const app = setup();
  const result = await app.registerTeam({ leaderCode: "QFF-AAAAAA", leaderEmail: "ada@example.test", memberCodes: ["QFF-CCCCCC"], tracks: ["rookie"] });
  assert.equal(result.statusCode, 409);
  assert.equal(app.claims.length, 0);
  assert.equal(app.emails.length, 0);
});

test("the leader adds tracks under the same team code, and the team is told what's new", async () => {
  const app = setup();
  const result = await app.addTeamTracks({ leaderCode: "QFF-DDDDDD", leaderEmail: "di@example.test", tracks: ["novice", "rookie"] });
  assert.equal(result.success, true, result.error);
  assert.equal(result.teamId, "TEAM-XXXXXX");
  assert.deepEqual(result.tracks, ["rookie", "novice"]);
  assert.deepEqual(result.addedTracks, ["novice"]);
  assert.deepEqual(app.emails[0].added, ["novice"]);
  assert.equal(app.emails[0].members.length, 2);
});

test("only the team leader can add tracks, and only new ones", async () => {
  const app = setup();
  const member = await app.addTeamTracks({ leaderCode: "QFF-CCCCCC", leaderEmail: "cy@example.test", tracks: ["novice"] });
  assert.equal(member.statusCode, 403);
  const noTeam = await app.addTeamTracks({ leaderCode: "QFF-AAAAAA", leaderEmail: "ada@example.test", tracks: ["novice"] });
  assert.equal(noTeam.statusCode, 404);
  const nothingNew = await app.addTeamTracks({ leaderCode: "QFF-DDDDDD", leaderEmail: "di@example.test", tracks: ["rookie"] });
  assert.equal(nothingNew.statusCode, 409);
  const wrongEmail = await app.addTeamTracks({ leaderCode: "QFF-DDDDDD", leaderEmail: "cy@example.test", tracks: ["novice"] });
  assert.equal(wrongEmail.statusCode, 400);
  assert.equal(app.emails.length, 0);
  assert.deepEqual(app.teams.get("TEAM-XXXXXX"), ["rookie"]);
});

test("the confirmation lists tracks, tells the leader they get updates, and names the leader to members", () => {
  const { buildTeamEmail } = loadTs(path.join(root, "src/lib/team-email.ts"), {});
  const members = [
    { ticketId: "QFF-AAAAAA", fullName: "Ada <Leader>", email: "ada@example.test", isLeader: true },
    { ticketId: "QFF-BBBBBB", fullName: "Bo Member", email: "bo@example.test", isLeader: false },
  ];
  const toLeader = buildTeamEmail(members[0], "TEAM-ABC234", members, ["rookie", "advanced"]);
  const toMember = buildTeamEmail(members[1], "TEAM-ABC234", members, ["rookie", "advanced"]);
  assert.equal(toLeader.to.address, "ada@example.test");
  assert.match(toLeader.subject, /TEAM-ABC234/);
  assert.match(toLeader.text, /Tracks: Rookie, Advanced/);
  assert.match(toLeader.text, /As team leader, you will receive all further hackathon information/);
  assert.match(toMember.text, /sent to your team leader, Ada <Leader>\./);
  assert.ok(!toMember.text.includes("ada@example.test"), "members never see each other's addresses");
  assert.ok(toMember.html.includes("Ada &lt;Leader&gt;") && !toMember.html.includes("<Leader>"), "names are escaped in HTML");

  const update = buildTeamEmail(members[1], "TEAM-ABC234", members, ["rookie", "novice"], ["novice"]);
  assert.match(update.subject, /TEAM-ABC234 now entered in Rookie, Novice/);
  assert.match(update.text, /now also entered in: Novice\./);
});
