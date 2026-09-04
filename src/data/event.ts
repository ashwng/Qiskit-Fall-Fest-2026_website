import type { EventDetail } from "@/types";

/**
 * Top-level event metadata. Replace these placeholder strings with the real
 * values once they're confirmed — nothing else in the codebase needs to change.
 */
export const event = {
  fullName: "BITS Qiskit Fall Fest 2026",
  shortName: "QFF 2026",
  organizer: "BITS Pilani",
  tagline: "A campus-wide gathering for quantum computing, in circuits and in community.",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qiskit Fall Fest brings together students, researchers, and builders for a season of talks, workshops, and a 24-hour hackathon exploring quantum computing on real hardware.",
  registerHref: "/registration",
  exploreHref: "#hackathon",
};

export const eventDetails: EventDetail[] = [
  {
    label: "Dates",
    value: "Lorem ipsum — TBA 2026",
    icon: "calendar",
  },
  {
    label: "Venue",
    value: "Lorem ipsum Campus, BITS Pilani",
    icon: "map-pin",
  },
  {
    label: "Format",
    value: "Talks · Workshops · 24h Hackathon",
    icon: "layers",
  },
  {
    label: "Who can join",
    value: "Open to all students — lorem ipsum eligibility details",
    icon: "users",
  },
  {
    label: "Registration",
    value: "Opens lorem ipsum — free for students",
    icon: "ticket",
  },
  {
    label: "Duration",
    value: "3 days, lorem ipsum schedule",
    icon: "clock",
  },
];
