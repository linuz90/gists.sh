"use client";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Clipboard } from "lucide-react";
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

/* ── Mockups ─────────────────────────────────────────────────────── */

function GitHubMockup() {
  const codeLine = (n: number, content: React.ReactNode) => (
    <div className="flex">
      <span className="w-7 shrink-0 text-right pr-3 text-neutral-300 dark:text-neutral-600 select-none">
        {n}
      </span>
      <span>{content}</span>
    </div>
  );

  return (
    <div className="h-full rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden text-left flex flex-col [zoom:0.9]">
      {/* Dark navbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-700 dark:bg-neutral-800 text-neutral-300">
        <span className="font-semibold text-[11px] tracking-tight text-white">
          GitHub Gist
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-400">All gists</span>
          <div className="w-4 h-4 rounded-full bg-neutral-600" />
        </div>
      </div>

      {/* Repo header */}
      <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
            <span className="text-blue-600 dark:text-blue-400 font-mono">
              user
            </span>
            <span className="text-neutral-400">/</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
              notes.md
            </span>
            <span className="text-[9px] px-1 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-500 leading-none">
              Secret
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {["Edit", "Delete", "Star"].map((label) => (
              <span
                key={label}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-neutral-400 mt-0.5 ml-5.5">
          Created 2 hours ago
        </div>
      </div>

      {/* Tabs + embed bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[10px]">
        <div className="flex items-center gap-3">
          <span className="font-medium text-neutral-700 dark:text-neutral-300 border-b border-orange-500 pb-1">
            Code
          </span>
          <span className="text-neutral-400">Revisions 1</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
            Embed
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
            Download ZIP
          </span>
        </div>
      </div>

      {/* File block */}
      <div className="flex-1 bg-white dark:bg-neutral-950">
        <div className="px-3 pt-2 pb-1">
          <span className="text-[10px] text-neutral-500">
            gists.sh showcase
          </span>
        </div>
        {/* Code file header */}
        <div className="mx-3 mt-1 rounded-t-md border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-t-md border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
              gist-example.py
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
              Raw
            </span>
          </div>
          {/* Code content */}
          <div className="px-2 py-2 font-mono text-[11px] leading-[1.6] text-neutral-600 dark:text-neutral-400">
            {codeLine(
              1,
              <span className="text-green-700 dark:text-green-500">
                &quot;&quot;&quot;
              </span>,
            )}
            {codeLine(
              2,
              <span className="text-green-700 dark:text-green-500">
                Minimal gist fetcher.
              </span>,
            )}
            {codeLine(
              3,
              <span className="text-green-700 dark:text-green-500">
                &quot;&quot;&quot;
              </span>,
            )}
            {codeLine(4, "\u00A0")}
            {codeLine(
              5,
              <>
                <span className="text-purple-700 dark:text-purple-400">
                  import
                </span>{" "}
                <span className="text-neutral-700 dark:text-neutral-300">
                  httpx
                </span>
              </>,
            )}
            {codeLine(
              6,
              <>
                <span className="text-purple-700 dark:text-purple-400">
                  from
                </span>{" "}
                <span className="text-neutral-700 dark:text-neutral-300">
                  dataclasses
                </span>{" "}
                <span className="text-purple-700 dark:text-purple-400">
                  import
                </span>{" "}
                <span className="text-neutral-700 dark:text-neutral-300">
                  dataclass
                </span>
              </>,
            )}
            {codeLine(7, "\u00A0")}
            {codeLine(
              8,
              <>
                <span className="text-red-700 dark:text-red-400">
                  @dataclass
                </span>
              </>,
            )}
            {codeLine(
              9,
              <>
                <span className="text-purple-700 dark:text-purple-400">
                  class
                </span>{" "}
                <span className="text-yellow-700 dark:text-yellow-400">
                  GistFile
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  :
                </span>
              </>,
            )}
            {codeLine(
              10,
              <>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {"    "}filename: str
                </span>
              </>,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GistsMockup() {
  return (
    <div className="h-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden text-left flex flex-col [zoom:0.9]">
      {/* Header — matches page.tsx header */}
      <div className="px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h1 className="text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300 truncate">
              gist-README.md
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500 truncate">
              gists.sh showcase
            </p>
          </div>
          <div className="flex items-center ml-3 shrink-0">
            <div className="p-1.5 rounded-md text-neutral-400 dark:text-neutral-600">
              <Clipboard size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* File tabs — matches file-tabs.tsx */}
      <div className="px-4 sm:px-6 flex gap-6 border-b border-neutral-200 dark:border-neutral-800">
        <span className="py-1.5 text-xs font-mono whitespace-nowrap -mb-px text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100">
          gist-README.md
        </span>
        <span className="py-1.5 text-xs font-mono whitespace-nowrap -mb-px text-neutral-500 dark:text-neutral-500 border-b-2 border-transparent">
          gist-example.py
        </span>
        <span className="py-1.5 text-xs font-mono whitespace-nowrap -mb-px text-neutral-500 dark:text-neutral-500 border-b-2 border-transparent hidden sm:block">
          gist-example.ts
        </span>
      </div>

      {/* Rendered markdown content — matches markdown-body styles */}
      <div className="px-4 sm:px-6 pt-6 flex-1">
        <h3 className="text-[1.75rem] font-semibold text-[#0a0a0a] dark:text-[#fafafa] tracking-tight leading-[1.3]">
          gists.sh
        </h3>
        <p className="mt-4 text-[0.9375rem] text-[#1a1a1a] dark:text-[#d4d4d4] leading-[1.75]">
          A beautiful viewer for GitHub Gists. Replace{" "}
          <code className="text-[0.8125em] bg-[#f5f5f5] dark:bg-[#262626] px-[0.4em] py-[0.15em] rounded font-mono text-inherit">
            gist.github.com
          </code>{" "}
          with{" "}
          <code className="text-[0.8125em] bg-[#f5f5f5] dark:bg-[#262626] px-[0.4em] py-[0.15em] rounded font-mono text-inherit">
            gists.sh
          </code>{" "}
          in any URL.
        </p>

        {/* Tip callout — matches markdown-alert-tip styles */}
        <div className="mt-5 rounded-lg border border-[#bbf7d0] dark:border-[rgba(63,185,80,0.2)] bg-[#f0fdf4] dark:bg-[rgba(63,185,80,0.08)] px-4 py-3.5">
          <p className="text-[0.8125rem] font-semibold text-green-700 dark:text-green-500 mb-1">
            TIP
          </p>
          <p className="text-[0.9375rem] text-[#1a1a1a] dark:text-[#d4d4d4] leading-[1.75]">
            You&apos;re looking at a gists.sh page right now. Try switching
            between the file tabs above.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

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
