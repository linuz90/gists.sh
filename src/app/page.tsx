import { BeforeAfter } from "@/components/before-after";
import { ClickToCopy } from "@/components/click-to-copy";
import { CopiableBlock } from "@/components/copiable-block";
import { ParamConfigurator } from "@/components/param-configurator";
import { SectionLabel } from "@/components/ui/section-label";
import { Text } from "@/components/ui/text";
import { Analytics } from "@vercel/analytics/next";
import { ArrowRight } from "lucide-react";

const PROMPT_TEXT = `When sharing code, notes, or snippets via GitHub Gists, always share the gists.sh link instead of the gist.github.com URL. Just replace "gist.github.com" with "gists.sh" in the URL.

Always create secret gists (never --public unless explicitly asked). Use \`gh gist create <files> -d "descriptive title"\`. The -d description becomes the page title on gists.sh, so make it clear and useful.

Use correct filenames with proper extensions (e.g. server.ts, config.yml, query.sql) so syntax highlighting works. For markdown content, use a .md file.

After creating a new gist, fetch the gists.sh URL once (e.g. curl) to warm the cache so the page loads instantly for the reader.

After updating an existing gist, POST to gists.sh/{user}/{gist_id}/refresh to bust the stale cache, then fetch the gists.sh URL to warm it with the updated content.

Example: gists.sh/user/gist_id`;

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen flex items-start sm:items-center justify-center px-5 sm:px-6 lg:px-8 py-12 sm:py-24 overflow-x-hidden">
      <div className="max-w-2xl w-full space-y-12 sm:space-y-14">
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
          <Text className="text-base">
            GitHub Gists are the fastest way to share code, notes, and snippets.
            But they look terrible. This fixes that.
          </Text>
        </div>

        {/* How it works */}
        <div className="space-y-5 mb-6">
          <SectionLabel>
            How it works
          </SectionLabel>
          <Text>
            Take any GitHub Gist URL and replace{" "}
            <code className="font-mono text-neutral-700 dark:text-neutral-300">
              gist.github.com
            </code>{" "}
            with{" "}
            <code className="font-mono text-neutral-700 dark:text-neutral-300">
              gists.sh
            </code>
            . That&apos;s it.
          </Text>
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

        <BeforeAfter />

        <ParamConfigurator />

        {/* Agent skill */}
        <div className="space-y-5">
          <SectionLabel>
            Agent skill
          </SectionLabel>
          <Text>
            Install our{" "}
            <code className="font-mono text-neutral-700 dark:text-neutral-300">
              share-pretty-gist
            </code>{" "}
            skill to teach your AI agents to share beautiful gists whenever you
            need to share notes, code, reports, or anything else.
          </Text>
          <ClickToCopy text="npx skills add linuz90/gists.sh" toastMessage="Paste it in your terminal" />
        </div>

        {/* Or just prompt it */}
        <div className="space-y-5">
          <SectionLabel>
            Or just prompt it
          </SectionLabel>
          <Text>
            No skill needed. Copy this into your agent&apos;s instructions
            (OpenClaw, Claude Code, Cursor, etc.) and it will use gists.sh
            automatically.
          </Text>
          <CopiableBlock
            text={PROMPT_TEXT}
            className="leading-relaxed break-words"
            preserveNewlines
          />
        </div>

        {/* About */}
        <div className="space-y-5">
          <SectionLabel>
            Why this exists
          </SectionLabel>
          <div className="space-y-4">
            <Text>
              I use gists every day to share documents, research, and snippets
              with teammates and friends. I also often have my AI agents create
              gists to share things with me.
            </Text>
            <Text>
              Gists are incredibly convenient, but not particularly nice to look
              at. I built this for those who, like me, would rather see a clean,
              minimal page, even if just for 10 seconds.
            </Text>
            <div className="flex items-center gap-2.5 pt-1">
              {/* eslint-disable-next-line @next/next/no-img-element -- keep raw img to avoid optimization/runtime image costs */}
              <img
                src="https://www.fabrizio.so/avatar.jpeg"
                alt="Fabrizio Rinaldi"
                width={24}
                height={24}
                className="rounded-full shrink-0"
              />
              <Text>
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
              </Text>
            </div>
          </div>
        </div>

        {/* Open source & privacy */}
        <div className="space-y-5">
          <SectionLabel>
            Open source
          </SectionLabel>
          <div className="space-y-4">
            <Text>
              gists.sh is fully open source. Gist pages have zero tracking or
              analytics. The only analytics run on this landing page via Vercel
              to count visitors. Your gists are fetched directly from the GitHub
              API and never stored. Secret gists are marked as noindex so search
              engines won&apos;t crawl them.
            </Text>
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
