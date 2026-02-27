"use client";

import { Clipboard } from "lucide-react";
import { useState } from "react";

type GistTab = "README.md" | "SKILL.md" | "example.ts";

const GIST_TABS: { name: string; tab: GistTab }[] = [
  { name: "README.md", tab: "README.md" },
  { name: "SKILL.md", tab: "SKILL.md" },
  { name: "example.ts", tab: "example.ts" },
];

export function GistsMockup() {
  const [activeTab, setActiveTab] = useState<GistTab>("README.md");

  return (
    <div className="h-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden text-left flex flex-col [zoom:0.9]">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h1 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
              gists.sh showcase
            </h1>
          </div>
          <div className="flex items-center ml-3 shrink-0">
            <div className="p-1.5 rounded-md text-neutral-400 dark:text-neutral-600">
              <Clipboard size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* File tabs */}
      <div className="px-4 sm:px-6 flex gap-6 border-b border-neutral-200 dark:border-neutral-800">
        {GIST_TABS.map(({ name, tab }) => (
          <button
            key={name}
            onClick={() => setActiveTab(tab)}
            className={`py-1.5 text-xs font-mono whitespace-nowrap -mb-px border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-neutral-900 dark:text-neutral-100 border-neutral-900 dark:border-neutral-100"
                : "text-neutral-500 dark:text-neutral-500 border-transparent"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 pt-6 flex-1 overflow-hidden">
        {activeTab === "README.md" ? (
          <ReadmeContent />
        ) : activeTab === "SKILL.md" ? (
          <SkillContent />
        ) : (
          <CodeContent />
        )}
      </div>
    </div>
  );
}

function ReadmeContent() {
  return (
    <>
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
      <div className="mt-5 rounded-lg border border-[#bbf7d0] dark:border-[rgba(63,185,80,0.2)] bg-[#f0fdf4] dark:bg-[rgba(63,185,80,0.08)] px-4 py-3.5">
        <p className="text-[0.8125rem] font-semibold text-green-700 dark:text-green-500 mb-1">
          TIP
        </p>
        <p className="text-[0.9375rem] text-[#1a1a1a] dark:text-[#d4d4d4] leading-[1.75]">
          You&apos;re looking at a gists.sh page right now. Try switching
          between the file tabs above.
        </p>
      </div>
    </>
  );
}

function SkillContent() {
  return (
    <>
      {/* Frontmatter card mockup */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden text-[11px]">
        <div className="flex gap-3 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
          <span className="shrink-0 font-mono text-neutral-500 min-w-[70px]">
            name
          </span>
          <span className="text-neutral-900 dark:text-neutral-200">
            gists-sh
          </span>
        </div>
        <div className="flex gap-3 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
          <span className="shrink-0 font-mono text-neutral-500 min-w-[70px]">
            version
          </span>
          <span className="text-neutral-900 dark:text-neutral-200">
            2.1.0
          </span>
        </div>
        <div className="flex gap-3 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800">
          <span className="shrink-0 font-mono text-neutral-500 min-w-[70px]">
            triggers
          </span>
          <div className="flex flex-wrap gap-1">
            {["gist creation", "share code snippet"].map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[10px]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <span className="shrink-0 font-mono text-neutral-500 min-w-[70px]">
            description
          </span>
          <p className="mt-1 text-neutral-900 dark:text-neutral-200 leading-relaxed">
            Present gists.sh URLs when creating or sharing GitHub Gists.
          </p>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#0a0a0a] dark:text-[#fafafa] tracking-tight leading-[1.3]">
        gists.sh Skill
      </h3>
      <p className="mt-3 text-[0.9375rem] text-[#1a1a1a] dark:text-[#d4d4d4] leading-[1.75]">
        Replace{" "}
        <code className="text-[0.8125em] bg-[#f5f5f5] dark:bg-[#262626] px-[0.4em] py-[0.15em] rounded font-mono text-inherit">
          gist.github.com
        </code>{" "}
        with{" "}
        <code className="text-[0.8125em] bg-[#f5f5f5] dark:bg-[#262626] px-[0.4em] py-[0.15em] rounded font-mono text-inherit">
          gists.sh
        </code>{" "}
        for beautifully rendered frontmatter.
      </p>
    </>
  );
}

function CodeContent() {
  return (
    <div className="rounded-lg bg-[#fafafa] dark:bg-[#171717] p-4 font-mono text-[11px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
      <div>
        <span className="text-purple-700 dark:text-purple-400">
          interface
        </span>{" "}
        <span className="text-yellow-700 dark:text-yellow-400">
          GistFile
        </span>{" "}
        {"{"}
      </div>
      <div>
        {"  "}filename:{" "}
        <span className="text-blue-700 dark:text-blue-400">string</span>;
      </div>
      <div>
        {"  "}language:{" "}
        <span className="text-blue-700 dark:text-blue-400">string</span>
        {" | "}
        <span className="text-blue-700 dark:text-blue-400">null</span>;
      </div>
      <div>
        {"  "}content:{" "}
        <span className="text-blue-700 dark:text-blue-400">string</span>;
      </div>
      <div>
        {"  "}size:{" "}
        <span className="text-blue-700 dark:text-blue-400">number</span>;
      </div>
      <div>{"}"}</div>
      <div>&nbsp;</div>
      <div>
        <span className="text-purple-700 dark:text-purple-400">
          interface
        </span>{" "}
        <span className="text-yellow-700 dark:text-yellow-400">Gist</span>{" "}
        {"{"}
      </div>
      <div>
        {"  "}id:{" "}
        <span className="text-blue-700 dark:text-blue-400">string</span>;
      </div>
      <div>
        {"  "}description:{" "}
        <span className="text-blue-700 dark:text-blue-400">string</span>
        {" | "}
        <span className="text-blue-700 dark:text-blue-400">null</span>;
      </div>
      <div>
        {"  "}files:{" "}
        <span className="text-yellow-700 dark:text-yellow-400">
          GistFile
        </span>
        [];
      </div>
      <div>{"}"}</div>
    </div>
  );
}
