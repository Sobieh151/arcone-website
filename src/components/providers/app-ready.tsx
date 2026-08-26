"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const AppReadyContext = createContext(false);
const SetAppReadyContext = createContext<(ready: boolean) => void>(() => {});

/**
 * True once Loader (components/Loader.tsx) has finished its own reveal.
 * The homepage hero's opening sequence, and the nav's matching entrance,
 * wait on this instead of running on a fixed delay from their own mount —
 * otherwise the whole choreographed reveal (glow, mark, headline, aura
 * hook, …) plays out and finishes on its own ~2.5s clock while it's still
 * sitting behind Loader's fully opaque cover, and the user never actually
 * sees any of it, just the fully-settled end state the instant Loader
 * clears. Loader's own timing (a 1400ms floor, an 0.08-per-frame lerp to
 * converge on 100%, then a 400ms pause before its 700ms fade) adds up to
 * ~2.6s at an absolute best case before it even starts fading — measured
 * ~4.2s on this dev server — well past when the hero's sequence would
 * otherwise have already finished.
 */
export function useAppReady() {
  return useContext(AppReadyContext);
}

/** Loader calls this once, when its own `done` state flips true. Nothing
 * else should call it — it's not a general-purpose setter. */
export function useSetAppReady() {
  return useContext(SetAppReadyContext);
}

export function AppReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return (
    <SetAppReadyContext.Provider value={setReady}>
      <AppReadyContext.Provider value={ready}>{children}</AppReadyContext.Provider>
    </SetAppReadyContext.Provider>
  );
}
