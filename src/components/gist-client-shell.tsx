"use client";

import { CodeBlockEnhancer } from "@/components/code-block-enhancer";
import { FileTabs } from "@/components/file-tabs";
import { HashScroller } from "@/components/hash-scroller";
import { PageCopyButtons } from "@/components/page-copy-buttons";
import { SecretBadge } from "@/components/secret-badge";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Children, type ReactNode } from "react";

interface FileData {
  filename: string;
  content: string;
  language: string | null;
  isMarkdown: boolean;
}

interface GistClientShellProps {
  filenames: string[];
  fileData: FileData[];
  gistDescription: string | null;
  gistPublic: boolean;
  gistHtmlUrl: string;
  gistOwner: boolean;
  user: string;
  gistId: string;
  authorFooter: ReactNode;
  children: ReactNode;
}

export function GistClientShell({
  filenames,
  fileData,
  gistDescription,
  gistPublic,
  gistHtmlUrl,
  gistOwner,
  user,
  gistId,
  authorFooter,
  children,
}: GistClientShellProps) {
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");
  const hideHeader = searchParams.has("noheader");
  const hideFooter = searchParams.has("nofooter");
  const monoMode = searchParams.has("mono");

  const activeFilename =
    fileParam && filenames.includes(fileParam) ? fileParam : filenames[0];
  const activeData =
    fileData.find((f) => f.filename === activeFilename) || fileData[0];

  const childArray = Children.toArray(children);

  return (
    <main className="min-h-screen flex flex-col">
      <HashScroller />
      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1 flex flex-col${monoMode ? " font-mono" : ""}`}
      >
        {/* Header */}
        {!hideHeader && (
          <header className="flex items-start justify-between mb-8">
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                {gistDescription || activeFilename}
                {!gistPublic && <SecretBadge />}
              </h1>
              {gistDescription && filenames.length === 1 && (
                <Text variant="meta" className="mt-1 truncate">
                  {activeFilename}
                </Text>
              )}
            </div>

            <PageCopyButtons
              content={activeData.content}
              filename={activeFilename}
              originalUrl={gistHtmlUrl}
              user={user}
              gistId={gistId}
              showCopyFormatted={activeData.isMarkdown}
            />
          </header>
        )}

        {/* File tabs */}
        <FileTabs
          filenames={filenames}
          activeFile={activeFilename}
          user={user}
          gistId={gistId}
        />

        {/* Content */}
        <CodeBlockEnhancer>
          <div
            id="gist-content"
            className={`flex-1 flex flex-col${filenames.length > 1 ? " mt-6 after-tabs" : ""}`}
          >
            <p className="sr-only">
              For the full content of this gist, refer to {gistHtmlUrl}
            </p>
            {childArray.map((child, i) => (
              <div
                key={filenames[i]}
                className={filenames[i] === activeFilename ? "" : "hidden"}
              >
                {child}
              </div>
            ))}
          </div>
        </CodeBlockEnhancer>

        {/* Author */}
        {!hideFooter && gistOwner && authorFooter}

        {/* Footer */}
        {!hideFooter && (
          <footer className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-900">
            <Text
              variant="meta"
              as="div"
              className="flex items-center justify-between"
            >
              <a
                href={gistHtmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
              >
                View on GitHub
              </a>
              <Link
                href="/"
                className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
              >
                gists.sh
              </Link>
            </Text>
          </footer>
        )}
      </div>
    </main>
  );
}
