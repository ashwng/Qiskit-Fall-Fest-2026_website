import type { Speaker } from "@/types";

// Photos live in public/speakers/ (square crops). Without `image` a generated
// placeholder avatar is shown. The LinkedIn button appears once `href` is set.
export const speakers: Speaker[] = [
  {
    id: "ritajit-majumdar",
    name: "Ritajit Majumdar",
    description:
      "Quantum Computing Research Scientist, IBM Quantum | Co-developed India’s first candidate for quantum advantage",
    image: "/speakers/ritajit-majumdar.jpg",
    imageSeed: "qff-speaker-ritajit-majumdar",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/ritajit-majumdar-59683442/" }],
  },
  {
    id: "indrakshi-raychowdhury",
    name: "Indrakshi Raychowdhury",
    description:
      "Led the first Indian research team for IBM Quantum Advantage Tracker",
    image: "/speakers/indrakshi-raychowdhury.jpg",
    imageSeed: "qff-speaker-indrakshi-raychowdhury",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/indrakshi-raychowdhury-834534266/" }],
  },
  {
    id: "anupama-ray",
    name: "Anupama Ray",
    description:
      "Senior Research Scientist | IBM Quantum Technical Ambassador",
    image: "/speakers/anupama-ray.jpg",
    imageSeed: "qff-speaker-anupama-ray",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/anupama-ray-55140826/" }],
  },
  {
    id: "vedangi-pathak",
    name: "Vedangi Pathak",
    description: "Research Scientist, IBM Quantum | Ph.D. Physics, UBC",
    image: "/speakers/vedangi-pathak.jpg",
    imageSeed: "qff-speaker-vedangi-pathak",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/vedangipathak/" }],
  },
  {
    id: "bhupinder-singh",
    name: "Bhupinder Singh",
    description: "Post-Quantum Cryptography @ DRDO",
    image: "/speakers/bhupinder-singh.jpg",
    imageSeed: "qff-speaker-bhupinder-singh",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/bhupendra-singh-5ab5327" }],
  },
  {
    id: "kunal-korgaonkar",
    name: "Kunal Korgaonkar",
    description: "Quantum System Design",
    image: "/speakers/kunal-korgaonkar.jpg",
    imageSeed: "qff-speaker-kunal-korgaonkar",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/kunal-korgaonkar-70171418/" }],
  },
  {
    id: "anil-prabhakar",
    name: "Prof. Anil Prabhakar",
    description:
      "Professor, IIT Madras, and Project Director, NQM-DST Hub on Quantum Communications",
    image: "/speakers/anil-prabhakar.jpg",
    imageSeed: "qff-speaker-anil-prabhakar",
    socials: [{ platform: "linkedin", href: "https://www.linkedin.com/in/anil-prabhakar-66b3b730/" }],
  },
];
