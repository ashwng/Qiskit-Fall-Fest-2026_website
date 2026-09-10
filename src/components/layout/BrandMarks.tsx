import Image from "next/image";

/**
 * The two organisation marks that flank the nav.
 *
 * qBITS runs the fest; IBM's Qiskit is what it runs on. Both sit on the island
 * surface so they read as part of the same floating layer as the nav rather
 * than as images dropped on the page.
 */

export function QbitsMark({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://github.com/qBITS-github"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="qBITS, BITS Goa — the student body running the fest"
      className={`qff-island inline-flex h-12 shrink-0 items-center rounded-full px-4 transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      {/* The mark is white-on-black artwork, so it keeps its own dark plate in
          both themes rather than being knocked out on a light background. */}
      <span className="grid place-items-center rounded-full bg-[#050509] px-3.5 py-2">
        <Image
          src="/brand/qbits.png"
          alt=""
          width={634}
          height={231}
          className="h-5 w-auto sm:h-6"
          priority
        />
      </span>
    </a>
  );
}

export function IbmMark({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://quantum.ibm.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="IBM Quantum"
      className={`qff-island h-12 shrink-0 items-center gap-2.5 rounded-full px-4 transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      {/* Set in IBM Plex — IBM's own typeface, and already loaded here — rather
          than an approximation of the eight-bar mark. Drop the official logo in
          at public/brand/ibm.svg and swap this span for an <Image>. */}
      <span className="font-mono text-base font-bold tracking-[0.14em] text-ink">
        IBM
      </span>
      <span aria-hidden className="h-4 w-px bg-line" />
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-pink-ink">
        Quantum
      </span>
    </a>
  );
}
