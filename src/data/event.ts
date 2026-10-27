import type { EventDetail } from "@/types";

/**
 * Top-level event metadata. Replace these placeholder strings with the real
 * values once they're confirmed — nothing else in the codebase needs to change.
 */
export const event = {
  fullName: "PLUS Qiskit Fall Fest 2026",
  shortName: "QFF 2026",
  organizer: "BITS GOA",
  tagline:
    "A campus-wide gathering for quantum computing, in circuits and in community.",
  description: `Dive into the exciting world of quantum computing at the PLUS Qiskit Fall Fest, where curiosity meets cutting-edge technology.
Collaborate on hands-on challenges, learn from experts, and level up your skills alongside a passionate, welcoming community.
Whether you are a complete beginner or a coding veteran, join us to build tomorrow's solutions and shape the future of tech today!`,
  registerHref: "/registration",
  exploreHref: "#hackathon",

  /* The facts, stated once. These were previously literals inside three
     different components, which is how the schedule came to advertise a date
     range while the details grid still said the dates were unannounced. */
  dates: "28 Oct — 1 Nov 2026",
  format: "Talks · Workshops · 72h Hackathon",
  venueName: "BITS Pilani, K.K. Birla Goa Campus",
  venueShort: "BITS Goa",
  venueAddress: "NH 17B, Bypass Road, Zuarinagar, Sancoale, Goa 403726, India",
  venueMapHref:
    "https://www.google.com/maps/search/?api=1&query=BITS+Pilani+K.K.+Birla+Goa+Campus",
};

/**
 * The hackathon, as the homepage section and its registration page show it.
 *
 * - `details`: replace TBA with the blurb; until then the section says
 *   "Details announcing soon" instead of showing placeholder text.
 * - `rulebookHref`: drop the PDF at public/hackathon/rulebook.pdf and set this
 *   to "/hackathon/rulebook.pdf". While it is empty the button shows as
 *   "Rulebook coming soon" rather than linking to a missing file.
 */
export const hackathon = {
  duration: "72 hours",
  minTeamSize: 1,
  maxTeamSize: 4,
  /**
   * Levels a team can enter, any combination of them, under one team code.
   * Open to everyone regardless of experience. The ids are what the database
   * stores; if you add or rename one, update the CHECK on hackathon_teams in
   * src/lib/db/schema.sql to match.
   *
   * `details`: replace "To be announced" with each track's description. Until
   * then its card on the homepage says "Details announcing soon".
   */
  tracks: [
    { id: "beginner", label: "Beginner", details: "To be announced" },
    { id: "advanced", label: "Advanced", details: "To be announced" },
  ],
  // Same value as TBA in components/ui/Pending; a literal so this data file
  // stays free of component imports (the node test loader only reads .ts).
  details: "To be announced",
  rulebookHref: "",
  registerHref: "/hackathon-registration",
};

export const eventDetails: EventDetail[] = [
  {
    label: "Dates",
    value: event.dates,
    icon: "calendar",
  },
  {
    label: "Venue",
    value: event.venueName,
    icon: "map-pin",
  },
  {
    label: "Format",
    value: event.format,
    icon: "layers",
  },
  {
    label: "Who can join",
    value: "Open to all students",
    icon: "users",
  },
  {
    label: "Registration",
    value: "Registrations are live",
    icon: "ticket",
    cta: { label: "Register now", href: event.registerHref },
  },
  {
    label: "Duration",
    value: "5 days",
    icon: "clock",
  },
];
