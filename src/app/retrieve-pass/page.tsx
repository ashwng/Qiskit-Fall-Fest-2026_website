import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/ui/Section";
import { PassLookupForm } from "@/components/registration/PassLookupForm";

export const metadata: Metadata = {
  title: "Retrieve your pass",
  description: "Already registered for QFF 2026? Request your attendee pass PDF at your registered email address.",
  robots: { index: false, follow: false },
};

export default function RetrievePassPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        <section className="px-5 pb-10 pt-32 sm:px-10 sm:pt-40 print:hidden">
          <div className="mx-auto max-w-3xl text-center">
            <Link href="/registration" className="inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-pink-ink">
              <ArrowLeft aria-hidden className="h-4 w-4" />
              Back to registration
            </Link>
            <h1 className="mt-7 font-display text-4xl font-extrabold tracking-tight text-pink-ink sm:text-5xl">Retrieve your pass</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">Already registered for QFF 2026? Get your attendee pass PDF sent to your registered email address.</p>
          </div>
        </section>
        <Section id="form-section" bordered={false} className="!pt-0">
          <PassLookupForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}
