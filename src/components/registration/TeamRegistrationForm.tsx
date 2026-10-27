"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { addTeamTracks, registerTeam } from "@/app/actions/register-team";
import { hackathon } from "@/data/event";
import { LIMITS } from "@/lib/validation";
import { cn } from "@/lib/utils";
import type { TeamRegistrationResult } from "@/types";

const MAX_TEAMMATES = hackathon.maxTeamSize - 1;

type Mode = "new" | "add";

/** Same rule the server applies: any case, spaces, prefix optional. */
function normalize(value: string): string {
  const compact = value.toUpperCase().replace(/\s+/g, "");
  return /^[0-9A-F]{6}$/.test(compact) ? `QFF-${compact}` : compact;
}
const isQffCode = (value: string) => /^QFF-[0-9A-F]{6}$/.test(normalize(value));

const trackLabel = (id: string) => hackathon.tracks.find((track) => track.id === id)?.label ?? id;

const inputClass = (hasError: boolean) =>
  cn(
    "mt-2 w-full rounded-xl border bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted transition-all focus:border-pink focus:outline-none focus:ring-1 focus:ring-pink/50",
    hasError ? "border-danger bg-danger/5" : "border-line",
  );

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-danger">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}

/**
 * Hackathon team registration.
 *
 * Whoever fills this in is the team leader. Everyone, the leader included, is
 * identified by the QFF code from their fest registration, so nobody types
 * their details twice. The leader also gives their registered email, which is
 * what stops anyone signing up a team with someone else's code as leader.
 *
 * A team enters one or more tracks under a single team code. "Add tracks to
 * my team" lets the leader enter more tracks later without a new code.
 */
