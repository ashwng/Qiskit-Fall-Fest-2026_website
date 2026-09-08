"use client";

import { useSyncExternalStore } from "react";

import {
  BACKGROUNDS,
  DEFAULT_BACKGROUND,
  isBackgroundId,
  type BackgroundId,
} from "./registry";

/* ---------------------------------------------------------------------------
   The scene is fixed at DEFAULT_BACKGROUND; `?bg=<id>` overrides it so the
   other candidates stay previewable on the real page.

   Nothing is persisted. An earlier build stored the choice in localStorage for
   the picker, and keeping that would mean anyone who ever opened the picker
   silently keeps their old scene instead of the one we ship.

   The read still goes through useSyncExternalStore: the server has no query
   string, so it renders the default and the client swaps on hydration without
   a mismatch. Nothing mutates, so `subscribe` never fires.
   --------------------------------------------------------------------------- */

let current: BackgroundId | null = null;

function subscribe() {
  return () => {};
}

function getSnapshot(): BackgroundId {
  if (current === null) {
    const fromQuery = new URLSearchParams(window.location.search).get("bg");
    current = isBackgroundId(fromQuery) ? fromQuery : DEFAULT_BACKGROUND;
  }
  return current;
}

function getServerSnapshot(): BackgroundId {
  return DEFAULT_BACKGROUND;
}

/** Renders the page-wide animated background. */
export function SiteBackground() {
  const id = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const active = BACKGROUNDS.find((option) => option.id === id) ?? BACKGROUNDS[0];
  const { Scene } = active;

  return <Scene key={active.id} />;
}
