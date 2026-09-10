import type { HackathonCard } from "@/types";

/* The section's own voice line. Everything factual about the hackathon is
   still unannounced; this only restates the format the event already gives. */
export const hackathonIntro =
  "One night, one quantum problem, and whatever your team can build with Qiskit before the clock runs out.";

export const hackathonCards: HackathonCard[] = [
  {
    id: "overview",
    title: "Overview",
    description:
      "To be announced.",
    icon: "flag",
  },
  {
    id: "problem-statements",
    title: "Problem Statements",
    description:
      "To be announced.",
    icon: "puzzle",
  },
  {
    id: "timeline",
    title: "Timeline",
    description:
      "To be announced.",
    icon: "timeline",
  },
  {
    id: "rules",
    title: "Rules",
    description:
      "To be announced.",
    icon: "gavel",
  },
  {
    id: "prizes",
    title: "Prizes",
    description:
      "To be announced.",
    icon: "trophy",
  },
  {
    id: "eligibility",
    title: "Eligibility",
    description:
      "To be announced.",
    icon: "check-circle",
  },
];
