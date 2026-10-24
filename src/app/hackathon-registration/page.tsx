import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import { TeamRegistrationForm } from "@/components/registration/TeamRegistrationForm";
import { event, hackathon } from "@/data/event";

export const metadata: Metadata = {
  title: "Hackathon Registration",
  description: `Register your team for the ${hackathon.duration} hackathon at ${event.fullName}.`,
};

/**
 * Registration for the hackathon, separate from fest registration.
 *
 * The header follows /registration so the two pages read as a pair. Teams are
 * built from existing fest registrations, by QFF code.
 */
export default function HackathonRegistrationPage() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden">
        <section
          id="hackathon-registration-hero"
          className="relative px-6 pb-12 pt-32 sm:px-10 sm:pt-40 lg:px-16 print:hidden"
        >
          <div className="mx-auto max-w-6xl">
            <Link
              href="/#hackathon"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface-2/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-dim transition-all hover:border-pink/50 hover:text-pink-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Back to Hackathon
            </Link>

            <div className="mt-8 animate-[fadeUp_0.6s_ease-out_forwards]">
              <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-pink-ink sm:text-5xl lg:text-6xl">
                Hackathon Registration
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim">
                  <Clock className="h-3.5 w-3.5 text-pink-ink" />
                  <span>{hackathon.duration}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim">
                  <MapPin className="h-3.5 w-3.5 text-pink-ink" />
                  <span>{event.venueName}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim">
                  <Calendar className="h-3.5 w-3.5 text-pink-ink" />
                  <span>{event.dates}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Section id="form-section" bordered className="bg-surface/20">
          <div className="mx-auto max-w-3xl">
            <TeamRegistrationForm />
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
