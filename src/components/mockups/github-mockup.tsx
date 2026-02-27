export function GitHubMockup() {
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
              SKILL.md
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
              example.py
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
