import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadTs } from "./test-support/load-ts.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const registeredRow = {
  ticket_id: "QFF-ABC123", full_name: "Test Participant", email: "test@example.test",
  institution: "Test Institute", attendance_mode: "offline", referral_code: "QBITSABCDEFGH",
};

function setup({ rows = [], configured = true, limited = false, recipientLimited = false, sendFails = false } = {}) {
  const queries = [];
  const sentEmails = [];
  const limitKeys = [];
  const { POST } = loadTs(path.resolve(scriptDir, "../src/app/api/pass/route.ts"), {
    "@/lib/db": {
      hasDatabase: () => configured,
      getDb: () => async (parts, ...params) => {
        queries.push({ sql: parts.join("?"), params });
        return rows;
      },
    },
    "@/lib/rate-limit": {
      clientIp: async () => "192.0.2.1",
      rateLimit: async (key) => {
        limitKeys.push(key);
        return { ok: !(limited || (recipientLimited && key.startsWith("pass-email:"))), retryAfterSeconds: 60 };
      },
      sweepRateLimits: async () => {},
    },
    "@/lib/pass-email": {
      sendPassEmail: async (...args) => {
        if (sendFails) throw Object.assign(new Error("SMTP error"), { code: "EAUTH" });
        sentEmails.push(args);
      },
    },
  });
  return {
    queries, sentEmails, limitKeys,
    post: (body, headers = { "Content-Type": "application/json" }) => POST(new Request("http://localhost/api/pass", {
      method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body),
    })),
  };
}

test("rejects malformed, missing, non-string, and oversized email fields", async () => {
  const app = setup();
  for (const body of ["{", "null", "[]", {}, { email: "invalid" }, { email: "   " },
    { email: ["test@example.test"] }, { email: `${"x".repeat(250)}@example.test` }]) {
    assert.equal((await app.post(body)).status, 400);
  }
  assert.equal(app.queries.length, 0);
  assert.equal(app.limitKeys.length, 0);
});

test("enforces JSON and declared/actual byte limits", async () => {
  const app = setup();
  assert.equal((await app.post("{}", { "Content-Type": "text/plain" })).status, 415);
  assert.equal((await app.post("{}", { "Content-Type": "application/json", "Content-Length": "3000" })).status, 413);
  assert.equal((await app.post({ email: "test@example.test", extra: "界".repeat(800) })).status, 413);
  assert.equal(app.queries.length, 0);
});

test("emails the saved pass to its saved address without returning attendee data", async () => {
  const app = setup({ rows: [registeredRow] });
  const response = await app.post({ email: "  TEST@EXAMPLE.TEST  ", to: "other@example.test" });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.success, true);
  assert.equal("pass" in result, false);
  assert.equal(JSON.stringify(result).includes(registeredRow.ticket_id), false);
  assert.deepEqual(app.sentEmails[0], ["test@example.test", {
    ticketId: "QFF-ABC123", fullName: "Test Participant", institution: "Test Institute", attendanceMode: "offline",
  }, "QBITSABCDEFGH"]);
  assert.deepEqual(app.queries[0].params, ["test@example.test"]);
  assert.match(app.queries[0].sql, /status\s*=\s*'confirmed'/i);
  assert.doesNotMatch(app.queries[0].sql, /\b(?:insert|update|delete)\b/i);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(app.limitKeys.length, 2);
  assert.equal(app.limitKeys.some(key => key.includes("test@example.test")), false);
});

test("registered and unknown addresses get the same acknowledgement", async () => {
  const known = setup({ rows: [registeredRow] });
  const unknown = setup();
  const a = await known.post({ email: "test@example.test" });
  const b = await unknown.post({ email: "unknown@example.test" });
  assert.equal(a.status, b.status);
  assert.deepEqual(await a.json(), await b.json());
  assert.equal(unknown.sentEmails.length, 0);
});

test("IP and recipient limits block database and email access", async () => {
  for (const option of [{ limited: true }, { recipientLimited: true }]) {
    const app = setup({ ...option, rows: [registeredRow] });
    const response = await app.post({ email: "test@example.test" });
    assert.equal(response.status, 429);
    assert.equal(response.headers.get("retry-after"), "60");
    assert.equal(app.queries.length, 0);
    assert.equal(app.sentEmails.length, 0);
  }
});

test("an unconfigured preview fails without touching the database", async () => {
  const app = setup({ configured: false });
  assert.equal((await app.post({ email: "test@example.test" })).status, 503);
  assert.equal(app.queries.length, 0);
});

test("SMTP errors produce a retryable failure without exposing SMTP details", async (t) => {
  const log = t.mock.method(console, "error", () => {});
  const app = setup({ rows: [registeredRow], sendFails: true });
  const response = await app.post({ email: "test@example.test" });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
  assert.equal(log.mock.calls[0].arguments[1].code, "EAUTH");
});
