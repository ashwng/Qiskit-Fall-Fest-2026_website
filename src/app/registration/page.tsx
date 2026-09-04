import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QubitSphere } from "@/components/ui/QubitSphere";
import { RegistrationForm } from "@/components/registration/RegistrationForm";
import { RegistrationPerks } from "@/components/registration/RegistrationPerks";
import { RegistrationFaqSection } from "@/components/registration/RegistrationFaqSection";
import { registrationHeader } from "@/data/registration";
import { event, eventDetails } from "@/data/event";
import { ArrowLeft, Sparkles, MapPin, Calendar, CheckCircle2, Ticket } from "lucide-react";

export const metadata: Metadata = {
    title: "Registration",
    description:
        "Register for BITS Qiskit Fall Fest 2026. Secure your free spot for three days of talks, hands-on Qiskit hardware labs, and a 24-hour quantum hackathon at BITS Pilani.",
};

export default function RegistrationPage() {
    return (
        <>
            <Navbar />

            <main className="relative min-h-screen overflow-hidden">
                {/* Circuit background overlay */}
                <div className="circuit-field pointer-events-none absolute inset-0 -z-10" />

                {/* Hero Banner for Registration */}
                <section id="print-hide-header" className="relative px-6 pb-12 pt-32 sm:px-10 sm:pt-40 lg:px-16">
                    <div className="mx-auto max-w-6xl">
                        {/* Top Back Navigation Pill & Tag */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <Link
                                href="/"
                                className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-dim transition-colors hover:border-cyan/40 hover:text-cyan"
                            >
                                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                                Back to Fest Overview
                            </Link>

                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-cyan">
                                <Sparkles className="h-3.5 w-3.5" />
                                Applications Open &middot; Fall 2026
                            </div>
                        </div>

                        {/* Header Content Grid with Bloch sphere visual */}
                        <div className="mt-8 grid items-center gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-8 animate-[fadeUp_0.6s_ease-out_forwards]">
                                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan">
                                    <span
                                        aria-hidden
                                        className="inline-block h-2.5 w-2.5 rotate-45 border border-cyan bg-cyan/20"
                                    />
                                    <span>{registrationHeader.eyebrow}</span>
                                </div>

                                <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                                    Reserve Your Spot at{" "}
                                    <span className="text-gradient">QFF 2026</span>
                                </h1>

                                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-dim sm:text-lg">
                                    {registrationHeader.description}
                                </p>

                                {/* Event Highlights Badges */}
                                <div className="mt-6 flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-1.5 font-mono text-xs text-ink-dim">
                                        <MapPin className="h-3.5 w-3.5 text-cyan" />
                                        <span>BITS Pilani KK Birla Goa Campus</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-1.5 font-mono text-xs text-ink-dim">
                                        <Calendar className="h-3.5 w-3.5 text-violet-bright" />
                                        <span>29 Oct - 1st November, 2026</span>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-1.5 font-mono text-xs text-ink-dim">
                                        <Ticket className="h-3.5 w-3.5 text-cyan" />
                                        <span>100% Free for Students</span>
                                    </div>
                                </div>

                                {/* <div className="mt-5 rounded-xl border border-line-soft bg-surface/40 p-3.5 text-xs leading-relaxed text-muted">
                                    <span className="font-mono text-cyan">Note: </span>
                                    {registrationHeader.notice}
                                </div> */}
                            </div>

                            {/* Decorative Bloch Sphere Qubit Widget */}
                            <div className="hidden lg:col-span-4 lg:block">
                                <div className="relative mx-auto aspect-square max-w-[280px]">
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-violet-bright/15 blur-3xl"
                                    />
                                    <QubitSphere className="h-full w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Interactive Registration Section */}
                <Section id="form-section" bordered className="bg-surface/20">
                    <RegistrationForm />
                </Section>

                {/* Perks & What's Included */}
                <Section id="perks" bordered>
                    <RegistrationPerks />
                </Section>

                {/* FAQ Section */}
                <Section id="faqs" bordered className="bg-surface/20">
                    <RegistrationFaqSection />
                </Section>
            </main>

            <Footer />
        </>
    );
}