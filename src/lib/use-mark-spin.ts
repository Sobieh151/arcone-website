"use client";

import { useCallback, useEffect, useRef, type PointerEvent, type MouseEvent } from "react";

// Per-frame velocity multiplier — how quickly the spin decays. This alone
// is what gives "spins fast, then slows down smoothly": exponential decay
// is inherently ease-out-shaped (largest absolute drop early, gentler as
// it nears rest), so there's no separate CSS easing curve layered on top.
const FRICTION = 0.94;
// How much of a pointermove's horizontal delta becomes rotational
// velocity. Inverted (see kickFromPosition/onPointerMove below) — moving
// right spins one way, left the other, like nudging a dial rather than
// dragging it directly.
const MOVE_SENSITIVITY = 0.7;
const MAX_VELOCITY = 40;
const ENTER_KICK = 22;
const CLICK_KICK = 30;
// Below this the spin is imperceptible — the rAF loop stops itself here
// instead of idling forever at a residual fraction of a degree per frame.
const STOP_THRESHOLD = 0.02;

function clamp(v: number, max: number) {
  return Math.max(-max, Math.min(max, v));
}

/**
 * A momentum-driven spin: hovering, focusing, or clicking the target
 * gives it a quick kick, and moving the pointer across it while hovered
 * spins it further — inverted and position-relative, so entering/moving/
 * clicking on the right half sends it one way and the left half the
 * other. Every frame the velocity decays by FRICTION until it settles
 * back to rest on its own; there's no fixed rotation amount or duration,
 * the whole thing is however far the accumulated velocity carries it.
 *
 * Imperative `style.transform` writes to the ref, not React state — this
 * runs every animation frame while spinning, and a state update would
 * re-render the owning component that often for nothing (same reasoning
 * as CustomCursor / use-parallax-layers / use-tilt / the capabilities
 * orbit's own pointermove handling elsewhere in this codebase). The rAF
 * loop only runs while there's still meaningful velocity — it starts on
 * the first kick and stops itself once decayed below STOP_THRESHOLD,
 * never idling permanently the way a continuous ambient loop would.
 *
 * Returns a plain object rather than something callers should keep
 * around and read properties off of inline — destructure it at the call
 * site (see nav.tsx) the same way useCarouselDrag's callers do, since
 * this carries a ref and the react-hooks/refs rule flags property access
 * into an object holding one.
 */
export function useMarkSpin<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const rotation = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef<number | null>(null);
  const raf = useRef<number | undefined>(undefined);
  // The recursive rAF call goes through this ref instead of `tick`'s own
  // name — a useCallback initializer referencing its own not-yet-assigned
  // const binding is a TDZ hazard the linter (rightly) flags, even though
  // it happens to work via closures. Reading a ref from inside an async
  // rAF callback (not during render) is exactly what refs are for.
  const tickRef = useRef<() => void>(undefined);

  const tick = useCallback(() => {
    velocity.current *= FRICTION;
    rotation.current += velocity.current;
    const el = ref.current;
    if (el) el.style.transform = `rotate(${rotation.current}deg)`;
    if (Math.abs(velocity.current) > STOP_THRESHOLD) {
      raf.current = requestAnimationFrame(() => tickRef.current?.());
    } else {
      raf.current = undefined;
    }
  }, []);
  // Assigning the ref belongs in an effect, not inline during render —
  // `tick` is stable (empty dep array) so this only really runs once in
  // practice, but the assignment itself still has to happen post-render.
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const ensureLoop = useCallback(() => {
    if (raf.current === undefined) raf.current = requestAnimationFrame(() => tickRef.current?.());
  }, []);

  const addVelocity = useCallback(
    (amount: number) => {
      velocity.current = clamp(velocity.current + amount, MAX_VELOCITY);
      ensureLoop();
    },
    [ensureLoop]
  );

  // Inverted, position-relative kick: right-of-centre spins one way,
  // left-of-centre the other.
  const kickFromPosition = useCallback(
    (clientX: number, magnitude: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const side = clientX > centerX ? -1 : 1;
      addVelocity(side * magnitude);
    },
    [addVelocity]
  );

  const onPointerEnter = useCallback(
    (e: PointerEvent<T>) => {
      lastX.current = e.clientX;
      kickFromPosition(e.clientX, ENTER_KICK);
    },
    [kickFromPosition]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      if (lastX.current !== null) {
        const deltaX = e.clientX - lastX.current;
        addVelocity(-deltaX * MOVE_SENSITIVITY);
      }
      lastX.current = e.clientX;
    },
    [addVelocity]
  );

  const onPointerLeave = useCallback(() => {
    lastX.current = null;
    // No velocity reset here — it keeps decaying naturally via the
    // already-running loop, so lifting off mid-spin still settles
    // smoothly instead of stopping dead.
  }, []);

  const onClick = useCallback(
    (e: MouseEvent<T>) => {
      kickFromPosition(e.clientX, CLICK_KICK);
    },
    [kickFromPosition]
  );

  // Keyboard focus has no pointer position to derive a side from — a
  // fixed-direction kick is the reasonable fallback so keyboard users
  // still get the same affordance.
  const onFocus = useCallback(() => {
    addVelocity(ENTER_KICK);
  }, [addVelocity]);

  return { ref, onPointerEnter, onPointerMove, onPointerLeave, onClick, onFocus };
}
