"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/content/navigation";
import { primaryCta } from "@/content/shared";
import { useLenis } from "@/components/providers/smooth-scroll";
import { Button } from "@/components/buttons/button";
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const lenis = useLenis();

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

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > navScrollConfig.solidAfterPx);
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
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      animate={{ y: hidden && !menuOpen ? -96 : 0 }}
      transition={navHideTransition}
    >
      <nav
        className={cn(
          "flex w-full max-w-3xl items-center justify-between rounded-full border border-border px-3 py-2 backdrop-blur-xl transition-colors duration-500",
          scrolled ? "bg-black/60" : "bg-black/20"
        )}
      >
        <Link
          href="/"
          data-cursor-hover
          className="rounded-full px-3 py-1.5 text-sm font-semibold tracking-tight text-white"
        >
          ARC<span className="text-orange-highlight">one</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {mainNav.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
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
          <Button
            href={primaryCta.href}
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
          >
            {primaryCta.label}
          </Button>
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={MOBILE_MENU_ID}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={mobileMenuTransition}
            className="absolute left-4 right-4 top-[4.5rem] z-40 rounded-3xl border border-border bg-black/90 p-6 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-lg text-white/90 hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button
              href={primaryCta.href}
              variant="outline"
              className="mt-4 w-full rounded-xl text-lg"
            >
              {primaryCta.label}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
