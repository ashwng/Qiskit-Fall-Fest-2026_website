import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import ThreeBackground from "@/components/ui/QubitSphere";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { RegistrationPerks } from "@/components/registration/RegistrationPerks";
import { RegistrationFaqSection } from "@/components/registration/RegistrationFaqSection";
import { registrationHeader } from "@/data/registration";
import { ArrowLeft, Sparkles, MapPin, Calendar, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Register for PLUS Qiskit Fall Fest 2026. Secure your free spot for three days of talks, hands-on Qiskit hardware labs, and a 24-hour quantum hackathon.",
};

export default function RegistrationPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden">
        {/* Background Circuit Grid Texture */}
        <div className="circuit-field pointer-events-none absolute inset-0 -z-10" />

        {/* Hero Banner for Registration */}
        <section
          id="registration-hero"
          className="relative px-6 pb-12 pt-32 sm:px-10 sm:pt-40 lg:px-16 print:hidden"
        >
          <div className="mx-auto max-w-6xl">
            {/* Top Navigation & Status Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface-2/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-dim transition-all hover:border-pink/50 hover:text-pink-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Back to Fest Overview
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-pink-ink shadow-[0_0_15px_rgba(255,126,182,0.15)]">
                <Sparkles className="h-3.5 w-3.5 animate-pulse-glow" />
                Applications Open · Fall 2026
              </div>
            </div>

            {/* Header Content Grid */}
            <div className="mt-8 grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7 animate-[fadeUp_0.6s_ease-out_forwards]">
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-pink-ink">
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full border border-pink bg-pink/20 shadow-[0_0_8px_rgba(255,126,182,0.8)]"
                  />
                  <span className="font-mono text-pink-ink">
                    {registrationHeader.eyebrow}
                  </span>
                </div>

                <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  Reserve Your Spot at{" "}
                  <span className="text-gradient">QFF 2026</span>
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                  {registrationHeader.description}
                </p>

                {/* Event Highlights Badges */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim">
                    <MapPin className="h-3.5 w-3.5 text-pink-ink" />
                    <span>BITS Pilani KK Birla Goa Campus</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim">
                    <Calendar className="h-3.5 w-3.5 text-pink-ink" />
                    <span>Fall 2026 · Dates TBA</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim">
                    <Ticket className="h-3.5 w-3.5 text-pink-ink" />
                    <span>100% Free for Students</span>
                  </div>
                </div>
              </div>

              {/* Decorative Bloch Sphere Qubit Widget */}
              <div className="hidden lg:col-span-5 lg:block animate-[fadeUp_0.8s_ease-out_forwards]">
                <div className="relative mx-auto aspect-square max-w-[320px]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle_at_center,rgba(138,63,252,0.2),transparent_70%)] blur-2xl"
                  />
                  <div className="glass-dark relative rounded-full p-4 aspect-square overflow-hidden shadow-[0_0_40px_rgba(138,63,252,0.15)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(138,63,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(138,63,252,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    <ThreeBackground />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Interactive Registration Form Section */}
        <Section
          id="form-section"
          bordered
          className="bg-surface/20 print:border-none print:p-0 print:m-0 print:bg-transparent"
        >
          <RegistrationForm />
        </Section>

        {/* Perks & Admission Privileges */}
        <Section id="perks" bordered className="print:hidden">
          <RegistrationPerks />
        </Section>

        {/* FAQ Section */}
        <Section id="faqs" bordered className="bg-surface/20 print:hidden">
          <RegistrationFaqSection />
        </Section>
      </main>

      <Footer />
    </>
  );
}
