"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArcMarkGlyph } from "@/components/icons/arc-mark";
import { mainNav } from "@/content/navigation";
import { primaryCta } from "@/content/shared";
import { useLenis } from "@/components/providers/smooth-scroll";
import { Button } from "@/components/buttons/button";
import { IconButton } from "@/components/buttons/icon-button";
import { Magnetic } from "@/components/buttons/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useMarkSpin } from "@/lib/use-mark-spin";
import { useAppReady } from "@/components/providers/app-ready";
import { heroSequence } from "@/animations/hero";
import {
  navHideTransition,
  navPillTransition,
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
        <nav className="mx-auto grid w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center">
          {/* LEFT — the mark alone, sitting directly on the page (no
              pill/background of its own). */}
          <Link href="/" data-cursor-hover aria-label="ARCone" className="justify-self-start" onFocus={onMarkFocus}>
            {/* Pointer/click handlers live on this span (the actual spin
                target, matching the ref) rather than the Link — a click
                still bubbles up and navigates normally, this just also
                kicks the spin. onFocus stays on the Link above: a plain
                <span> child is never itself focusable, so it wouldn't
                fire when Tab lands on the anchor around it. */}
            <span
              ref={markSpinRef}
              className="block h-[30px] w-[30px]"
              onPointerEnter={onMarkPointerEnter}
              onPointerMove={onMarkPointerMove}
              onPointerLeave={onMarkPointerLeave}
              onClick={onMarkClick}
            >
              <ArcMarkGlyph className="h-full w-full" />
            </span>
          </Link>

          {/* CENTRE — links and the CTA together in one pill, width fits
              its own content rather than stretching full-width. Hidden
              below md: there's no room for a whole pill of links at
              mobile widths, so the menu toggle on the right is the only
              way in there — see "opens the full menu at every
              breakpoint" below for why that toggle isn't itself
              md:hidden the way this pill is. */}
          <div className="nav-pill hidden items-center gap-1 justify-self-center md:flex">
            <ul className="flex items-center">
              {mainNav.map((link) => {
                const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor-hover
                      aria-current={active ? "page" : undefined}
                      className={cn("nav-link relative block rounded-full", active && "nav-link--active")}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-white/8"
                          transition={navPillTransition}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Magnetic strength={0.3} className="inline-flex">
              <Button href={primaryCta.href} size="sm" icon={<ArrowUpRight size={14} />}>
                {primaryCta.label}
              </Button>
            </Magnetic>
          </div>

          {/* The menu stays available at every breakpoint and sits with the
              rest of the header controls rather than floating on its own. */}
          <div className="nav-tools flex items-center justify-self-end">
            <IconButton
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              onClick={() => setMenuOpen((v) => !v)}
              icon={menuOpen ? <X size={18} /> : <Menu size={18} />}
            />
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 backdrop-blur-xl"
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
            <Button href={primaryCta.href} className="w-fit" icon={<ArrowUpRight size={16} />}>
              {primaryCta.label}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
