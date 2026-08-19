// src/hooks/useScrollLock.js
import { useEffect } from "react";

export default function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const html = document.documentElement;
    const body = document.body;

    html.classList.add("nav-menu-open");
    body.classList.add("nav-menu-open");

    // Pause Lenis smooth scroll in-place
    if (window.lenis) {
      window.lenis.stop();
    }

    return () => {
      html.classList.remove("nav-menu-open");
      body.classList.remove("nav-menu-open");

      // Resume Lenis smooth scroll
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isLocked]);
}