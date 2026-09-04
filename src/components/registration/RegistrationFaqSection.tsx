"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { registrationFaqs } from "@/data/registration";
import { cn } from "@/lib/utils";

export function RegistrationFaqSection() {
  const [openId, setOpenId] = useState<string | null>(registrationFaqs[0]?.id ?? null);

  const toggle = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan">
          <HelpCircle className="h-3.5 w-3.5 text-cyan" />
          Frequently Asked Questions
        </div>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Everything about applying
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Need clarification on eligibility, team formation, or hardware access? Here are answers to common questions.
        </p>
      </div>

      <div className="space-y-3">
        {registrationFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={cn(
                "glass overflow-hidden rounded-xl border transition-all duration-200",
                isOpen ? "border-cyan/40 bg-surface/80" : "border-line hover:border-line-soft hover:bg-surface/40"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors"
              >
                <span className="font-display text-base font-medium text-ink">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-dim transition-transform duration-200",
                    isOpen && "rotate-180 border-cyan/40 text-cyan"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <div
                id={`faq-answer-${faq.id}`}
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-line-soft px-5 pb-5 pt-3 text-sm leading-relaxed text-ink-dim">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
