"use client";

import { useEffect } from "react";

export function HashScroller() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Content may not be in the DOM yet (streamed via Suspense),
    // so poll briefly for the target element.
    let attempts = 0;
    const maxAttempts = 20;
    const interval = setInterval(() => {
      const el = document.getElementById(hash);
      if (el) {
        clearInterval(interval);
        el.scrollIntoView({ behavior: "smooth" });
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}
