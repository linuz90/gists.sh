"use client";

import type { TocEntry } from "@/lib/toc";
import { List, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TableOfContentsProps {
  headings: TocEntry[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Check after mount so the DOM has rendered
    requestAnimationFrame(checkScroll);
  }, [open, checkScroll]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
    setOpen(false);
  }, []);

  return (
    <div className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40">
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-14 right-0 z-50 w-64 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_1px_4px_-1px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),0_1px_4px_-1px_rgba(0,0,0,0.2)] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-150">
            <div className="px-2.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              On this page
            </div>
            <div className="relative">
              {/* Top scroll fade */}
              <div
                className={`pointer-events-none absolute top-0 left-0 right-0 h-4 z-10 rounded-t-md bg-gradient-to-b from-white dark:from-neutral-900 to-transparent transition-opacity duration-150 ${canScrollUp ? "opacity-100" : "opacity-0"}`}
              />
              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="max-h-[50vh] overflow-y-auto hide-scrollbar"
              >
                {headings.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => scrollTo(h.id)}
                    className={`
                      flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-[0.8125rem] rounded-md outline-none cursor-default select-none transition-colors
                      ${h.level === 3 ? "pl-5" : ""}
                      ${
                        activeId === h.id
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100"
                      }
                    `}
                  >
                    {h.text}
                  </button>
                ))}
              </div>
              {/* Bottom scroll fade */}
              <div
                className={`pointer-events-none absolute bottom-0 left-0 right-0 h-4 z-10 rounded-b-md bg-gradient-to-t from-white dark:from-neutral-900 to-transparent transition-opacity duration-150 ${canScrollDown ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="relative z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_1px_4px_-1px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),0_1px_4px_-1px_rgba(0,0,0,0.2)] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors outline-none"
        aria-label={open ? "Close table of contents" : "Table of contents"}
      >
        {open ? <X size={18} /> : <List size={18} />}
      </button>
    </div>
  );
}
