import Image from "next/image";

/**
 * The two organisation marks that flank the nav.
 *
 * qBITS runs the fest; its wordmark has a single black rounded plate. IBM's
 * Qiskit is what it runs on, so that mark keeps the shared island treatment.
 */

export function QbitsMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full bg-[#050509] px-3.5 py-1.5 ${className}`}
    >
      <Image
        src="/brand/qbits.png"
        alt="qBITS, BITS Goa — the student body running the fest"
        width={634}
        height={231}
        className="h-7 w-auto sm:h-8"
        preload
      />
    </span>
  );
}

export function IbmMark({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://quantum.ibm.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="IBM Quantum"
      className={`qff-island h-12 shrink-0 items-center justify-center rounded-full px-4 transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      <Image
        src="/IBM_Quantum_logotype_rev_RGB.png"
        alt="IBM Quantum"
        width={2780}
        height={440}
        className="h-4.5 w-auto sm:h-5 invert dark:invert-0"
        priority
      />
    </a>
  );
}
