"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Smooth top progress bar shown during page transitions.
 * Animates on every route change so navigation never feels "stuck".
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Route change finished — complete the bar
    setProgress(100);
    const t = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 350);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Animate progress while loading
    if (!loading) return;
    setProgress(15);
    const t1 = setTimeout(() => setProgress(55), 250);
    const t2 = setTimeout(() => setProgress(80), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);

  // Expose a starter for link/button clicks via a custom event,
  // plus a global click catcher so every <a> navigation shows the loader instantly
  useEffect(() => {
    const start = () => {
      setLoading(true);
      setProgress(10);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href]");
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        // Only for internal navigations, not anchors/downloads/new tabs
        if (
          href.startsWith("/") &&
          !href.startsWith("//") &&
          !anchor.hasAttribute("download") &&
          anchor.getAttribute("target") !== "_blank"
        ) {
          start();
        }
      }
    };
    window.addEventListener("kharidly:navigation-start", start);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("kharidly:navigation-start", start);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_8px_rgba(249,115,22,0.7)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: loading || progress === 100 ? 1 : 0 }}
      />
    </div>
  );
}

/** Dispatch this before programmatic navigations to show the loader immediately. */
export function startNavigationLoader() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("kharidly:navigation-start"));
  }
}

