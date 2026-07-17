"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const scrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Restore saved position for this path
    const saved = sessionStorage.getItem(`scroll:${pathname}`);
    if (saved) {
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => window.scrollTo(0, y));
      sessionStorage.removeItem(`scroll:${pathname}`);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      // Save current position before leaving
      sessionStorage.setItem(`scroll:${pathname}`, String(scrollY.current));
    };
  }, [pathname]);

  return null;
}
