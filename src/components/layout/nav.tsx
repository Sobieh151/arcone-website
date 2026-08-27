"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArcMarkGlyph } from "@/components/icons/arc-mark";
import { mainNav } from "@/content/navigation";
import { primaryCta } from "@/content/shared";
import { useLenis } from "@/components/providers/smooth-scroll";
import { Button } from "@/components/buttons/button";
import { Magnetic } from "@/components/buttons/magnetic";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
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
        <nav
          className="mx-auto flex w-full max-w-[1400px] items-center justify-between rounded-full border border-border px-3 py-2 backdrop-blur-md"
          style={{ background: "rgba(5, 5, 5, 0.7)" }}
        >
          <Link href="/" data-cursor-hover aria-label="ARCone" className="rounded-full p-1.5">
            <ArcMarkGlyph className="h-[26px] w-[26px]" />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {mainNav.map((link) => {
              const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor-hover
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm transition-colors",
                      active ? "text-white" : "text-gray-light hover:text-white"
                    )}
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

          <div className="flex items-center gap-2">
            {/* Always visible, including mobile — the far-right CTA sits
                right next to the menu toggle at every breakpoint. */}
            <Magnetic strength={0.3} className="inline-flex">
              <Button href={primaryCta.href} size="sm">
                {primaryCta.label}
              </Button>
            </Magnetic>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              data-cursor-hover
              className="grid h-11 w-11 place-items-center rounded-full text-white md:hidden"
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 backdrop-blur-xl md:hidden"
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
            <Button href={primaryCta.href} className="w-fit">
              {primaryCta.label}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
