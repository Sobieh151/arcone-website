"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArcMarkGlyph } from "@/components/icons/arc-mark";
import { mainNav } from "@/content/navigation";
import { useLenis } from "@/components/providers/smooth-scroll";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useMarkSpin } from "@/lib/use-mark-spin";
import { useAppReady } from "@/components/providers/app-ready";
import { heroSequence } from "@/animations/hero";
import {
  navHideTransition,
  mobileMenuVariants,
  mobileMenuTransition,
  navScrollConfig,
} from "@/animations/navbar";

const MOBILE_MENU_ID = "mobile-nav-menu";

export function Nav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The nav mark's momentum spin — see use-mark-spin.ts. Direction is
  // inverted and position-relative (which side of the mark you're on/
  // moving toward), speed comes from actual pointer velocity, and the
  // "spins fast then slows down smoothly" feel is the friction decay
  // itself, not a fixed CSS easing curve. Destructured, not kept as a
  // `markSpin.X` object — same reasoning as useCarouselDrag's call site
  // in explore-work.tsx: eslint's react-hooks/refs rule flags property
  // access into an object carrying a ref (the spin target ref here).
  const {
    ref: markSpinRef,
    onPointerEnter: onMarkPointerEnter,
    onPointerMove: onMarkPointerMove,
    onPointerLeave: onMarkPointerLeave,
    onClick: onMarkClick,
    onFocus: onMarkFocus,
  } = useMarkSpin<HTMLSpanElement>();
  const lastY = useRef(0);
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();
  const appReady = useAppReady();
  // Same reasoning as Hero (see app-ready.tsx): waits for Loader to
  // actually finish instead of fading in on its own ~2.2s-from-mount
  // clock while still sitting behind Loader's opaque cover.
  const reveal = reducedMotion || appReady;

  // Close the mobile menu on route change. Adjusted during render (rather
  // than in an effect) so there's no flash of the open menu on the new page.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Lock background scroll behind the open mobile menu.
  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // Hide past `hideAfterPx` while scrolling down, return on any upward
  // scroll, and never hide near the top — `y > lastY.current` only holds
  // while actively scrolling down, so scrolling up (or sitting still)
  // always resolves to `hidden: false`.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > navScrollConfig.hideAfterPx) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Final beat (2.2s) of the homepage hero's opening sequence — the
          nav fades in last, after the scene and headline. This is
          RootLayout's one persistent Nav instance (App Router keeps the
          shared layout mounted across client-side navigations), so this
          entrance plays once per real page load, not on every route
          change. `initial={false}` under reduced motion renders it
          straight at its final opacity instead of animating in at all. */}
      <motion.header
        // `reducedMotion` is `false` on the very first render by design
        // (usePrefersReducedMotion only knows the real value post-mount,
        // to avoid an SSR hydration mismatch) — but Framer Motion reads
        // `initial` exactly once, at mount, and ignores later changes to
        // it. Without this key, a real reduced-motion user would still
        // mount with `initial={{ opacity: 0 }}` baked in (since that's
        // what the prop evaluated to before `reducedMotion` flipped true)
        // and the header would still fade in on the delay below. Keying
        // on `reducedMotion` forces a remount when it flips, so `initial`
        // gets re-evaluated with the correct value.
        key={reducedMotion ? "reduced" : "motion"}
        className="fixed inset-x-5 top-5 z-50"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0, y: hidden && !menuOpen ? -96 : 0 }}
        transition={{
          opacity: { delay: heroSequence.nav.delay, duration: heroSequence.nav.duration },
          y: navHideTransition,
        }}
      >
        {/* One pill, not three floating pieces — mark, links and the menu
            toggle all live inside it, in DOM/visual order. `justify-center`
            on this full-width row (rather than sizing the pill itself) is
            what keeps the pill's own width fit-to-content while still
            landing it in the exact horizontal centre of the viewport. */}
        <nav className="flex w-full justify-center">
          <div className="nav-pill">
            <Link
              href="/"
              data-cursor-hover
              aria-label="ARCone"
              // mr-5 is a fallback gap to the menu button for <640px,
              // where the divider+links group below (and the margin
              // that normally separates the mark from it) is hidden
              // entirely — reset to 0 once that group is back and
              // providing its own spacing, so the two gaps don't stack.
              className="nav-mark mr-5 grid place-items-center rounded-full sm:mr-0"
              onFocus={onMarkFocus}
            >
              {/* Pointer/click handlers live on this span (the actual spin
                  target, matching the ref) rather than the Link — a click
                  still bubbles up and navigates normally, this just also
                  kicks the spin. onFocus stays on the Link above: a plain
                  <span> child is never itself focusable, so it wouldn't
                  fire when Tab lands on the anchor around it. */}
              <span
                ref={markSpinRef}
                className="block h-[28px] w-[28px]"
                onPointerEnter={onMarkPointerEnter}
                onPointerMove={onMarkPointerMove}
                onPointerLeave={onMarkPointerLeave}
                onClick={onMarkClick}
              >
                <ArcMarkGlyph className="h-full w-full" />
              </span>
            </Link>

            {/* Links (+ their one flanking divider) collapse below 640px —
                there's no room for a whole link row at that width, so the
                menu button below (hidden entirely above that breakpoint —
                it would just duplicate these same three links) takes
                over as the only way to reach them. */}
            <div className="hidden items-center sm:flex">
              <span aria-hidden="true" className="nav-divider" />
              <ul className="flex items-center gap-[22px]">
                {mainNav.map((link) => {
                  const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        data-cursor-hover
                        aria-current={active ? "page" : undefined}
                        className={cn("nav-link block", active && "nav-link--active")}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="button"
              className="nav-menu-btn"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              data-cursor-hover
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={MOBILE_MENU_ID}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={mobileMenuTransition}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 backdrop-blur-xl"
            style={{ background: "rgba(5, 5, 5, 0.97)" }}
          >
            <ul className="flex flex-col items-center gap-2">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor-hover
                    className="block px-4 py-3 text-center text-3xl font-semibold tracking-tight text-white/90 transition-colors hover:text-orange-highlight"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
