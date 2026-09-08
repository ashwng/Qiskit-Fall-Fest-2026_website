import {
  Cpu,
  Award,
  BookOpen,
  Users,
  Gift,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import { registrationPerks } from "@/data/registration";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconMap: Record<string, LucideIcon> = {
  cpu: Cpu,
  award: Award,
  "book-open": BookOpen,
  users: Users,
  gift: Gift,
  coffee: Coffee,
};

export function RegistrationPerks() {
  return (
    <div>
      <SectionHeading title="What's included" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {registrationPerks.map((perk, i) => {
          const Icon = iconMap[perk.icon] || Cpu;
          return (
            <RevealOnScroll key={perk.id} delayMs={i * 70}>
              <div className="glass-dark group h-full rounded-2xl p-7 transition-all duration-300 hover:border-pink/50 hover:shadow-[0_0_30px_rgba(255,126,182,0.1)] hover:-translate-y-1 flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface-2 text-pink-ink transition-colors duration-300 group-hover:bg-pink/10 group-hover:border-pink/30 group-hover:text-pink-ink shadow-[0_0_15px_rgba(255,126,182,0.0)] group-hover:shadow-[0_0_20px_rgba(255,126,182,0.2)]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-bold text-ink transition-colors group-hover:text-pink-ink">
                    {perk.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {perk.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-line-soft flex items-center justify-between font-mono text-[11px] text-muted">
                  <span className="uppercase tracking-widest text-pink-ink font-bold">100% Free</span>
                  <span className="text-pink-ink font-medium">Included</span>
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}

