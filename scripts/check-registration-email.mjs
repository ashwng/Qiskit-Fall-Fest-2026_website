import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTs } from "./test-support/load-ts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const payload = { fullName: "Test Participant", email: "TEST@EXAMPLE.TEST", phone: "1234567890", institution: "Test Institute", attendanceMode: "offline", agreedToTerms: true };

function setup({ smtpFails = false, duplicate = false } = {}) {
  let transactions = 0;
  const emails = [];
  const sql = async (parts, ...params) => parts.join("").includes("INSERT INTO registrations") ? [{ ticket_id: params[0] }] : [];
  sql.transaction = async (callback) => {
    transactions++;
    if (duplicate) throw Object.assign(new Error("Duplicate"), { code: "23505" });
    return Promise.all(callback(sql));
  };
  const { registerAttendee } = loadTs(path.join(root, "src/app/actions/register.ts"), {
    "@/lib/db": { hasDatabase: () => true, getDb: () => sql },
    "@/lib/rate-limit": { clientIp: async () => "192.0.2.1", rateLimit: async () => ({ ok: true }), sweepRateLimits: async () => {} },
    "@/lib/pass-email": { sendPassEmail: async (...args) => {
      if (smtpFails) throw Object.assign(new Error("SMTP unavailable"), { code: "ECONNECTION" });
      emails.push(args);
    } },
  });
  return { registerAttendee, emails, get transactions() { return transactions; } };
}

test("registration emails the committed ticket and referral code once", async () => {
  const app = setup();
  const result = await app.registerAttendee(payload);
  assert.equal(result.success, true);
  assert.equal(result.emailStatus, "sent");
  assert.equal(app.transactions, 1);
  assert.equal(app.emails.length, 1);
  assert.equal(app.emails[0][0], "test@example.test");
  assert.equal(app.emails[0][1].ticketId, result.ticketId);
  assert.equal(app.emails[0][2], result.referralCode);
});

test("SMTP failure preserves a successful registration and printable ticket", async (t) => {
  t.mock.method(console, "error", () => {});
  const app = setup({ smtpFails: true });
  const result = await app.registerAttendee(payload);
  assert.equal(result.success, true);
  assert.equal(result.emailStatus, "failed");
  assert.ok(result.ticketId);
  assert.equal(app.transactions, 1);
});

test("a duplicate registration does not send another confirmation email", async () => {
  const app = setup({ duplicate: true });
  const result = await app.registerAttendee(payload);
  assert.equal(result.success, false);
  assert.equal(result.statusCode, 409);
  assert.equal(app.emails.length, 0);
});
