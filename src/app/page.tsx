import { ParamConfigurator } from "@/components/param-configurator";
import { Analytics } from "@vercel/analytics/next";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-5 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="max-w-2xl w-full space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2.5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M11 4V11.5C11 11.8978 11.158 12.2794 11.4393 12.5607C11.7206 12.842 12.1022 13 12.5 13H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6C3 4.34315 4.34315 3 6 3H9.75736C10.553 3 11.3161 3.31607 11.8787 3.87868L20.1213 12.1213C20.6839 12.6839 21 13.447 21 14.2426V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            gists.sh
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            GitHub Gists are the fastest way to share code, notes, and snippets.
            But they look terrible. This fixes that.
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-5">
          <h2 className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            How it works
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Take any GitHub Gist URL and replace{" "}
            <code className="font-mono text-neutral-700 dark:text-neutral-300">
              gist.github.com
            </code>{" "}
            with{" "}
            <code className="font-mono text-neutral-700 dark:text-neutral-300">
              gists.sh
            </code>
            . That&apos;s it.
          </p>
          <div className="font-mono text-sm bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-neutral-400 dark:text-neutral-600 line-through decoration-neutral-400 dark:decoration-neutral-700">
              gist.github.com
            </span>
            <ArrowRight
              size={14}
              className="text-blue-500 shrink-0"
              strokeWidth={2.5}
            />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">
              gists.sh
            </span>
          </div>
        </div>

        <ParamConfigurator />

        {/* About */}
        <div className="space-y-5">
          <h2 className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Why this exists
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              I use gists every day to share documents, research, and snippets
              with teammates and friends. I also often have my AI agents create
              gists to share things with me.
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Gists are incredibly convenient, but not particularly nice to look
              at. I built this for those who, like me, would rather see a clean,
              minimal page, even if just for 10 seconds.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <img
                src="https://www.fabrizio.so/avatar.jpeg"
                alt="Fabrizio Rinaldi"
                width={24}
                height={24}
                className="rounded-full shrink-0"
              />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <a
                  href="https://fabrizio.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  Fabrizio Rinaldi
                </a>
                <span className="mx-1.5 text-neutral-400 dark:text-neutral-700">
                  /
                </span>
                <a
                  href="https://x.com/linuz90"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                  @linuz90
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Open source & privacy */}
        <div className="space-y-5">
          <h2 className="text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Open source
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              gists.sh is fully open source. Gist pages have zero tracking or
              analytics. The only analytics run on this landing page via Vercel
              to count visitors. Your gists are fetched directly from the GitHub
              API and never stored. Secret gists are marked as noindex so search
              engines won&apos;t crawl them.
            </p>
            <a
              href="https://github.com/linuz90/gists.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              View source
            </a>
          </div>
        </div>
      </div>
      <Analytics />
    </main>
  );
}
