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
};

export const eventDetails: EventDetail[] = [
  {
    label: "Dates",
    value: "To be announced",
    icon: "calendar",
  },
  {
    label: "Venue",
    value: "To be announced",
    icon: "map-pin",
  },
  {
    label: "Format",
    value: "Talks · Workshops · 24h Hackathon",
    icon: "layers",
  },
  {
    label: "Who can join",
    value: "Open to all students — To be announced",
    icon: "users",
  },
  {
    label: "Registration",
    value: "Opens To be announced",
    icon: "ticket",
  },
  {
    label: "Duration",
    value: "5 days, To be announced",
    icon: "clock",
  },
];
