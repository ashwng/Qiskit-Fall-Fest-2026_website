import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { PDFDocument } from "pdf-lib";
import nodemailer from "nodemailer";
import { loadTs } from "./test-support/load-ts.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const pass = { ticketId: "QFF-ABC123", fullName: "Test Participant", institution: "Test Institute", attendanceMode: "offline" };

test("builds a one-page PDF attachment and escapes attendee text in HTML", async () => {
  const { buildPassEmail } = loadTs(path.join(root, "src/lib/pass-email.ts"), {});
  const message = await buildPassEmail("test@example.test", { ...pass, fullName: "José <Participant> & Team" }, "QBITSABCDEFGH");
  assert.deepEqual(message.to, { address: "test@example.test" });
  assert.ok(message.text.includes("QFF-ABC123"));
  assert.ok(message.text.includes("QBITSABCDEFGH"));
  assert.ok(message.html.includes("&lt;Participant&gt; &amp; Team"));
  assert.equal(message.html.includes("<Participant>"), false);
  const attachment = message.attachments[0];
  assert.equal(attachment.filename, "QFF-ABC123-pass.pdf");
  assert.equal(attachment.contentType, "application/pdf");
  assert.equal(attachment.content.subarray(0, 4).toString(), "%PDF");
  assert.equal((await PDFDocument.load(attachment.content)).getPageCount(), 1);
  const preview = nodemailer.createTransport({ streamTransport: true, buffer: true });
  const mime = await preview.sendMail({ ...message, from: "QFF 2026 <sender@example.test>" });
  assert.ok(mime.message.toString().includes("application/pdf"));
  assert.ok(mime.message.toString().includes("QFF-ABC123-pass.pdf"));
});

test("maximum-length names and institutions produce a one-page PDF", async () => {
  const { createPassPdf } = loadTs(path.join(root, "src/lib/pass-pdf.ts"), {});
  const bytes = await createPassPdf({ ...pass, fullName: "W".repeat(120), institution: "W".repeat(200) });
  assert.equal((await PDFDocument.load(bytes)).getPageCount(), 1);
});

test("SMTP uses TLS and a single saved recipient; rejects failed acceptance", async () => {
  const previous = Object.fromEntries(["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"].map(key => [key, process.env[key]]));
  Object.assign(process.env, { SMTP_HOST: "smtp.example.test", SMTP_PORT: "587", SMTP_USER: "test", SMTP_PASS: "fake-test-key", SMTP_FROM: "QFF <sender@example.test>" });
  try {
    let transportOptions;
    let sentMessage;
    let accepted = true;
    const { sendPassEmail } = loadTs(path.join(root, "src/lib/pass-email.ts"), {
      nodemailer: { createTransport: (options) => {
        transportOptions = options;
        return { sendMail: async (message) => {
          sentMessage = message;
          return { accepted: accepted ? ["test@example.test"] : [], rejected: accepted ? [] : ["test@example.test"] };
        } };
      } },
      "@/lib/pass-pdf": { createPassPdf: async () => Buffer.from("%PDF-test") },
    });
    await sendPassEmail("test@example.test", pass);
    assert.equal(transportOptions.requireTLS, true);
    assert.equal(transportOptions.secure, false);
    assert.deepEqual(sentMessage.to, { address: "test@example.test" });
    assert.equal(sentMessage.disableFileAccess, true);
    accepted = false;
    await assert.rejects(sendPassEmail("test@example.test", pass), /not accepted/);
    delete process.env.SMTP_FROM;
    await assert.rejects(sendPassEmail("test@example.test", pass), /configuration is incomplete/);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
