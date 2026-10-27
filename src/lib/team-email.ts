import { event, hackathon } from "@/data/event";
import { createSmtpTransport, escapeHtml } from "@/lib/pass-email";

export interface TeamEmailMember {
  ticketId: string;
  fullName: string;
  email: string;
  isLeader: boolean;
}

/** "beginner" -> "Beginner", using the labels the site shows. */
export function trackLabels(ids: string[]): string {
  return hackathon.tracks
    .filter((track) => ids.includes(track.id))
    .map((track) => track.label)
    .join(", ");
}

/**
 * The confirmation each member receives once their team is registered, or
 * when the leader later adds tracks (`addedTracks`).
 *
 * Everyone gets the team code, its tracks and the roster. The leader is told that further
 * hackathon information will come to them; everyone else is told it will go
 * to the leader, by name. Members only see each other's names and QFF codes,
 * never each other's email addresses.
 */
export function buildTeamEmail(
  recipient: TeamEmailMember,
  teamId: string,
  members: TeamEmailMember[],
  tracks: string[],
  addedTracks?: string[],
) {
  const isUpdate = Boolean(addedTracks?.length);
  const leader = members.find((member) => member.isLeader);
  const roster = members.map(
    (member) =>
      `${member.fullName} (${member.ticketId})${member.isLeader ? " - Team leader" : ""}`,
  );

  const intro = [
    `Hello ${recipient.fullName},`,
    isUpdate
      ? `Your team is now also entered in: ${trackLabels(addedTracks!)}.`
      : `You're registered for the ${event.shortName} ${hackathon.duration} hackathon.`,
    `Team code: ${teamId}`,
    `Tracks: ${trackLabels(tracks)}`,
    "The same team code works for every track your team has entered.",
  ];
  const followUp = [
    recipient.isLeader
      ? "As team leader, you will receive all further hackathon information (problem statements, schedule and submission details) at this address. Please share it with your team."
      : `All further hackathon information will be sent to your team leader, ${leader?.fullName ?? "your team leader"}.`,
    "Keep your team code handy. You may be asked for it at check-in and when submitting your project.",
    "If you did not agree to join this team, reply to this email and we will sort it out.",
    "See you at the hackathon!",
    `The ${event.shortName} organizing team`,
  ];

  const text = [...intro, "Your team:", ...roster.map((line) => `- ${line}`), ...followUp].join(
    "\n\n",
  );
  const paragraph = (line: string) => `<p>${escapeHtml(line)}</p>`;
  const html =
    `<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;color:#241333;line-height:1.6;border-top:4px solid #8a3ffc;padding:24px">` +
    `<h1 style="font-size:24px">${isUpdate ? "Tracks updated for" : "You're on team"} ${escapeHtml(teamId)}</h1>` +
    intro.map(paragraph).join("") +
    `<p><strong>Your team:</strong></p><ul>${roster.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>` +
    followUp.map(paragraph).join("") +
    `</div>`;

  return {
    from: process.env.SMTP_FROM,
    // An address object prevents treating a saved address as a recipient list.
    to: { address: recipient.email },
    subject: isUpdate
      ? `${event.shortName} Hackathon - ${teamId} now entered in ${trackLabels(tracks)}`
      : `${event.shortName} Hackathon - your team code is ${teamId}`,
    text,
    html,
    disableFileAccess: true,
    disableUrlAccess: true,
  };
}

/**
 * Email every member, one message each. Resolves to how many were accepted;
 * a failure for one member never stops the others.
 */
export async function sendTeamEmails(
  teamId: string,
  members: TeamEmailMember[],
  tracks: string[],
  addedTracks?: string[],
) {
  let smtp: ReturnType<typeof createSmtpTransport>;
  try {
    smtp = createSmtpTransport();
  } catch (err) {
    console.error("Team confirmation email not configured:", (err as Error).message);
    return { sent: 0, total: members.length };
  }

  const results = await Promise.allSettled(
    members.map(async (member) => {
      const result = await smtp.sendMail(buildTeamEmail(member, teamId, members, tracks, addedTracks));
      if (result.accepted.length === 0 || result.rejected.length > 0) {
        throw new Error("Recipient not accepted by SMTP.");
      }
    }),
  );
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    console.error("Team confirmation email failed:", {
      teamId,
      failed: failed.length,
      code: ((failed[0] as PromiseRejectedResult).reason as { code?: string })?.code,
    });
  }
  return { sent: results.length - failed.length, total: members.length };
}
