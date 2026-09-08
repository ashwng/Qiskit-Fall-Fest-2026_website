"use client";

import { useSyncExternalStore } from "react";

import {
  BACKGROUNDS,
  DEFAULT_BACKGROUND,
  isBackgroundId,
  type BackgroundId,
} from "./registry";
import { BackgroundPicker } from "./BackgroundPicker";

const STORAGE_KEY = "qff-background";

/* ---------------------------------------------------------------------------
   The selection lives in a tiny external store rather than in component state.
   useSyncExternalStore renders the server snapshot during hydration and swaps
   to the real one immediately after, which is exactly the behaviour we want
   here and avoids both a hydration mismatch and a setState-in-effect.
   --------------------------------------------------------------------------- */

let current: BackgroundId | null = null;
const listeners = new Set<() => void>();

/** `?bg=` beats the stored choice, so a scene can be shared as a link. */
function readPreference(): BackgroundId {
  const fromQuery = new URLSearchParams(window.location.search).get("bg");
  if (isBackgroundId(fromQuery)) return fromQuery;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isBackgroundId(stored)) return stored;
  } catch {
    // Private mode or blocked storage — fall through to the default.
  }
  return DEFAULT_BACKGROUND;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): BackgroundId {
  current ??= readPreference();
  return current;
}

function getServerSnapshot(): BackgroundId {
  return DEFAULT_BACKGROUND;
}

function setBackground(next: BackgroundId) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The choice still applies for this page view.
  }
  listeners.forEach((listener) => listener());
}

/**
 * Renders the page-wide animated background, plus — while `picker` is on — a
 * control for switching between the candidates.
 */
export function SiteBackground({ picker = false }: { picker?: boolean }) {
  const id = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const active = BACKGROUNDS.find((option) => option.id === id) ?? BACKGROUNDS[0];
  const { Scene } = active;

  return (
    <>
      <Scene key={active.id} />
      {picker ? (
        <BackgroundPicker active={active.id} onChange={setBackground} />
      ) : null}
    </>
  );
}
