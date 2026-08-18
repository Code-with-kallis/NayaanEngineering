// src/components/SmoothScroll.jsx — Single Lenis Smooth Scroll Engine
import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — Initializes exactly ONE Lenis instance for the entire app.
 *
 * • Mounted once at the App root level.
 * • Uses its own requestAnimationFrame loop (no GSAP dependency).
 * • Exposes the instance on window.lenis for debugging and external access.
 * • Smooths in-page anchor navigation (e.g., #corporate-profile, legal TOC links).
 * • Properly cleans up on unmount.
 * • On touch devices, Lenis defaults to native momentum scroll (no forced desktop smoothing).
 */
export default function SmoothScroll() {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Expose for debugging and for other components to access (scroll lock, scrollTo, etc.)
    window.lenis = lenis;

    // Single rAF loop — the only animation frame for scrolling in the app
    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Smooth in-page anchor links (#section-id)
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || hash === "#!") return;

      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -70 });
        }
      } catch {
        // Fallback for invalid query selector hashes
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      // Full cleanup
      document.removeEventListener("click", handleAnchorClick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      window.lenis = undefined;
      lenisRef.current = null;
    };
  }, []);

  return null;
}
