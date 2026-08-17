// Mask-reveal motion: the content slides up out of a clipped box instead
// of fading in place. Used for headlines — the moments that should read
// as deliberate, not a generic opacity+translateY fade like body copy.

export const maskRevealTransition = {
  duration: 1,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const maskRevealVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%" },
};
