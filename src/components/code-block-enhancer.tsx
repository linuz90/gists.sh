"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { useEffect, useRef } from "react";

const CLIPBOARD_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>`;

const CHECK_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

interface CodeBlockEnhancerProps {
  children: React.ReactNode;
}

export function CodeBlockEnhancer({ children }: CodeBlockEnhancerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const pres = container.querySelectorAll("pre");
    const buttons: HTMLButtonElement[] = [];

    pres.forEach((pre) => {
      // Skip if already enhanced
      if (pre.parentElement?.classList.contains("code-block-wrapper")) return;

      // Wrap pre in a container so the button stays outside the scrollable area
      const wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = CLIPBOARD_SVG;

      let timeout: ReturnType<typeof setTimeout>;

      btn.addEventListener("click", async () => {
        const text = pre.textContent || "";
        await copyToClipboard(text);

        btn.innerHTML = CHECK_SVG;
        btn.classList.add("code-copy-btn--copied");
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          btn.innerHTML = CLIPBOARD_SVG;
          btn.classList.remove("code-copy-btn--copied");
        }, 2000);
      });

      wrapper.appendChild(btn);
      buttons.push(btn);
    });

    return () => {
      buttons.forEach((btn) => btn.remove());
      // Unwrap: move pre back out of wrapper, then remove wrapper
      const wrappers = container.querySelectorAll(".code-block-wrapper");
      wrappers.forEach((wrapper) => {
        const pre = wrapper.querySelector("pre");
        if (pre && wrapper.parentNode) {
          wrapper.parentNode.insertBefore(pre, wrapper);
          wrapper.remove();
        }
      });
    };
  }, [children]);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col">
      {children}
    </div>
  );
}
