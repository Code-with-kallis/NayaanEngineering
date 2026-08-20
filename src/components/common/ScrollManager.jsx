// src/components/common/ScrollManager.jsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Lenis from "lenis";

export default function ScrollManager() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  // 1. Initialize Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Smooth scroll for in-page anchor links (#section)
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
        // Fallback for invalid selectors
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      window.lenis = undefined;
      lenisRef.current = null;
    };
  }, []);

  // 2. Handle Scroll-To-Top on Route Navigation
  useEffect(() => {
    if (navType !== "POP") {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
        lenisRef.current.resize();
      } else {
        window.scrollTo(0, 0);
      }
    } else if (lenisRef.current) {
      lenisRef.current.resize();
    }
  }, [pathname, navType]);

  return null;
}