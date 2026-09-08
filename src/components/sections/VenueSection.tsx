import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { MapPin, ExternalLink } from "lucide-react";

export function VenueSection() {
  return (
    <Section id="venue" className="relative bg-surface/30">
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[radial-gradient(ellipse_at_left,rgba(8,189,186,0.08),transparent_70%)] pointer-events-none" />

      <SectionHeading
        eyebrow="08 · Venue"
        title="Where it happens"
        description="Join us in person at our beautiful campus in Goa."
      />

      <div className="mt-14 max-w-3xl relative z-10">
        <RevealOnScroll>
          <div className="glass-dark group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_30px_rgba(8,189,186,0.15)]">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-cyan transition-colors duration-300 group-hover:bg-cyan/10 group-hover:border-cyan/40">
                <MapPin className="h-8 w-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-ink">
                  BITS Pilani, K.K. Birla Goa Campus
                </h3>
                <p className="mt-2 font-body text-base leading-relaxed text-muted max-w-lg">
                  NH 17B, Bypass, Road, Zuarinagar, Sancoale, Goa 403726, India
                </p>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=BITS+Pilani+K.K.+Birla+Goa+Campus"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-surface-2 border border-line px-6 py-3 font-display text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:border-cyan"
              >
                Open in Google Maps
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </Section>
  );
}
