// Hero headline line-mask reveal (components/hero/hero.tsx).

export const heroLineVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      duration: 1,
      delay: 0.15 * i,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export const heroFadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
});
