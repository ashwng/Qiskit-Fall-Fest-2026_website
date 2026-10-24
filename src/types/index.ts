// Central type definitions for QFF 2026.
// These map loosely onto the future database entities (see /docs/ARCHITECTURE.md)
// so that the eventual Prisma schema (Speaker, ScheduleItem, TeamMember, ...)
// can be generated from shapes that already match the UI.

export interface NavItem {
  label: string;
  href: string; // section id, e.g. "#details"
}

export interface EventDetail {
  label: string;
  value: string;
  icon: "calendar" | "map-pin" | "users" | "clock" | "ticket" | "layers";
  cta?: { label: string; href: string }; // optional button beside the value
}

export interface ScheduleItem {
  id: string;
  day: string; // "Day 1", "Day 2" — grouping key
  time: string;
  title: string;
  description: string;
  track?: string;
}

export interface SocialLink {
  platform: "instagram" | "linkedin" | "x" | "github" | "youtube" | "discord" | "mail";
  href: string;
  handle?: string;
}

export interface Speaker {
  id: string;
  name: string;
  description: string;
  image?: string; // path under /public; falls back to the placeholder avatar
  imageSeed: string; // used to generate a deterministic placeholder avatar
  socials: SocialLink[];
}

export interface Collaboration {
  id: string;
  name: string;
  tier: "title" | "partner" | "collaborator";
  logoInitial?: string; // placeholder mark shown until a real logo is supplied
  logo?: string;
  url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  note?: string; // optional one-liner shown under the role
  image?: string; // path under /public; falls back to the placeholder avatar
  imageSeed: string;
  socials: SocialLink[];
}


export interface RegistrationPerk {
  id: string;
  title: string;
  description: string;
  icon: "cpu" | "award" | "book-open" | "users" | "gift" | "coffee";
}

export interface RegistrationFaq {
  id: string;
  question: string;
  answer: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  studyLevel: string;
  graduationYear: string;
  attendanceMode: "offline" | "online";
  quantumExperience: string;
  interests: string[];
  githubUrl: string;
  linkedinUrl: string;
  tshirtSize: string;
  referredByCode: string;
  agreedToTerms: boolean;
  willingToBePOC: boolean;
}

export type AttendeePassData = Pick<
  RegistrationFormData,
  "fullName" | "institution" | "attendanceMode"
> & { ticketId: string };

export type PassLookupResponse =
  | { success: true; message: string }
  | { success: false; error: string };

export interface RegistrationResponse {
  success?: boolean;
  ticketId?: string;
  referralCode?: string;
  emailStatus?: "sent" | "failed";
  message?: string;
  error?: string;
}

export interface RegistrationActionResult {
  success: boolean;
  ticketId?: string;
  referralCode?: string;
  emailStatus?: "sent" | "failed";
  message?: string;
  error?: string;
  /** Set alongside a 429 so the caller can surface a Retry-After. */
  retryAfterSeconds?: number;
  statusCode?: number;
}

/** What the hackathon team form sends. The leader is whoever fills it in. */
export interface TeamRegistrationInput {
  leaderCode: string;
  leaderEmail: string;
  /** The other members' QFF codes, 0-3 of them. */
  memberCodes: string[];
  /** Track ids from `hackathon.tracks`; at least one. */
  tracks: string[];
}

/** A leader adding tracks to the team they already registered. */
export interface TeamTracksInput {
  leaderCode: string;
  leaderEmail: string;
  tracks: string[];
}

export interface TeamMemberSummary {
  ticketId: string;
  fullName: string;
  isLeader: boolean;
}

export interface TeamRegistrationResult {
  success: boolean;
  teamId?: string;
  members?: TeamMemberSummary[];
  /** Every track the team is now entered in. */
  tracks?: string[];
  /** On an add-tracks request: the tracks that were new. */
  addedTracks?: string[];
  /** "partial" when some, but not all, members' confirmations were accepted. */
  emailStatus?: "sent" | "partial" | "failed";
  error?: string;
  retryAfterSeconds?: number;
  statusCode?: number;
}
