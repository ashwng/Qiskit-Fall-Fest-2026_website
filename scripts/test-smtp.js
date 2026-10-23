import nodemailer from "nodemailer";

const recipient = process.argv[2];
if (!recipient) throw new Error("Provide your test recipient email.");

const smtp = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

await smtp.verify();
console.log("SMTP connection and authentication passed.");

const result = await smtp.sendMail({
  from: process.env.SMTP_FROM,
  to: recipient,
  subject: "QFF SMTP test",
  text: "This is a test email from the QFF website project.",
});

console.log("Submitted to Brevo:", result.messageId);