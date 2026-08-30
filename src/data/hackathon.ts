import type { HackathonCard } from "@/types";

export const hackathonIntro =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A 24-hour build sprint for quantum algorithms, applications, and tooling — open to solo hackers and teams alike.";

export const hackathonCards: HackathonCard[] = [
  {
    id: "overview",
    title: "Overview",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
    icon: "flag",
  },
  {
    id: "problem-statements",
    title: "Problem Statements",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tracks span optimization, chemistry, and ML.",
    icon: "puzzle",
  },
  {
    id: "timeline",
    title: "Timeline",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Kickoff, checkpoints, and final submissions.",
    icon: "timeline",
  },
  {
    id: "rules",
    title: "Rules",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Team size, allowed tooling, and code of conduct.",
    icon: "gavel",
  },
  {
    id: "prizes",
    title: "Prizes",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Prize pool and recognition — details TBA.",
    icon: "trophy",
  },
  {
    id: "eligibility",
    title: "Eligibility",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Open to all students, lorem ipsum criteria.",
    icon: "check-circle",
  },
];
