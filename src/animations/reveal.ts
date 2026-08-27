// Shared scroll-reveal motion values, used by components/animations/reveal.tsx.
// Change the easing/duration/distance for every reveal on the site from
// this one place.

export const revealTransition = {
  duration: 0.9,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const revealViewport = {
  once: true,
  margin: "-10% 0px -10% 0px",
};

export function revealVariants(y: number) {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };
}

// Stagger orchestration for grids/lists (Values, Services,
// Work). One parent triggers once on scroll and cascades its children in
// sequence — a choreographed group, not N independently-delayed copies
// of the same fade.
export function staggerContainer(staggerChildren = 0.08) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren: 0.05 },
    },
  };
}

export function staggerItemVariants(y = 24) {
  return {
    hidden: { opacity: 0, y, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: revealTransition,
    },
  };
}
