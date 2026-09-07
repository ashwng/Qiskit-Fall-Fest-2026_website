import { ChevronDown } from "lucide-react";
import { faqs, faqIntro } from "@/data/faqs";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQSection() {
  return (
    <Section id="faqs" className="relative bg-surface/30">
      <SectionHeading
        eyebrow="07 · FAQs"
        title="Everything about applying"
        description={faqIntro}
      />

      <div className="mt-12 max-w-4xl relative z-10">
        {faqs.map((faq, index) => (
          <RevealOnScroll key={faq.question} delayMs={index * 45}>
            <details className="group border-b border-line first:border-t transition-colors duration-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-bold text-ink marker:hidden transition-colors hover:text-cyan [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:text-cyan">
                {faq.question}
                <ChevronDown
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-violet-bright transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-8 pr-10 font-body text-sm leading-relaxed text-muted">
                  {faq.answer}
                </p>
              </div>
            </details>
          </RevealOnScroll>
        ))}
      </div>
    </Section>
  );
}
