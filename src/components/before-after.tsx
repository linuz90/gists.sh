"use client";

import { GistsMockup } from "@/components/mockups/gists-mockup";
import { GitHubMockup } from "@/components/mockups/github-mockup";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useCallback, useEffect, useRef, useState } from "react";

type View = "github" | "gists";

const VIEW_OPTIONS = [
  {
    value: "github" as View,
    label: (
      <>
        gist.github.com
        <span className="opacity-40 hidden sm:inline">/user/a1b2c3</span>
      </>
    ),
  },
  {
    value: "gists" as View,
    label: (
      <>
        gists.sh
        <span className="opacity-40 hidden sm:inline">/user/a1b2c3</span>
      </>
    ),
  },
];

const AUTO_ROTATE_MS = 4000;

export function BeforeAfter() {
  const [view, setView] = useState<View>("github");
  const [userInteracted, setUserInteracted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const handleChange = useCallback((v: View) => {
    setView(v);
    setUserInteracted(true);
  }, []);

  // Auto-rotate until user clicks
  useEffect(() => {
    if (userInteracted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setView((prev) => (prev === "github" ? "gists" : "github"));
    }, AUTO_ROTATE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userInteracted]);

  return (
    <div className="space-y-4">
      {/* Segmented control */}
      <div className="relative z-1">
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-2">
          See the difference:
        </p>
        <SegmentedControl
          options={VIEW_OPTIONS}
          value={view}
          onChange={handleChange}
        />
      </div>

      {/* Preview panel */}
      <div className="-m-10 p-10 mb-0 pb-0 mask-b-from-70% mask-b-to-100%">
        <div className="relative h-70 shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-lg">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              view === "github"
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <GitHubMockup />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              view === "gists" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <GistsMockup />
          </div>
        </div>
      </div>
    </div>
  );
}
