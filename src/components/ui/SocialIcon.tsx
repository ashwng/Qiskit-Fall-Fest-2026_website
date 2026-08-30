import { Mail, X } from "lucide-react";
import type { SocialLink } from "@/types";

interface SocialIconProps {
  platform: SocialLink["platform"];
  className?: string;
}

/**
 * lucide-react no longer ships brand/logo marks, so every platform icon here
 * is a small custom outline — consistent stroke weight, single viewBox.
 * Swap any of these for an official brand asset later without touching
 * call sites (SpeakersSection, TeamSection, Footer, SocialsSection).
 */
function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.1" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.6" cy="8.2" r="1.15" fill="currentColor" />
      <path d="M7.6 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M11.4 17v-3.6c0-1.3.9-2.2 2.1-2.2s1.9.9 1.9 2.2V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.4 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.2c-4.86 0-8.8 3.94-8.8 8.8 0 3.9 2.53 7.2 6.04 8.36.44.08.6-.19.6-.42v-1.65c-2.46.53-2.98-1.05-2.98-1.05-.4-1.03-.98-1.3-.98-1.3-.8-.55.06-.54.06-.54.89.06 1.35.91 1.35.91.79 1.35 2.06.96 2.56.73.08-.57.31-.96.56-1.18-1.96-.22-4.03-.98-4.03-4.37 0-.97.35-1.75.9-2.37-.09-.22-.4-1.12.09-2.34 0 0 .74-.24 2.42.9a8.36 8.36 0 0 1 4.4 0c1.68-1.14 2.42-.9 2.42-.9.49 1.22.18 2.12.09 2.34.56.62.9 1.4.9 2.37 0 3.4-2.08 4.15-4.06 4.37.32.28.6.82.6 1.66v2.46c0 .23.16.51.61.42a8.82 8.82 0 0 0 6.02-8.36c0-4.86-3.94-8.8-8.8-8.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.6v4.8l4.3-2.4-4.3-2.4Z" fill="currentColor" />
    </svg>
  );
}

/** Discord doesn't ship in lucide-react; a minimal custom mark keeps the icon set consistent. */
function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.5 9.5c-.55 0-1 .5-1 1.1 0 .6.46 1.1 1 1.1s1-.5 1-1.1c0-.6-.45-1.1-1-1.1Zm7 0c-.55 0-1 .5-1 1.1 0 .6.46 1.1 1 1.1s1-.5 1-1.1c0-.6-.45-1.1-1-1.1Z"
        fill="currentColor"
      />
      <path
        d="M16.5 5.5c-1-.47-2.07-.8-3.2-1l-.16.32c1 .25 1.94.62 2.8 1.1-1.2-.55-2.5-.86-3.94-.86s-2.74.3-3.94.86c.86-.48 1.8-.85 2.8-1.1L10.7 4.5c-1.13.2-2.2.53-3.2 1C5.9 8 5.2 10.4 5.4 12.8c1.2.9 2.36 1.44 3.5 1.8l.42-.9c-.68-.25-1.3-.57-1.9-.98.16.1.32.2.5.28 1.24.62 2.68.94 4.08.94s2.84-.32 4.08-.94c.18-.09.34-.18.5-.28-.6.41-1.22.73-1.9.98l.42.9c1.14-.36 2.3-.9 3.5-1.8.24-2.72-.5-5.1-2.1-7.3Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SocialIcon({ platform, className }: SocialIconProps) {
  switch (platform) {
    case "instagram":
      return <InstagramMark className={className} />;
    case "linkedin":
      return <LinkedInMark className={className} />;
    case "github":
      return <GitHubMark className={className} />;
    case "youtube":
      return <YouTubeMark className={className} />;
    case "mail":
      return <Mail className={className} aria-hidden="true" />;
    case "x":
      return <X className={className} aria-hidden="true" />;
    case "discord":
      return <DiscordMark className={className} />;
    default:
      return null;
  }
}

export const platformLabel: Record<SocialLink["platform"], string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  github: "GitHub",
  youtube: "YouTube",
  discord: "Discord",
  mail: "Email",
};
