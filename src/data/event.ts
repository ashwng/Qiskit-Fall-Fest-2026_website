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
  format: "Talks · Workshops · 24h Hackathon",
  venueName: "BITS Pilani, K.K. Birla Goa Campus",
  venueShort: "BITS Goa campus",
  venueAddress: "NH 17B, Bypass Road, Zuarinagar, Sancoale, Goa 403726, India",
  venueMapHref:
    "https://www.google.com/maps/search/?api=1&query=BITS+Pilani+K.K.+Birla+Goa+Campus",
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
    value: "To be announced",
    icon: "ticket",
  },
  {
    label: "Duration",
    value: "5 days",
    icon: "clock",
  },
];
