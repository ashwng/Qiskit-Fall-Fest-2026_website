"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Loader2, Mail, RotateCcw, Ticket } from "lucide-react";
import { LIMITS } from "@/lib/validation";
import type { PassLookupResponse } from "@/types";

export function PassLookupForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (confirmation) {
      resultHeading.current?.focus();
      resultHeading.current?.scrollIntoView({ block: "start" });
    }
  }, [confirmation]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as PassLookupResponse;
      if (!response.ok || !result.success) {
        setError(result.success ? "Unable to request your pass. Please try again." : result.error);
        return;
      }
      setConfirmation(result.message);
      setEmail("");
    } catch {
      setError("Unable to request your pass right now. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (confirmation) {
    return (
      <div className="glass-dark mx-auto max-w-xl rounded-3xl p-6 text-center sm:p-9">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-pink/30 bg-pink/10 text-pink-ink">
          <Mail aria-hidden className="h-7 w-7" />
        </div>
        <h2 ref={resultHeading} tabIndex={-1} className="scroll-mt-32 font-display text-2xl font-bold text-ink focus:outline-none">
          Check your email
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{confirmation}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">The PDF includes your QFF entry code and campus entry requirements. Save it on your phone or print a copy.</p>
        <button
          type="button"
          onClick={() => { setConfirmation(null); setError(null); }}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-dim transition-colors hover:border-pink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Request another pass
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-dark mx-auto max-w-xl space-y-6 rounded-3xl p-6 sm:p-9" aria-busy={isLoading}>
      <div>
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-pink/30 bg-pink/10 text-pink-ink">
          <Ticket aria-hidden className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">Email me my pass</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">Enter the email address you used to register. We&apos;ll send your pass as a PDF attachment.</p>
      </div>
      <div>
        <label htmlFor="pass-email" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">Registered email address</label>
        <input
          id="pass-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={LIMITS.email}
          disabled={isLoading}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          className="mt-2 w-full rounded-xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-pink focus:ring-1 focus:ring-pink/50 disabled:opacity-60"
        />
      </div>
      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink-fill px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-pink-fill-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink disabled:cursor-wait disabled:opacity-60"
      >
        {isLoading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden className="h-4 w-4" />}
        {isLoading ? "Requesting your pass..." : "Email my pass"}
      </button>
      <p className="text-center text-sm text-muted">
        Haven&apos;t registered yet?{" "}
        <Link href="/registration" className="font-semibold text-pink-ink underline underline-offset-4">Register here</Link>
      </p>
    </form>
  );
}
