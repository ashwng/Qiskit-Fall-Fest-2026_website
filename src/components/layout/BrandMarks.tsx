import Image from "next/image";

/**
 * The two organisation marks that flank the nav.
 *
 * qBITS runs the fest; its wordmark sits on the page with no plate. IBM's
 * Qiskit is what it runs on, so that mark keeps the shared island treatment.
 */

export function QbitsMark({ className = "" }: { className?: string }) {
  // Transparent wordmark: white lettering in dark mode, ink lettering in light.
  const alt = "qBITS, BITS Goa — the student body running the fest";
  return (
    <span className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src="/brand/qbits-ink.png"
        alt={alt}
        width={773}
        height={259}
        className="h-11 w-auto sm:h-14 dark:hidden"
        preload
      />
      <Image
        src="/brand/qbits-white.png"
        alt={alt}
        width={773}
        height={259}
        className="hidden h-11 w-auto sm:h-14 dark:block"
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
