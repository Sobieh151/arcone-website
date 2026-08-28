"use client";

import { useCallback, useRef, useState, type TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { IconButton } from "@/components/buttons/icon-button";

type ClientImage = { src: string; alt: string };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * A client's full body of work — a masonry grid (CSS multi-column, not
 * CSS Grid's still-patchy native `masonry` support: each image sits in
 * whichever column is shortest so far, keeping its own natural aspect
 * ratio rather than being cropped to fit a uniform cell) that opens into
 * a full-screen lightbox on click. No case-study text here — the images
 * are the content.
 */
export function ClientImageGrid({ images }: { images: ClientImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 gap-[2px] sm:columns-2 lg:columns-3">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            data-cursor-hover
            aria-label={`Open image ${i + 1} of ${images.length}`}
            onClick={() => setLightboxIndex(i)}
            className="mb-[2px] block w-full break-inside-avoid"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- real client-supplied asset under public/clients/, natural aspect ratio is the point (next/image needs known dimensions up front). */}
            <img src={image.src} alt={image.alt} className="block w-full" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Swipe past this many px counts as a deliberate "next/previous", not
// an incidental touch wobble while trying to close/tap.
const SWIPE_THRESHOLD_PX = 50;

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: ClientImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true, onClose);
  const image = images[index];
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => onIndexChange((index + 1) % images.length), [index, images.length, onIndexChange]);
  const prev = useCallback(() => onIndexChange((index - 1 + images.length) % images.length), [index, images.length, onIndexChange]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <motion.div
      // Same Lenis-interception fix ProjectModal uses — see that
      // component for the full explanation of why this attribute is
      // load-bearing, not decorative.
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        // No stopPropagation here — this panel spans the full viewport
        // (the counter/close/prev/next controls are pinned to its
        // corners), so if it swallowed clicks itself there'd be no
        // backdrop left to click. Instead each interactive child below
        // stops its own propagation, and empty space bubbles up to the
        // backdrop's onClose.
        className="relative flex h-full w-full items-center justify-center outline-none"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          else if (e.key === "ArrowLeft") prev();
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <span className="absolute left-5 top-5 z-10 font-mono text-xs tabular-nums text-mute">
          {pad(index + 1)} / {pad(images.length)}
        </span>
        <IconButton
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          icon={<X size={18} />}
          className="absolute right-5 top-5 z-10"
        />

        {images.length > 1 && (
          <>
            <IconButton
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              icon={<ArrowLeft size={18} />}
              className="absolute left-5 top-1/2 z-10 -translate-y-1/2"
            />
            <IconButton
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              icon={<ArrowRight size={18} />}
              className="absolute right-5 top-1/2 z-10 -translate-y-1/2"
            />
          </>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element -- same as above */}
        <img
          src={image.src}
          alt={image.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[90vw] object-contain"
        />
      </div>
    </motion.div>
  );
}
