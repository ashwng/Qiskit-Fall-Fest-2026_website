/**
 * A field the fest has not announced yet.
 *
 * Rendering "To be announced" in the same type as real content makes an early
 * page look like a broken one. Saying it once, quietly, in the metadata voice
 * reads as a schedule rather than a gap.
 */
export function Pending({ label = "Announcing soon" }: { label?: string }) {
  return <span className="qff-pending">{label}</span>;
}

/** The placeholder string used across src/data. */
export const TBA = "To be announced";

/** True when a data field is still a placeholder rather than real content. */
export const isPending = (value?: string) => {
  const text = value?.trim().replace(/\.$/, "");
  return !text || text === TBA;
};
