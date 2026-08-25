// Navbar hide-on-scroll, active-pill, and mobile-menu motion values.

export const navHideTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const navPillTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as const,
};

// Full-screen mobile panel (fixed inset-0), not a small dropdown card —
// fades/slides in as one block.
export const mobileMenuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const mobileMenuTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

// Scroll threshold that drives the navbar's hide-on-scroll-down behavior —
// tune the feel of the nav here instead of in the component. The pill's
// background is now a fixed rgba() per the nav spec, so there's no
// separate "solidify" threshold anymore.
export const navScrollConfig = {
  hideAfterPx: 120,
};
