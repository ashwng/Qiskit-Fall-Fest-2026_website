import {
  Cpu,
  Award,
  BookOpen,
  Users,
  Gift,
  Coffee,
  LucideIcon,
} from "lucide-react";
import { registrationPerks } from "@/data/registration";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan">
          <span className="h-2 w-2 rotate-45 border border-cyan bg-cyan/20" />
          Pass Privileges
        </div>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Everything included with admission
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          All registered and accepted students receive full access to our IBM Quantum runtime environment,
          community mentorship, and event resources.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {registrationPerks.map((perk, i) => {
          const Icon = iconMap[perk.icon] || Cpu;
          return (
            <RevealOnScroll key={perk.id} delayMs={i * 50}>
              <div className="glass group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-5 transition-all duration-300 hover:border-cyan/40 hover:shadow-[0_0_25px_rgba(79,209,232,0.1)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-bright/10 blur-xl transition-opacity group-hover:opacity-100"
                />
                <div>
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-surface text-cyan transition-colors group-hover:border-cyan/40 group-hover:bg-cyan/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="mt-4 font-display text-base font-semibold text-ink">
                    {perk.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {perk.description}
                  </p>
                </div>
                {/* <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan/70">
                  <span>Included</span>
                  <span className="text-line">•</span>
                  <span>100% Free</span>
                </div> */}
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  );
}
