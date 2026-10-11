import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSphere } from "@/components/ui/HeroSphere";
import { Section } from "@/components/ui/Section";
import { ReferralForm } from "@/components/referral/ReferralForm";
import { event } from "@/data/event";

export const metadata: Metadata = {
  title: "Become a Referrer",
  description: "Invite your community to PLUS Qiskit Fall Fest 2026. Sign up as a referrer and get your personal referral code and invitation link.",
};

export default function ReferralPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        <section className="relative px-6 pb-12 pt-32 sm:px-10 sm:pt-40 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <Link href="/#top" className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2/60 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-dim hover:border-pink/50 hover:text-pink-ink">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to Fest Overview
            </Link>
            <div className="mt-8 grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-dim">Quantum is better together</p>
                <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-pink-ink sm:text-5xl lg:text-6xl">Invite. Connect.<br />Make an impact.</h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">Bring your friends and campus community to {event.fullName}. Become a referrer and get your own code to share the fest.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim"><MapPin className="h-3.5 w-3.5 text-pink-ink" aria-hidden />{event.venueName}</span>
                  <span className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim"><Calendar className="h-3.5 w-3.5 text-pink-ink" aria-hidden />{event.dates}</span>
                  <span className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3.5 py-2 font-mono text-xs text-ink-dim"><Users className="h-3.5 w-3.5 text-pink-ink" aria-hidden />Open to every campus</span>
                </div>
              </div>
              <div className="hidden lg:col-span-5 lg:block" aria-hidden>
                <div className="glass-dark relative mx-auto aspect-square max-w-[320px] overflow-hidden rounded-full p-4 shadow-[0_0_40px_rgba(138,63,252,0.15)]"><HeroSphere /></div>
              </div>
            </div>
          </div>
        </section>
        <Section id="form-section" bordered className="bg-surface/20"><ReferralForm /></Section>
        <Section id="referral-faq" bordered>
          <h2 className="font-display text-3xl font-bold text-ink">A few things to know</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              ["Do I need to attend?", "You can help spread the word without attending. If you would like to join the fest, complete attendee registration separately."],
              ["How do referrals count?", "A referral is counted when someone successfully registers with your code. Your invitation link fills the code in for them."],
              ["Can I get my code again?", "Yes. Submit the referrer form using the same email address and you will receive the same referral code."],
            ].map(([question, answer]) => <div key={question} className="rounded-2xl border border-line bg-surface-2/40 p-6"><h3 className="font-display text-lg font-bold text-ink">{question}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{answer}</p></div>)}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
