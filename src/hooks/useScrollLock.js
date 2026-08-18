// src/hooks/useScrollLock.js — Unified Scroll Locking Hook
import { useEffect } from "react";

export default function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const html = document.documentElement;
    const body = document.body;

    html.classList.add("nav-menu-open");
    body.classList.add("nav-menu-open");

    // Pause Lenis smooth scrolling while locked
    if (window.lenis) {
      window.lenis.stop();
    }

    return () => {
      html.classList.remove("nav-menu-open");
      body.classList.remove("nav-menu-open");

      // Resume Lenis smooth scrolling when unlocked
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isLocked]);
}