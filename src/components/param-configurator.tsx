"use client";

import { CopyButton } from "@/components/copy-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Theme = "auto" | "dark" | "light";

interface ParamState {
  theme: Theme;
  noheader: boolean;
  nofooter: boolean;
  mono: boolean;
}

const STORAGE_KEY = "gists-sh-params";

const DEFAULT_STATE: ParamState = {
  theme: "auto",
  noheader: false,
  nofooter: false,
  mono: false,
};

function loadState(): ParamState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

const PARAM_DOCS = [
  { param: "theme", desc: "dark or light mode" },
  { param: "noheader", desc: "Hide title, tabs, and copy buttons" },
  { param: "nofooter", desc: "Hide author info and footer" },
  { param: "mono", desc: "Monospace font for all text" },
];

function CopiableBlock({
  text,
  className,
  preserveNewlines,
}: {
  text: string;
  className?: string;
  preserveNewlines?: boolean;
}) {
  return (
    <div className="relative group">
      <div
        className={`font-mono text-[13px] bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 pr-12 text-neutral-700 dark:text-neutral-300 ${preserveNewlines ? "whitespace-pre-wrap" : ""} ${className ?? ""}`}
      >
        {text}
      </div>
      <div className="absolute top-2.5 right-2.5 opacity-70 scale-85 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 transition-opacity">
        <CopyButton
          text={text}
          className="p-1 rounded cursor-pointer text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
        />
      </div>
    </div>
  );
}

export function ParamConfigurator() {
  const [theme, setTheme] = useState<Theme>("auto");
  const [noheader, setNoheader] = useState(false);
  const [nofooter, setNofooter] = useState(false);
  const [mono, setMono] = useState(false);

  // Load from localStorage on mount (SSR requires effect-based hydration)
  useEffect(() => {
    const saved = loadState();
    /* eslint-disable react-hooks/set-state-in-effect */
    setTheme(saved.theme);
    setNoheader(saved.noheader);
    setNofooter(saved.nofooter);
    setMono(saved.mono);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist to localStorage on change
  const persist = useCallback((state: ParamState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, []);

  const paramString = useMemo(() => {
    const parts: string[] = [];
    if (theme !== "auto") parts.push(`theme=${theme}`);
    if (noheader) parts.push("noheader");
    if (nofooter) parts.push("nofooter");
    if (mono) parts.push("mono");
    return parts.length > 0 ? `?${parts.join("&")}` : "";
  }, [theme, noheader, nofooter, mono]);

  const promptText = useMemo(() => {
    const lines = [
      `When sharing code, notes, or snippets via GitHub Gists, always share the gists.sh link instead of the gist.github.com URL. Just replace "gist.github.com" with "gists.sh" in the URL.`,
      `After creating a new gist, fetch the gists.sh URL once (e.g. curl) to warm the cache so the page loads instantly for the reader.`,
      `After updating an existing gist, POST to gists.sh/{user}/{gist_id}/refresh to bust the stale cache, then fetch the gists.sh URL to warm it with the updated content.`,
    ];
    if (paramString) {
      lines.push(`Always append "${paramString}" to the URL.`);
    }
    lines.push(`Example: gists.sh/user/gist_id${paramString}`);
    return lines.join("\n\n");
  }, [paramString]);

  const toggleTheme = (value: "dark" | "light") => {
    setTheme((prev) => {
      const next = prev === value ? "auto" : value;
      persist({ theme: next, noheader, nofooter, mono });
      return next;
    });
  };

  const chipBase =
    "font-mono text-xs rounded-md px-2.5 py-1 transition-colors cursor-pointer select-none";
  const chipInactive =
    "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500";
  const chipActive =
    "bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900";

  return (
    <>
      {/* Try it */}
      <div className="space-y-5">
        <h2 className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Try it
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleTheme("dark")}
            className={`${chipBase} ${theme === "dark" ? chipActive : chipInactive}`}
          >
            dark
          </button>
          <button
            onClick={() => toggleTheme("light")}
            className={`${chipBase} ${theme === "light" ? chipActive : chipInactive}`}
          >
            light
          </button>
          <button
            onClick={() =>
              setNoheader((v) => {
                const next = !v;
                persist({ theme, noheader: next, nofooter, mono });
                return next;
              })
            }
            className={`${chipBase} ${noheader ? chipActive : chipInactive}`}
          >
            noheader
          </button>
          <button
            onClick={() =>
              setNofooter((v) => {
                const next = !v;
                persist({ theme, noheader, nofooter: next, mono });
                return next;
              })
            }
            className={`${chipBase} ${nofooter ? chipActive : chipInactive}`}
          >
            nofooter
          </button>
          <button
            onClick={() =>
              setMono((v) => {
                const next = !v;
                persist({ theme, noheader, nofooter, mono: next });
                return next;
              })
            }
            className={`${chipBase} ${mono ? chipActive : chipInactive}`}
          >
            mono
          </button>
        </div>
        <Link
          href={`/linuz90/146300208a53384d3aff494d5fcac234${paramString}`}
          target="_blank"
          className="block font-mono text-sm bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors space-y-2 overflow-hidden"
        >
          <div className="text-neutral-500 dark:text-neutral-600 break-all">
            <span className="line-through decoration-neutral-400 dark:decoration-neutral-700">
              gist.github.com
            </span>
            /linuz90/146300208a53384d3aff494d5fcac234
          </div>
          <div className="flex items-start gap-2">
            <ArrowRight
              size={14}
              className="text-blue-500 shrink-0 mt-1"
              strokeWidth={2.5}
            />
            <span className="break-all">
              <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                gists.sh
              </span>
              <span className="text-neutral-500 dark:text-neutral-600">
                /linuz90/146300208a53384d3aff494d5fcac234
                {paramString && (
                  <span className="text-blue-500">{paramString}</span>
                )}
              </span>
            </span>
          </div>
        </Link>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Append these URL params to any gist link to customize how it looks.
        </p>
        <div className="font-mono text-xs bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 space-y-1 text-neutral-600 dark:text-neutral-400">
          {PARAM_DOCS.map((d) => (
            <div key={d.param}>
              <span className="text-neutral-700 dark:text-neutral-300">
                ?{d.param}
              </span>{" "}
              {d.desc}
            </div>
          ))}
        </div>
      </div>

      {/* Agent skill */}
      <div className="space-y-5">
        <h2 className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Agent skill
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Install our{" "}
          <code className="font-mono text-neutral-700 dark:text-neutral-300">
            share-pretty-gist
          </code>{" "}
          skill to teach your AI agents to share beautiful gists whenever you
          need to share notes, code, reports, or anything else.
        </p>
        <CopiableBlock
          text="npx skills add linuz90/gists.sh"
          className="overflow-x-auto"
        />
      </div>

      {/* Or just prompt it */}
      <div className="space-y-5">
        <h2 className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          Or just prompt it
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          No skill needed. Copy this into your agent&apos;s instructions
          (OpenClaw 🦞, Claude Code, Cursor, etc.) and it will use gists.sh
          automatically.
        </p>
        <CopiableBlock
          text={promptText}
          className="leading-relaxed break-words"
          preserveNewlines
        />
      </div>
    </>
  );
}
