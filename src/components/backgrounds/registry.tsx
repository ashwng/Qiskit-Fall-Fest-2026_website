import type { ComponentType } from "react";

import { MigrationScene } from "./MigrationScene";
import { LatticeScene } from "./LatticeScene";
import { InterferenceScene } from "./InterferenceScene";
import { BlochScene } from "./BlochScene";
import { StillScene } from "./StillScene";

export type BackgroundId =
  | "migration"
  | "lattice"
  | "interference"
  | "bloch"
  | "still";

export type BackgroundOption = {
  id: BackgroundId;
  label: string;
  /** One line describing the scene, for whoever picks between them. */
  note: string;
  Scene: ComponentType;
};

/**
 * Lattice ships; the rest stay reachable at `?bg=<id>` so the team can still
 * compare them on the real page without a control in the corner.
 */
export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: "migration",
    label: "Migration",
    note: "The fest's own birds crossing a periwinkle sky",
    Scene: MigrationScene,
  },
  {
    id: "lattice",
    label: "Lattice",
    note: "A qubit register lit by a travelling probability wave",
    Scene: LatticeScene,
  },
  {
    id: "interference",
    label: "Interference",
    note: "Waveforms sliding through each other",
    Scene: InterferenceScene,
  },
  {
    id: "bloch",
    label: "Bloch",
    note: "Precessing great circles from the badge pictogram",
    Scene: BlochScene,
  },
  {
    id: "still",
    label: "Still",
    note: "No motion — gradient only",
    Scene: StillScene,
  },
];

export const DEFAULT_BACKGROUND: BackgroundId = "lattice";

export function isBackgroundId(value: unknown): value is BackgroundId {
  return BACKGROUNDS.some((option) => option.id === value);
}
