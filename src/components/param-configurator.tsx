"use client";

import { Chip } from "@/components/ui/chip";
import { SectionLabel } from "@/components/ui/section-label";
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

export function ParamConfigurator() {
  const [theme, setTheme] = useState<Theme>("auto");
  const [noheader, setNoheader] = useState(false);
  const [nofooter, setNofooter] = useState(false);
  const [mono, setMono] = useState(false);

  useEffect(() => {
    const saved = loadState();
    /* eslint-disable react-hooks/set-state-in-effect */
    setTheme(saved.theme);
    setNoheader(saved.noheader);
    setNofooter(saved.nofooter);
    setMono(saved.mono);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

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

  return (
    <div className="space-y-5">
      <SectionLabel>Customize it</SectionLabel>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md overflow-hidden">
          {(["dark", "light"] as const).map((value) => (
            <Chip
              key={value}
              active={theme === value}
              onClick={() => {
                const next = theme === value ? "auto" : value;
                setTheme(next);
                persist({ theme: next, noheader, nofooter, mono });
              }}
              className="rounded-none"
            >
              {value}
            </Chip>
          ))}
        </div>
        <Chip
          active={noheader}
          onClick={() =>
            setNoheader((v) => {
              const next = !v;
              persist({ theme, noheader: next, nofooter, mono });
              return next;
            })
          }
        >
          noheader
        </Chip>
        <Chip
          active={nofooter}
          onClick={() =>
            setNofooter((v) => {
              const next = !v;
              persist({ theme, noheader, nofooter: next, mono });
              return next;
            })
          }
        >
          nofooter
        </Chip>
        <Chip
          active={mono}
          onClick={() =>
            setMono((v) => {
              const next = !v;
              persist({ theme, noheader, nofooter, mono: next });
              return next;
            })
          }
        >
          mono
        </Chip>
      </div>
      <Link
        href={`/linuz90/146300208a53384d3aff494d5fcac234${paramString}`}
        target="_blank"
        className="block font-mono text-sm bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors overflow-hidden"
      >
        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
          gists.sh
        </span>
        <span className="text-neutral-500 dark:text-neutral-600">
          /linuz90/146...234
        </span>
        {paramString && (
          <span className="text-blue-500">{paramString}</span>
        )}
      </Link>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        Append URL params to any gist link to customize how it looks.
      </p>
      <div className="font-mono text-xs border border-neutral-150 dark:border-neutral-800 rounded-lg px-4 py-3 space-y-1 text-neutral-500 dark:text-neutral-500">
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
  );
}
