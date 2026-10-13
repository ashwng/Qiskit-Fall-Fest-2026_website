import type { ScheduleItem } from "@/types";

// One entry per confirmed talk. Open slots are left out until they are filled.
export const schedule: ScheduleItem[] = [
  // Wed, Oct 28
  {
    id: "oct28-1",
    day: "Wed, Oct 28",
    time: "5:00 PM - 7:00 PM",
    title: "Bhanwar Gupta",
    description: "IBM",
    track: "In person",
  },
  {
    id: "oct28-2",
    day: "Wed, Oct 28",
    time: "7:00 PM - 8:00 PM",
    title: "Manoj Nambiar",
    description: "TCS",
    track: "Virtual",
  },
  // Thu, Oct 29
  {
    id: "oct29-1",
    day: "Thu, Oct 29",
    time: "5:00 PM - 7:00 PM",
    title: "Nick Bronn",
    description: "IBM New York",
    track: "Virtual",
  },
  {
    id: "oct29-2",
    day: "Thu, Oct 29",
    time: "7:00 PM - 8:00 PM",
    title: "Santosh Kumar",
    description: "IIT Goa, Photonics",
    track: "In person",
  },
  // Fri, Oct 30
  {
    id: "oct30-1",
    day: "Fri, Oct 30",
    time: "5:00 PM - 7:00 PM",
    title: "Prof. Anil Prabhakar",
    description: "IIT Madras",
    track: "In person",
  },
  // Sat, Oct 31
  {
    id: "oct31-1",
    day: "Sat, Oct 31",
    time: "11:00 AM - 12:30 PM",
    title: "Vedangi Pathak",
    description: "IBM Vancouver",
    track: "Virtual",
  },
  {
    id: "oct31-2",
    day: "Sat, Oct 31",
    time: "1:00 PM - 2:30 PM",
    title: "Bhupendra Singh",
    description: "DRDO",
    track: "In person",
  },
  {
    id: "oct31-3",
    day: "Sat, Oct 31",
    time: "3:00 PM - 4:00 PM",
    title: "Anupama Ray",
    description: "IBM India",
    track: "Virtual",
  },
  // Sun, Nov 1
  {
    id: "nov1-1",
    day: "Sun, Nov 1",
    time: "3:00 PM - 4:00 PM",
    title: "Ritajit Majumdar",
    description: "IBM India",
    track: "Virtual",
  },
];
