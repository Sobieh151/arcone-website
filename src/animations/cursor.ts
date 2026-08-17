// Custom-cursor motion tuning: how tightly the outer ring trails the
// pointer, and how it reacts to hoverable elements.

export const cursorRingEase = 0.18; // 0–1, higher = snappier trailing

export const cursorSize = {
  base: 32,
  hover: 64,
};

export const cursorGlow = {
  base: "0 0 14px 1px rgba(232, 80, 2, 0.18)",
  hover: "0 0 30px 4px rgba(232, 80, 2, 0.35)",
};
