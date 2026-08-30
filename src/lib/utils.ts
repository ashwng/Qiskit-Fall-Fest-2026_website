import { clsx, type ClassValue } from "clsx";

/** Lightweight className combiner. No tailwind-merge dependency needed at this scale. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
