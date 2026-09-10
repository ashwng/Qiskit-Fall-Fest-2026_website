/**
 * A run-up to the hackathon, using IBM's own material.
 *
 * Everything here is first-party — IBM Quantum Learning and the Qiskit docs —
 * rather than a third-party summary of it, and every URL was checked before it
 * shipped. Ordered as a path: understand the maths, run something real, then
 * the algorithm families a 24-hour problem is likely to want.
 */
export interface LearnStep {
  id: string;
  step: string;
  title: string;
  description: string;
  href: string;
  source: string;
  effort: string;
}

export const learnIntro =
  "You do not need any of this to take part — the workshops start from nothing. But if you would rather arrive already writing circuits, this is the order IBM teaches them in.";

export const learnSteps: LearnStep[] = [
  {
    id: "basics",
    step: "01",
    title: "Basics of Quantum Information",
    description:
      "Qubits, measurement and entanglement, built up from the linear algebra rather than from analogies. The foundation every later course assumes.",
    href: "https://learning.quantum.ibm.com/course/basics-of-quantum-information",
    source: "IBM Quantum Learning",
    effort: "Course",
  },
  {
    id: "hello-world",
    step: "02",
    title: "Run your first circuit on hardware",
    description:
      "Build a circuit in Qiskit and execute it on a real IBM quantum computer. The fastest route from reading about it to having run one.",
    href: "https://quantum.cloud.ibm.com/docs/en/guides/hello-world",
    source: "Qiskit documentation",
    effort: "~30 min",
  },
  {
    id: "practice",
    step: "03",
    title: "Quantum Computing in Practice",
    description:
      "Working with utility-scale circuits: transpilation, running at scale, and the noise you actually have to design around.",
    href: "https://learning.quantum.ibm.com/course/quantum-computing-in-practice",
    source: "IBM Quantum Learning",
    effort: "Course",
  },
  {
    id: "variational",
    step: "04",
    title: "Variational Algorithm Design",
    description:
      "VQE, QAOA and the ansatz-plus-optimiser pattern most hackathon problems end up reaching for. Worth skimming even if you stop at step two.",
    href: "https://learning.quantum.ibm.com/course/variational-algorithm-design",
    source: "IBM Quantum Learning",
    effort: "Course",
  },
];

export const learnMore = [
  {
    label: "Full course catalog",
    href: "https://learning.quantum.ibm.com/catalog/courses",
  },
  { label: "Qiskit on YouTube", href: "https://www.youtube.com/@qiskit" },
];
