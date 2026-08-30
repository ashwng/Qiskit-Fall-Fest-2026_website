import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Ticket,
  Layers,
  Flag,
  Puzzle,
  GanttChartSquare,
  Gavel,
  Trophy,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export const detailIconMap: Record<string, LucideIcon> = {
  calendar: Calendar,
  "map-pin": MapPin,
  users: Users,
  clock: Clock,
  ticket: Ticket,
  layers: Layers,
};

export const hackathonIconMap: Record<string, LucideIcon> = {
  flag: Flag,
  puzzle: Puzzle,
  timeline: GanttChartSquare,
  gavel: Gavel,
  trophy: Trophy,
  "check-circle": CheckCircle2,
};
