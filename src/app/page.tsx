import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { DetailsSection } from "@/components/sections/DetailsSection";
import { HackathonSection } from "@/components/sections/HackathonSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { SpeakersSection } from "@/components/sections/SpeakersSection";
import { CollaborationsSection } from "@/components/sections/CollaborationsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { SocialsSection } from "@/components/sections/SocialsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DetailsSection />
        <HackathonSection />
        <ScheduleSection />
        <SpeakersSection />
        <CollaborationsSection />
        <TeamSection />
        <SocialsSection />
      </main>
      <Footer />
    </>
  );
}