export function TeamRegistrationForm() {
  const [mode, setMode] = useState<Mode>("new");
  const [leaderCode, setLeaderCode] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [teammates, setTeammates] = useState<string[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TeamRegistrationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const teamSize = 1 + teammates.length;

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setSubmitError(null);
  };

  const toggleTrack = (id: string) => {
    setTracks((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]));
    // Picking a track answers "pick at least one", so don't leave that error up.
    setErrors((current) => {
      const next = { ...current };
      delete next.tracks;
      return next;
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!isQffCode(leaderCode)) next.leaderCode = "Enter your QFF code, e.g. QFF-9A4F2C";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leaderEmail.trim())) {
      next.leaderEmail = "Enter the email you registered with";
    }
    if (tracks.length === 0) {
      next.tracks = mode === "new" ? "Pick at least one track" : "Pick at least one track to add";
    }
    if (mode === "new") {
      const seen = new Set([normalize(leaderCode)]);
      teammates.forEach((code, i) => {
        if (!isQffCode(code)) {
          next[`mate-${i}`] = "Enter a QFF code, or remove this teammate";
        } else if (seen.has(normalize(code))) {
          next[`mate-${i}`] = "This code is already on the team";
        }
        seen.add(normalize(code));
      });
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const credentials = { leaderCode: normalize(leaderCode), leaderEmail: leaderEmail.trim() };
      const response =
        mode === "new"
          ? await registerTeam({ ...credentials, memberCodes: teammates.map(normalize), tracks })
          : await addTeamTracks({ ...credentials, tracks });
      if (!response.success) {
        setSubmitError(response.error || "Unable to register your team. Please try again.");
        return;
      }
      setResult(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Unable to reach the server. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTeamCode = async () => {
    if (!result?.teamId) return;
    try {
      await navigator.clipboard.writeText(result.teamId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the code is on screen and in everyone's email.
    }
  };

  if (result?.success && result.teamId) {
    const leader = result.members?.find((member) => member.isLeader);
    const isUpdate = Boolean(result.addedTracks?.length);
    return (
      <div className="glass-dark rounded-3xl border border-pink/40 p-6 text-center shadow-[0_0_50px_rgba(255,126,182,0.15)] animate-[fadeUp_0.6s_ease-out_forwards] sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-pink/40 bg-pink/10 text-pink-ink">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-pink-ink">
          <Sparkles className="h-3.5 w-3.5" />
          {isUpdate ? "Tracks Added" : "Team Registered"}
        </div>
        <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {isUpdate ? (
            <>
              Now also in <span className="text-gradient">{result.addedTracks!.map(trackLabel).join(" & ")}</span>
            </>
          ) : (
            <>
              You&apos;re in the <span className="text-gradient">Hackathon</span>!
            </>
          )}
        </h3>

        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-pink/40 bg-pink/10 p-4 text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pink-ink">Your team code</p>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/80 px-3 py-2">
            <span className="font-mono text-xl font-bold text-ink">{result.teamId}</span>
            <button
              type="button"
              onClick={copyTeamCode}
              className="inline-flex items-center gap-1.5 rounded-full border border-pink/40 bg-pink/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-pink-ink transition-colors hover:border-pink"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-pink-ink">Entered in</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.tracks?.map((id) => (
              <span
                key={id}
                className="rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-semibold text-ink"
              >
                {trackLabel(id)}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">This one code works for every track your team is in.</p>
        </div>

        <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
          {result.members?.map((member) => (
            <li
              key={member.ticketId}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/50 px-4 py-3"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{member.fullName}</span>
                <span className="block font-mono text-[11px] text-muted">{member.ticketId}</span>
              </span>
              {member.isLeader ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-pink/40 bg-pink/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-pink-ink">
                  <Crown className="h-3 w-3" />
                  Leader
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-lg text-sm text-muted">
          {result.emailStatus === "sent"
            ? "Everyone on the team has been emailed."
            : result.emailStatus === "partial"
              ? "This is saved, but some emails didn't go through. Share the team code with your teammates."
              : "This is saved, but we couldn't send emails just now. Save the team code above and share it with your team."}{" "}
          Further hackathon updates will go to{" "}
          {leader ? <strong className="text-ink">{leader.fullName}</strong> : "the team leader"}.
        </p>
      </div>
    );
  }

  const submitLabel =
    mode === "add" ? "Add tracks" : teamSize === 1 ? "Register solo" : `Register team of ${teamSize}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-dark space-y-8 rounded-3xl p-6 sm:p-9">
      {/* New team, or more tracks for an existing one */}
      <div role="group" aria-label="What would you like to do?" className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-surface-2/40 p-1">
        {(
          [
            ["new", "Register a new team"],
            ["add", "Add tracks to my team"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => switchMode(value)}
            className={cn(
              "rounded-xl px-3 py-2.5 text-xs font-bold transition-colors sm:text-sm",
              mode === value
                ? "bg-pink/15 text-pink-ink shadow-[inset_0_0_0_1px_rgba(255,126,182,0.4)]"
                : "text-ink-dim hover:bg-surface-2 hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border-b border-line pb-5">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-pink-ink">
          <Users className="h-3.5 w-3.5" />
          <span>
            Teams of {hackathon.minTeamSize}–{hackathon.maxTeamSize} · one code for all tracks
          </span>
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {mode === "new" ? "Register your team" : "Enter more tracks"}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {mode === "new" ? (
            <>
              Everyone on the team needs a fest registration first. Use the QFF code from each person&apos;s pass.
              Whoever fills in this form is the team leader and will receive all further hackathon updates.{" "}
              <Link href="/registration" className="font-semibold text-pink-ink underline underline-offset-4">
                Not registered for the fest yet?
              </Link>
            </>
          ) : (
            <>
              Already registered a team? The team leader can enter it in more tracks here. Your team code stays the
              same and everyone on the team is emailed.
            </>
          )}
        </p>
      </div>

      {/* Leader */}
      <fieldset className="space-y-4">
        <legend className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Crown className="h-4 w-4 text-pink-ink" />
          You, the team leader
        </legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="team-leader-code" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
              Your QFF code <span className="text-pink-ink">*</span>
            </label>
            <input
              id="team-leader-code"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="QFF-9A4F2C"
              value={leaderCode}
              onChange={(e) => setLeaderCode(e.target.value.toUpperCase())}
              maxLength={20}
              aria-invalid={Boolean(errors.leaderCode)}
              className={cn(inputClass(Boolean(errors.leaderCode)), "font-mono uppercase")}
            />
            <FieldError message={errors.leaderCode} />
          </div>
          <div>
            <label htmlFor="team-leader-email" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
              Your registered email <span className="text-pink-ink">*</span>
            </label>
            <input
              id="team-leader-email"
              type="email"
              autoComplete="email"
              placeholder="name@university.edu"
              value={leaderEmail}
              onChange={(e) => setLeaderEmail(e.target.value)}
              maxLength={LIMITS.email}
              aria-invalid={Boolean(errors.leaderEmail)}
              className={inputClass(Boolean(errors.leaderEmail))}
            />
            <FieldError message={errors.leaderEmail} />
          </div>
        </div>
        <p className="text-xs text-muted">
          Lost your code?{" "}
          <Link href="/retrieve-pass" className="font-semibold text-pink-ink underline underline-offset-4">
            Get your pass emailed again
          </Link>
          .
        </p>
      </fieldset>

      {/* Tracks */}
      <fieldset className="space-y-4" aria-describedby={errors.tracks ? "team-tracks-error" : undefined}>
        <legend className="flex w-full items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Layers className="h-4 w-4 text-pink-ink" />
            {mode === "new" ? "Tracks" : "Tracks to add"}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Pick one or more</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {hackathon.tracks.map((track) => {
            const checked = tracks.includes(track.id);
            return (
              <label
                key={track.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-pink/60",
                  checked
                    ? "border-pink/60 bg-pink/10 text-ink"
                    : errors.tracks
                      ? "border-danger/60 bg-danger/5 text-ink-dim"
                      : "border-line bg-surface-2/50 text-ink-dim hover:border-pink/40 hover:text-ink",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTrack(track.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                    checked ? "border-pink bg-pink-fill text-white" : "border-line bg-surface",
                  )}
                >
                  {checked ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="text-sm font-bold">{track.label}</span>
              </label>
            );
          })}
        </div>
        <FieldError id="team-tracks-error" message={errors.tracks} />
        <p className="text-xs text-muted">Open to everyone, whatever your experience. Your team code covers every track you enter.</p>
      </fieldset>

      {/* Teammates (new teams only) */}
      {mode === "new" ? (
        <fieldset className="space-y-4">
          <legend className="flex w-full items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Users className="h-4 w-4 text-pink-ink" />
              Teammates
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Team size {teamSize} / {hackathon.maxTeamSize}
            </span>
          </legend>

          {teammates.length === 0 ? (
            <p className="text-sm text-muted">
              Going solo? That&apos;s allowed. Add up to {MAX_TEAMMATES} teammates otherwise.
            </p>
          ) : (
            <div className="space-y-4">
              {teammates.map((code, i) => (
                <div key={i}>
                  <label htmlFor={`team-mate-${i}`} className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                    Teammate {i + 1} QFF code
                  </label>
                  <div className="flex items-start gap-2">
                    <input
                      id={`team-mate-${i}`}
                      type="text"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="QFF-XXXXXX"
                      value={code}
                      onChange={(e) =>
                        setTeammates((list) => list.map((item, j) => (j === i ? e.target.value.toUpperCase() : item)))
                      }
                      maxLength={20}
                      aria-invalid={Boolean(errors[`mate-${i}`])}
                      className={cn(inputClass(Boolean(errors[`mate-${i}`])), "font-mono uppercase")}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTeammates((list) => list.filter((_, j) => j !== i));
                        setErrors({});
                      }}
                      aria-label={`Remove teammate ${i + 1}`}
                      className="mt-2 grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-danger/60 hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <FieldError message={errors[`mate-${i}`]} />
                </div>
              ))}
            </div>
          )}

          {teammates.length < MAX_TEAMMATES ? (
            <button
              type="button"
              onClick={() => setTeammates((list) => [...list, ""])}
              className="inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-5 py-2.5 text-sm font-bold text-pink-ink transition-colors hover:border-pink"
            >
              <Plus className="h-4 w-4" />
              Add a teammate
            </button>
          ) : null}
        </fieldset>
      ) : null}

      {submitError ? (
        <div role="alert" className="rounded-2xl border border-danger/50 bg-danger/10 p-4 font-mono text-xs text-danger">
          <p className="flex items-center gap-2 font-bold">
            <AlertCircle className="h-4 w-4" />
            {mode === "new" ? "Couldn't register your team" : "Couldn't add tracks"}
          </p>
          <p className="mt-1 text-ink-dim">{submitError}</p>
        </div>
      ) : null}

      <div className="flex justify-end border-t border-line pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-pink-fill px-8 py-3.5 font-display text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(208,38,112,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-fill-hover disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {mode === "new" ? "Registering team..." : "Adding tracks..."}
            </>
          ) : (
            <>
              {submitLabel}
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
