"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Copy, Loader2, Users } from "lucide-react";
import { registerReferrer, type ReferralResult } from "@/app/actions/referral";
import { LIMITS } from "@/lib/validation";

const fields = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name", placeholder: "e.g. Marie Curie", maxLength: LIMITS.fullName },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", placeholder: "name@university.edu", maxLength: LIMITS.email },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", placeholder: "+91 98765 43210", maxLength: LIMITS.phone },
  { name: "institution", label: "Institution / university", type: "text", autoComplete: "organization", placeholder: "e.g. BITS Pilani", maxLength: LIMITS.institution },
] as const;

export function ReferralForm() {
  const [shareLink, setShareLink] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [result, formAction, pending] = useActionState<ReferralResult, FormData>(async (previous, data) => {
    try {
      const next = await registerReferrer(previous, data);
      if (next.referralCode) {
        setShareLink(new URL(`/registration?ref=${next.referralCode}`, window.location.origin).href);
      }
      return next;
    } catch {
      return { error: "Couldn't connect. Please try submitting again." };
    }
  }, {});

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label} copied!`);
    } catch {
      setCopyMessage("Copy wasn't available. Select the code or link and copy it manually.");
    }
  }

  if (result.referralCode) {
    const registrationPath = `/registration?ref=${encodeURIComponent(result.referralCode)}`;
    return (
      <div className="glass-dark mx-auto max-w-2xl rounded-3xl border border-pink/40 p-6 text-center shadow-[0_0_50px_rgba(255,126,182,0.15)] sm:p-10">
        <CheckCircle2 className="mx-auto h-12 w-12 text-pink-ink" aria-hidden />
        <p role="status" className="mt-5 font-mono text-xs uppercase tracking-widest text-pink-ink">Your referral code is ready</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-ink">Let&apos;s grow the quantum community.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">Share your code with friends and classmates. They can enter it when registering, or use your link to fill it in automatically.</p>
        <div className="mt-8 rounded-2xl border border-pink/40 bg-pink/10 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-pink-ink">Your referral code</p>
          <p className="mt-3 break-all font-mono text-2xl font-bold tracking-widest text-ink sm:text-3xl">{result.referralCode}</p>
          <button type="button" onClick={() => copy(result.referralCode!, "Code")}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-pink">
            <Copy className="h-4 w-4" aria-hidden /> Copy code
          </button>
        </div>
        <div className="mt-5 text-left">
          <label htmlFor="referral-share-link" className="font-mono text-xs uppercase tracking-wider text-ink-dim">Your invitation link</label>
          <input id="referral-share-link" readOnly value={shareLink || registrationPath} onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full rounded-xl border border-line bg-surface-2/60 px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-pink" />
          <button type="button" onClick={() => copy(shareLink || new URL(registrationPath, window.location.origin).href, "Link")}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-ink hover:underline">
            <Copy className="h-4 w-4" aria-hidden /> Copy invitation link
          </button>
        </div>
        <p role="status" className="mt-3 min-h-5 text-sm text-pink-ink">{copyMessage}</p>
        <p className="mt-5 text-sm text-muted">Referrer signup does not reserve an attendee spot. Planning to join us?</p>
        <Link href="/registration" className="mt-3 inline-flex items-center gap-2 font-semibold text-pink-ink hover:underline">Register for the fest <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_2fr]">
      <aside className="rounded-3xl border border-line bg-surface-2/40 p-6 sm:p-8">
        <Users className="h-8 w-8 text-pink-ink" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-bold text-ink">A small invite.<br />A bigger community.</h2>
        <ol className="mt-6 space-y-6">
          {[
            ["Sign up", "Tell us a little about yourself and your institution."],
            ["Get your code", "Your personal referral code is ready as soon as you sign up."],
            ["Spread the word", "Share your invitation link. Each completed registration using your code counts as a referral."],
          ].map(([title, description], index) => (
            <li key={title} className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-pink/30 bg-pink/10 font-mono text-xs text-pink-ink">0{index + 1}</span>
              <div><h3 className="font-semibold text-ink">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{description}</p></div>
            </li>
          ))}
        </ol>
      </aside>
      <form action={formAction} className="glass-dark rounded-3xl p-6 sm:p-9" aria-busy={pending}>
        <div className="border-b border-line pb-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-ink">Referrer profile</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">Become a referrer</h2>
          <p className="mt-2 text-sm text-muted">No attendee registration needed. All fields are required.</p>
        </div>
        <fieldset disabled={pending} className="mt-6 space-y-6 disabled:opacity-70">
          <div className="grid gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={`ref-${field.name}`} className="block font-mono text-xs uppercase tracking-wider text-ink-dim">{field.label} <span className="text-pink-ink">*</span></label>
                <input {...field} id={`ref-${field.name}`} required aria-invalid={Boolean(result.errors?.[field.name])}
                  aria-describedby={result.errors?.[field.name] ? `ref-${field.name}-error` : undefined}
                  className="mt-2 w-full rounded-xl border border-line bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-pink focus:outline-none focus:ring-1 focus:ring-pink/50" />
                {result.errors?.[field.name] && <p id={`ref-${field.name}-error`} className="mt-2 text-xs text-danger">{result.errors[field.name]}</p>}
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-5">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-dim">
              <input type="checkbox" name="agreedToTerms" required className="mt-1 h-4 w-4 shrink-0 accent-pink-ink" aria-describedby="ref-terms-error" />
              <span>I agree to abide by the BITS Pilani &amp; IBM Quantum Code of Conduct, respect community guidelines, and share invitations respectfully.</span>
            </label>
            <p id="ref-terms-error" className="mt-2 text-xs text-danger">{result.errors?.agreedToTerms}</p>
          </div>
          {result.error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger"><AlertCircle className="h-4 w-4 shrink-0" aria-hidden />{result.error}</p>}
          <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pink-fill px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-pink-fill-hover disabled:cursor-wait sm:w-auto">
            {pending ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden />Creating your code…</> : <>Get my referral code <ArrowRight className="h-4 w-4" aria-hidden /></>}
          </button>
        </fieldset>
        <p className="mt-4 text-xs leading-relaxed text-muted">Already signed up as a referrer? Submit with the same email to get your existing code.</p>
      </form>
    </div>
  );
}
