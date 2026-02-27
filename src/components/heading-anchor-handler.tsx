"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// Handles clicks on heading anchor links (the link icons injected by
// rehype-autolink-headings). Copies the permalink and shows a toast.
export function HeadingAnchorHandler() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // Heading anchors are identified by a[aria-hidden] — see globals.css
      const anchor = (e.target as HTMLElement).closest(
        ".markdown-body :is(h1, h2, h3, h4) > a[aria-hidden]",
      );
      if (!anchor) return;

      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (!href) return;

      // Update URL hash without scrolling
      history.replaceState(null, "", href);

      // Copy the full permalink
      const url = `${window.location.origin}${window.location.pathname}${href}`;
      navigator.clipboard.writeText(url).then(() => {
        toast("Link copied to clipboard", { id: "anchor-copy", duration: 2000 });
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
