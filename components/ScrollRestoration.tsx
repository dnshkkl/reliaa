"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollRestorationInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    const key = `scroll:${pathname}${search ? `?${search}` : ""}`;

    // Continuously save scroll position to sessionStorage (one write per frame).
    // We do this on every scroll rather than in the cleanup, because Next.js's
    // internal scroll logic can fire before React's cleanup, zeroing the value.
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        sessionStorage.setItem(key, String(window.scrollY));
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const saved = sessionStorage.getItem(key);
    const targetY = saved !== null ? parseInt(saved, 10) : -1;

    if (targetY > 0) {
      // ── Back navigation: restore saved position ──────────────────────────
      // ResizeObserver fires exactly when the page grows tall enough,
      // covering the case where images/cards haven't sized yet.
      let resolved = false;
      let timeoutId: ReturnType<typeof setTimeout>;

      const restore = () => {
        if (resolved) return;
        resolved = true;
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
        window.scrollTo({ top: targetY, behavior: "instant" });
      };

      const resizeObserver = new ResizeObserver(() => {
        if (
          document.documentElement.scrollHeight >=
          targetY + window.innerHeight
        ) {
          restore();
        }
      });
      resizeObserver.observe(document.body);

      // Check immediately — fixed aspect-ratio cards already set full height.
      if (
        document.documentElement.scrollHeight >=
        targetY + window.innerHeight
      ) {
        restore();
      }

      // Safety net if the page never grows tall enough.
      timeoutId = setTimeout(restore, 1500);

      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
        window.removeEventListener("scroll", onScroll);
      };
    } else {
      // ── Forward / fresh navigation: scroll to top ────────────────────────
      // Next.js skips its own scroll-to-top when a sticky/fixed element is
      // present in the layout. We compensate here so every new page opens
      // at the top regardless.
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, searchParams]);

  return null;
}

export default function ScrollRestoration() {
  return (
    <Suspense fallback={null}>
      <ScrollRestorationInner />
    </Suspense>
  );
}
