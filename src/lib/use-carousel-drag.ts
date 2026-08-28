"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";

// Trackpad horizontal swipe (deltaX) advances the rail; a plain vertical
// mouse-wheel tick (deltaY, no meaningful deltaX) does not — it's left
// alone to scroll the page normally, same as passing over any other
// horizontal rail on the web (Netflix, etc.). Trapping vertical wheel
// into horizontal advance is what actually feels janky/fights the
// visitor; this doesn't.
const WHEEL_ADVANCE_PX = 60;
// One advance per gesture, not one per wheel tick — a single trackpad
// swipe fires many small deltaX events in quick succession, and without
// this a swipe that crosses the threshold once would otherwise keep
// re-triggering for every subsequent tick of the same gesture.
const WHEEL_COOLDOWN_MS = 350;

// Drag distance past which a release counts as "advance one card" even at
// zero velocity (a slow, deliberate drag).
const DRAG_THRESHOLD_PX = 45;
// A drag under the threshold still advances if it's moving fast enough at
// release — this is what makes a quick flick from anywhere feel like it
// "counts", not just ones that happen to cross 45px.
const VELOCITY_THRESHOLD_PX_MS = 0.5;
// Extra cards a fast flick carries past the base one-card advance — tuned
// so a brisk flick (~1.2px/ms) adds one extra card, a very fast one
// (~2.5px/ms+) adds two.
const VELOCITY_TO_EXTRA_CARDS = 0.8;
// Movement below this never counts as a drag at all — keeps a plain tap
// from being misread as a zero-distance drag.
const TAP_VS_DRAG_PX = 6;

/**
 * Physical drag-to-rotate carousel: pointer position maps 1:1 to a
 * `--drag-offset` CSS custom property (written straight to the track's
 * style, not through React state — this runs on every pointermove, and a
 * state update would re-render the whole carousel that often for
 * nothing, same reasoning as useTilt/useParallaxLayers elsewhere in this
 * codebase). The track's own 700ms transition is suppressed for the
 * duration of the drag (`isDragging` class) so cards track the pointer
 * with zero lag, then re-enabled on release so the snap-to-settled
 * position animates — that combination is what reads as "physical
 * object", not "slider".
 *
 * Release carries velocity: a fast flick advances more than one card, a
 * slow dwell past the threshold advances exactly one, and anything
 * short of both threshold and velocity snaps back to the current card.
 */
export function useCarouselDrag({
  disabled,
  onAdvance,
}: {
  disabled: boolean;
  // Wrapping (mod length) is the caller's job — see circularDistance/
  // wrapIndex below, used from explore-work.tsx — this hook only ever
  // reports a signed step count.
  onAdvance: (step: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  // Sticks around just long enough for the click handler that fires right
  // after pointerup to see it — a drag shouldn't also register as a tap
  // on whatever card the pointer happened to end up over.
  const justDraggedRef = useRef(false);

  const drag = useRef({
    pointerId: -1,
    startX: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
    moved: false,
  });

  const setOffset = useCallback((px: number) => {
    trackRef.current?.style.setProperty("--drag-offset", `${px}px`);
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      // No setPointerCapture here — see onPointerMove. Capturing eagerly,
      // on every pointerdown including a plain tap, was retargeting the
      // browser's synthetic `click` event away from whatever card button
      // the tap actually landed on (confirmed: a real click from a test
      // driver went through a card's `onClick` cleanly with this capture
      // removed, silently missed it with the capture called here) —
      // cards stopped being clickable/openable at all, only draggable.
      drag.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        lastX: e.clientX,
        lastT: performance.now(),
        velocity: 0,
        moved: false,
      };
    },
    [disabled]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (d.pointerId !== e.pointerId) return;
      const now = performance.now();
      const dt = now - d.lastT;
      if (dt > 0) d.velocity = (e.clientX - d.lastX) / dt;
      d.lastX = e.clientX;
      d.lastT = now;
      const total = e.clientX - d.startX;
      if (!d.moved && Math.abs(total) > TAP_VS_DRAG_PX) {
        // Only capture — and only start visually dragging — once this is
        // confirmed to be an actual drag, not a tap. By this point we're
        // already committed to treating the gesture as a drag, so there's
        // no click left to retarget.
        d.moved = true;
        trackRef.current?.setPointerCapture(e.pointerId);
        setIsDragging(true);
      }
      if (d.moved) setOffset(total);
    },
    [setOffset]
  );

  const endDrag = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (d.pointerId !== e.pointerId) return;
      const total = e.clientX - d.startX;
      setIsDragging(false);
      setOffset(0);

      if (d.moved) {
        justDraggedRef.current = true;
        // Only meant to catch the synthetic click the browser fires
        // immediately after this same pointerup — without an expiry it
        // stays true indefinitely (nothing else ever clears it except
        // consumeJustDragged, which only runs from an actual card click),
        // silently swallowing the *next* unrelated click on this
        // carousel, however much later that happens to be.
        window.setTimeout(() => {
          justDraggedRef.current = false;
        }, 300);
        if (Math.abs(total) > DRAG_THRESHOLD_PX || Math.abs(d.velocity) > VELOCITY_THRESHOLD_PX_MS) {
          // Dragging left (content trailing the pointer left) reveals the
          // next card from the right — advance forward.
          const direction = total < 0 ? 1 : -1;
          const extraCards = Math.floor(Math.abs(d.velocity) * VELOCITY_TO_EXTRA_CARDS);
          onAdvance(direction * (1 + extraCards));
        }
      }
      d.pointerId = -1;
    },
    [onAdvance, setOffset]
  );

  // Cheap on purpose: a ref accumulator and a ref cooldown flag, no state
  // — this can fire on every wheel tick during a gesture without
  // triggering a single extra render, only `onAdvance` (already a
  // discrete, low-frequency call) crosses into React.
  const wheel = useRef({ accumulated: 0, cooling: false });

  const onWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      if (disabled) return;
      // Only a horizontally-dominant gesture counts as "swipe the rail" —
      // a plain vertical wheel tick (deltaX ~0) is left alone so the page
      // keeps scrolling normally instead of getting trapped here.
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheel.current.cooling) return;

      wheel.current.accumulated += e.deltaX;
      if (Math.abs(wheel.current.accumulated) < WHEEL_ADVANCE_PX) return;

      onAdvance(wheel.current.accumulated > 0 ? 1 : -1);
      wheel.current.accumulated = 0;
      wheel.current.cooling = true;
      window.setTimeout(() => {
        wheel.current.cooling = false;
      }, WHEEL_COOLDOWN_MS);
    },
    [disabled, onAdvance]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onAdvance(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onAdvance(1);
      }
    },
    [onAdvance]
  );

  /** Cards check this in their own onClick to swallow the tap-like click
   * a drag release leaves behind, without swallowing a real tap. */
  const consumeJustDragged = useCallback(() => {
    if (!justDraggedRef.current) return false;
    justDraggedRef.current = false;
    return true;
  }, []);

  return {
    trackRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onWheel,
    onKeyDown,
    consumeJustDragged,
  };
}

/** Shortest signed distance from `index` to `activeIndex` around a loop
 * of `length` items — e.g. for length 5, index 4 is distance -1 from
 * active 0, not +4, so "adjacent" cards are the ones visually next to
 * the active one on the shorter side, wrap included. */
export function circularDistance(index: number, activeIndex: number, length: number) {
  let diff = index - activeIndex;
  const half = length / 2;
  if (diff > half) diff -= length;
  if (diff < -half) diff += length;
  return diff;
}

export function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}
