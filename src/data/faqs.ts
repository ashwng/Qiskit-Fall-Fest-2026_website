export interface FAQItem {
  question: string;
  answer: string;
}

export const faqIntro =
  "Need clarification on eligibility, team formation, or hardware access? Here are answers to common questions.";

export const faqs: FAQItem[] = [
  {
    question: "Is registration really completely free?",
    answer:
      "Yes! Thanks to IBM Quantum and BITS Pilani, participation in all workshops, keynote sessions, compute hardware access, swag, and hackathon meals are 100% free for admitted students.",
  },
  {
    question: "Do I need prior quantum computing experience?",
    answer:
      "No! The workshops and lab sessions are deliberately designed from the fundamentals up. If you know basic Python and college-level linear algebra, you will be able to follow and build real quantum circuits.",
  },
  {
    question: "How do hackathon teams work? Can I register alone?",
    answer:
      "Hackathon teams can have between 1 to 4 members. You can apply as a pre-formed team or apply as an individual. We will host a dedicated team-matching session before hacking begins.",
  },
  {
    question: "Do I need a special laptop or hardware?",
    answer:
      "Any standard laptop running macOS, Linux, or Windows with a modern browser and Python 3.10+ is all you need. Quantum circuits execute remotely on IBM Quantum cloud hardware via Qiskit Runtime.",
  },
  {
    question: "Can students from universities other than BITS Pilani apply?",
    answer:
      "Yes! BITS Qiskit Fall Fest 2026 welcomes student participants from universities across the region. Hybrid livestream access will also be provided for selected keynote sessions.",
  },
];
