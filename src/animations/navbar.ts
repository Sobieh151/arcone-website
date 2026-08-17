// Navbar hide-on-scroll, active-pill, and mobile-menu motion values.

export const navHideTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const navPillTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const mobileMenuVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const mobileMenuTransition = { duration: 0.3 };

// Scroll thresholds that drive the navbar's show/hide + glass-solidify
// behavior — tune the feel of the nav here instead of in the component.
export const navScrollConfig = {
  solidAfterPx: 24,
  hideAfterPx: 120,
};
