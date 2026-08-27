// TiltCard / GlassCard motion tuning — cursor-reactive glass tilt, shared
// by every glass card on the site (About's stats row, via GlassCard;
// the hero badge and the project modal apply the same .glass /
// .glass-shine surface directly). See useTilt (src/lib/use-tilt.ts).

export const tiltMaxDeg = 8; // rotateX/rotateY at the card's far edge
export const tiltPerspective = 900; // px — lower reads as a sharper tilt
export const tiltSpring = { stiffness: 200, damping: 20, mass: 0.4 };
export const tiltHoverScale = 1.015;
