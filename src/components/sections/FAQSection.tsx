import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQSection() {
  return (
    <Section id="faqs">
      <SectionHeading title="FAQs" meta={`${faqs.length} questions`} />

      <div className="mt-10 max-w-4xl sm:mt-12">
        {faqs.map((faq, index) => (
          <RevealOnScroll key={faq.question} variant="side" delayMs={index * 45}>
            <details className="group border-b border-line first:border-t transition-colors duration-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-base font-bold text-ink marker:hidden transition-colors hover:text-pink-ink [&::-webkit-details-marker]:hidden focus-visible:text-pink-ink focus-visible:outline-none sm:py-6 sm:text-lg">
                {faq.question}
                <ChevronDown
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-pink-ink transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="overflow-hidden">
                <p className="max-w-[68ch] pb-7 pr-8 text-sm leading-relaxed text-muted">
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
