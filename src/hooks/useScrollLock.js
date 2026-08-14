// src/hooks/useScrollLock.js — Unified Scroll Locking Hook
import { useEffect } from "react";

export default function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const html = document.documentElement;
    const body = document.body;

    html.classList.add("nav-menu-open");
    body.classList.add("nav-menu-open");

    return () => {
      html.classList.remove("nav-menu-open");
      body.classList.remove("nav-menu-open");
    };
  }, [isLocked]);
}