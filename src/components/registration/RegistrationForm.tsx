"use client";

import { useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Download,
  Calendar,
  RotateCcw,
  CheckCircle2,
  User,
  Terminal,
  MapPin,
  Globe,
} from "lucide-react";
import { Barcode } from "@/components/ui/Barcode";
import {
  attendanceOptions,
  experienceLevels,
  quantumInterests,
  studyLevels,
  tshirtSizes,
} from "@/data/registration";
import { RegistrationFormData } from "@/types";
import { cn } from "@/lib/utils";

const initialFormData: RegistrationFormData = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  studyLevel: "",
  graduationYear: "",
  attendanceMode: "offline",
  quantumExperience: "beginner",
  interests: ["Quantum Machine Learning (QML)", "Quantum Algorithms & Complexity"],
  githubUrl: "",
  linkedinUrl: "",
  tshirtSize: "M (38\")",
  agreedToTerms: false,
};

export function RegistrationForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionPhase, setSubmissionPhase] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const updateField = <K extends keyof RegistrationFormData>(
    field: K,
    value: RegistrationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const nextInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: nextInterests };
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.institution.trim()) newErrors.institution = "College or university name is required";
      if (!formData.phone.trim()) newErrors.phone = "Contact phone number is required";
      if (!formData.attendanceMode) {
        newErrors.attendanceMode = "Please select whether you will attend offline or online";
      }
    }

    if (currentStep === 2) {
      if (!formData.agreedToTerms) {
        newErrors.agreedToTerms = "You must agree to the Code of Conduct to register";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(2);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setStep(1);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    setSubmissionPhase("Initializing quantum state register |0⟩...");

    setTimeout(() => {
      setSubmissionPhase("Allocating IBM Quantum runtime credentials...");
    }, 600);

    setTimeout(() => {
      setSubmissionPhase("Compiling attendee ticket verification hash...");
    }, 1200);

    setTimeout(() => {
      const randomHex = Math.random().toString(16).substring(2, 4).toUpperCase();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setTicketId(`${randomHex}${randomNum}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 80, behavior: "smooth" });
    }, 1800);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setStep(1);
    setIsSubmitted(false);
    setTicketId("");
  };

  // If submitted, show digital ticket pass!
  if (isSubmitted) {
    return (
      <div id="register-form" className="space-y-8 animate-[fadeUp_0.6s_ease-out_forwards]">
        <div className="rounded-2xl border border-cyan/40 bg-surface/80 p-6 text-center shadow-[0_0_50px_rgba(79,209,232,0.15)] sm:p-10 print:border-none print:bg-transparent print:p-0 print:shadow-none">
          {/* Confirmation Message (Hidden in Print) */}
          <div className="no-print">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-cyan/40 bg-cyan/10 text-cyan">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              Registration Confirmed
            </div>

            <h3 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              You&apos;re Set for QFF 2026!
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-dim">
              Your registration has been accepted into the queue. A confirmation email with workshop links
              and Discord access has been dispatched to{" "}
              <span className="font-mono text-cyan">{formData.email}</span>.
            </p>
          </div>

          {/* Digital Quantum Pass Card (Print Target) */}
          <div id="printable-pass-wrapper" className="w-full">
            <div
              id="printable-pass"
              className="relative mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-bg p-6 text-left shadow-2xl sm:p-8 print:mt-0 print:border-2 print:border-black print:bg-white print:p-6 print:shadow-none"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-bright/20 blur-3xl print:hidden"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan/15 blur-3xl print:hidden"
              />

              {/* Ticket Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-soft pb-5 print:border-slate-300">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-cyan print:text-sky-700">
                    Digital Attendee Pass
                  </span>
                  <p className="font-display text-lg font-semibold text-ink print:text-black">
                    BITS Qiskit Fall Fest 2026
                  </p>
                </div>
                <div className="rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-xs font-semibold text-cyan print:border-slate-800 print:bg-slate-100 print:text-black">
                  {ticketId}
                </div>
              </div>

              {/* Ticket Body */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted print:text-slate-600">
                    Attendee Name
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-ink print:text-black">
                    {formData.fullName}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted print:text-slate-600">
                    Attendance Format
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-cyan/40 bg-cyan/10 px-2.5 py-1 font-mono text-xs text-cyan print:border-slate-400 print:bg-slate-100 print:text-black">
                    {formData.attendanceMode === "offline" ? (
                      <>
                        <MapPin className="h-3 w-3" />
                        In-Person (Offline &middot; BITS Pilani)
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3" />
                        Virtual (Online &middot; Remote Access)
                      </>
                    )}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted print:text-slate-600">
                    University / Institution
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-ink-dim print:text-slate-900">
                    {formData.institution}
                  </p>
                </div>
              </div>

              {/* Barcode representation of registration number */}
              <div className="mt-8 rounded-xl border border-line-soft bg-surface/70 p-5 print:border-slate-300 print:bg-slate-50">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Barcode value={ticketId} className="w-full max-w-[360px]" height={54} />
                  <div className="flex w-full items-center justify-between border-t border-line-soft pt-2.5 font-mono text-[10px] text-muted print:border-slate-300 print:text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan print:bg-slate-900" />
                      QFF-2026 AUTHENTICATED
                    </span>
                    <span>Status: CONFIRMED</span>
                    <span>T-Shirt: {formData.tshirtSize.split(" ")[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons (Hidden in Print) */}
          <div id="print-hide-actions" className="no-print mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-cyan transition-colors hover:bg-cyan/20"
            >
              <Download className="h-4 w-4" />
              Print / Save Pass
            </button>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=BITS+Qiskit+Fall+Fest+2026&details=Quantum+Computing+Fest+at+BITS+Pilani&location=BITS+Pilani`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-dim transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </a>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" />
              Register Another Person
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="register-form" className="space-y-8">
      {/* Progress steps bar */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          {[
            { stepNum: 1, label: "Profile & Participation", icon: User },
            { stepNum: 2, label: "Skills & Preferences", icon: Terminal },
          ].map(({ stepNum, label, icon: StepIcon }) => {
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  if (stepNum < step) setStep(stepNum as 1 | 2);
                }}
                disabled={stepNum > step}
                className={cn(
                  "flex flex-1 items-center gap-2.5 rounded-xl p-2.5 text-left transition-colors sm:p-3",
                  isActive && "bg-surface-2/80 text-cyan",
                  isCompleted && "text-ink-dim hover:text-ink cursor-pointer",
                  !isActive && !isCompleted && "text-muted opacity-60 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-xs font-semibold transition-colors",
                    isActive && "border border-cyan bg-cyan/20 text-cyan",
                    isCompleted && "border border-violet-bright/50 bg-violet/30 text-violet-bright",
                    !isActive && !isCompleted && "border border-line bg-surface text-muted"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                </span>
                <div className="hidden sm:block">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    Step 0{stepNum}
                  </p>
                  <p className="font-display text-xs font-medium text-ink">{label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: Attendee Information */}
        {step === 1 && (
          <div className="glass space-y-6 rounded-2xl p-6 sm:p-8 animate-[fadeUp_0.4s_ease-out_forwards]">
            <div className="border-b border-line-soft pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                Step 01 &middot; Personal Details
              </span>
              <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                Attendee Information
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Please enter your academic and contact details as they should appear on your fest badge and certificate.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-fullname" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Full Name <span className="text-cyan">*</span>
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  placeholder="e.g. Marie Curie"
                  value={formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-surface/80 px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-cyan focus:outline-none",
                    errors.fullName ? "border-red-500/80 bg-red-500/5" : "border-line"
                  )}
                />
                {errors.fullName && (
                  <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg-email" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Email Address <span className="text-cyan">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="name@university.edu"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-surface/80 px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-cyan focus:outline-none",
                    errors.email ? "border-red-500/80 bg-red-500/5" : "border-line"
                  )}
                />
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg-phone" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Phone Number <span className="text-cyan">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-surface/80 px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-cyan focus:outline-none",
                    errors.phone ? "border-red-500/80 bg-red-500/5" : "border-line"
                  )}
                />
                {errors.phone && (
                  <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg-institution" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  University / College <span className="text-cyan">*</span>
                </label>
                <input
                  id="reg-institution"
                  type="text"
                  placeholder="e.g. BITS Pilani, Pilani Campus"
                  value={formData.institution}
                  onChange={(e) => updateField("institution", e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border bg-surface/80 px-4 py-3 text-sm text-ink placeholder:text-muted transition-colors focus:border-cyan focus:outline-none",
                    errors.institution ? "border-red-500/80 bg-red-500/5" : "border-line"
                  )}
                />
                {errors.institution && (
                  <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.institution}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="reg-studylevel" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Current Level of Study
                </label>
                <select
                  id="reg-studylevel"
                  value={formData.studyLevel}
                  onChange={(e) => updateField("studyLevel", e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border border-line bg-surface/80 px-4 py-3 text-sm text-ink transition-colors focus:border-cyan focus:outline-none",
                    !formData.studyLevel && "text-muted"
                  )}
                >
                  <option value="" disabled className="bg-surface text-muted">
                    Select current study level
                  </option>
                  {studyLevels.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-surface text-ink">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reg-graduationyear" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Expected Graduation Year
                </label>
                <select
                  id="reg-graduationyear"
                  value={formData.graduationYear}
                  onChange={(e) => updateField("graduationYear", e.target.value)}
                  className={cn(
                    "mt-2 w-full rounded-xl border border-line bg-surface/80 px-4 py-3 text-sm text-ink transition-colors focus:border-cyan focus:outline-none",
                    !formData.graduationYear && "text-muted"
                  )}
                >
                  <option value="" disabled className="bg-surface text-muted">
                    Select graduation year
                  </option>
                  {["2025", "2026", "2027", "2028", "2029", "2030+"].map((yr) => (
                    <option key={yr} value={yr} className="bg-surface text-ink">
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attendance Format (Online vs Offline) */}
            <div className="space-y-3 border-t border-line-soft pt-6">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Will you be attending Online or Offline? <span className="text-cyan">*</span>
                </label>
                <span className="font-mono text-[11px] text-cyan">
                  {formData.attendanceMode === "offline" ? "In-Person at BITS Pilani" : "Virtual / Remote Access"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {attendanceOptions.map((opt) => {
                  const isSelected = formData.attendanceMode === opt.id;
                  const Icon = opt.id === "offline" ? MapPin : Globe;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "relative flex cursor-pointer flex-col justify-between rounded-xl border p-4.5 transition-all duration-200",
                        isSelected
                          ? "border-cyan bg-surface-2/90 shadow-[0_0_20px_rgba(79,209,232,0.15)]"
                          : "border-line bg-surface/50 hover:border-line-soft hover:bg-surface/80"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "grid h-10 w-10 place-items-center rounded-lg border transition-colors",
                              isSelected
                                ? "border-cyan bg-cyan/15 text-cyan"
                                : "border-line bg-surface text-muted"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-display text-sm font-semibold text-ink">
                              {opt.label}
                            </p>
                            <p className="font-mono text-[11px] text-cyan">{opt.tagline}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="attendance-mode"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => updateField("attendanceMode", opt.id)}
                          className="mt-1 h-4 w-4 accent-cyan"
                        />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted">
                        {opt.description}
                      </p>
                      <div className="mt-3.5 flex items-center justify-between border-t border-line-soft pt-2.5">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                            isSelected
                              ? "border-cyan/40 bg-cyan/10 text-cyan"
                              : "border-line bg-surface text-muted"
                          )}
                        >
                          {opt.badge}
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          {opt.id === "offline" ? "BITS Pilani Campus" : "Remote via Discord"}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {errors.attendanceMode && (
                <p className="mt-1 flex items-center gap-1 font-mono text-[11px] text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.attendanceMode}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                className="group inline-flex items-center gap-2 rounded-full bg-violet-bright px-6 py-3 font-mono text-xs uppercase tracking-wider text-ink shadow-[0_0_20px_rgba(138,63,252,0.4)] transition-transform hover:-translate-y-0.5"
              >
                Continue to Skills & Preferences
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Quantum Background & Preferences */}
        {step === 2 && (
          <div className="glass space-y-6 rounded-2xl p-6 sm:p-8 animate-[fadeUp_0.4s_ease-out_forwards]">
            <div className="border-b border-line-soft pb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                Step 02 &middot; Skills & Preferences
              </span>
              <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                Quantum Background & Preferences
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Help mentors calibrate workshop pacing and prepare your welcome swag kit.
              </p>
            </div>

            {/* Experience level */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                Quantum Computing Experience Level
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {experienceLevels.map((lvl) => {
                  const isSelected = formData.quantumExperience === lvl.id;
                  return (
                    <label
                      key={lvl.id}
                      className={cn(
                        "flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all",
                        isSelected
                          ? "border-cyan bg-cyan/10 text-ink shadow-[0_0_15px_rgba(79,209,232,0.1)]"
                          : "border-line bg-surface/50 text-muted hover:border-line-soft hover:bg-surface/80"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-semibold text-ink">{lvl.label}</span>
                        <input
                          type="radio"
                          name="quantum-exp"
                          value={lvl.id}
                          checked={isSelected}
                          onChange={() => updateField("quantumExperience", lvl.id)}
                          className="accent-cyan"
                        />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{lvl.detail}</p>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Topics of Interest chips */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                Focus Areas / Interests (Select all that apply)
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {quantumInterests.map((interest) => {
                  const isChecked = formData.interests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all",
                        isChecked
                          ? "border-cyan bg-cyan/20 text-cyan shadow-[0_0_10px_rgba(79,209,232,0.2)]"
                          : "border-line bg-surface/60 text-ink-dim hover:border-line-soft hover:text-ink"
                      )}
                    >
                      {isChecked && "✓ "}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social profiles & Swag */}
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="reg-github" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  GitHub Profile (Optional)
                </label>
                <input
                  id="reg-github"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={(e) => updateField("githubUrl", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="reg-linkedin" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  id="reg-linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateField("linkedinUrl", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-cyan focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="reg-tshirtsize" className="block font-mono text-xs uppercase tracking-wider text-ink-dim">
                  Swag T-Shirt Size
                </label>
                <select
                  id="reg-tshirtsize"
                  value={formData.tshirtSize}
                  onChange={(e) => updateField("tshirtSize", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-sm text-ink focus:border-cyan focus:outline-none"
                >
                  {tshirtSizes.map((sz) => (
                    <option key={sz} value={sz} className="bg-surface text-ink">
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code of Conduct Checkbox */}
            <div className="rounded-xl border border-line bg-surface/50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-line text-cyan accent-cyan focus:ring-cyan"
                />
                <span className="text-xs leading-relaxed text-ink-dim">
                  I agree to abide by the{" "}
                  <span className="text-cyan font-semibold">BITS Qiskit Fall Fest Code of Conduct</span> and acknowledge
                  that IBM Quantum hardware credits must be used solely for educational and hackathon project exploration.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="mt-2 flex items-center gap-1 font-mono text-[11px] text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.agreedToTerms}
                </p>
              )}
            </div>

            {/* Submission buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink-dim transition-colors hover:border-cyan/50 hover:text-cyan disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-violet-bright px-8 py-3.5 font-mono text-xs uppercase tracking-widest text-ink shadow-[0_0_0_1px_rgba(138,63,252,0.4),0_18px_40px_-18px_rgba(138,63,252,0.65)] transition-all hover:-translate-y-0.5 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                    <span>{submissionPhase}</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Registration</span>
                    <span className="font-mono text-[10px] text-cyan">|ψ⟩ → |reg⟩</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
