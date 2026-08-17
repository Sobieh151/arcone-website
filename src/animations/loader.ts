// Loading-screen timing + motion values.

export const loaderConfig = {
  // Total time the progress bar takes to reach 100%, in ms.
  durationMs: 1600,
  // Extra delay after hitting 100% before the screen starts exiting.
  exitDelayMs: 400,
};

export const loaderExitTransition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const logoRevealTransition = { duration: 1.4, ease: "easeOut" as const };

export const sweepTransition = { duration: 1.6, ease: "easeInOut" as const };
