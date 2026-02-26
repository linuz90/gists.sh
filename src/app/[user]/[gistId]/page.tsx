import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchGist, isMarkdown } from "@/lib/github";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CodeRenderer } from "@/components/code-renderer";
import { FileTabs } from "@/components/file-tabs";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ user: string; gistId: string }>;
  searchParams: Promise<{ file?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { user, gistId } = await params;
  const gist = await fetchGist(gistId);

  if (!gist) {
    return { title: "Not Found - gists.sh" };
  }

  const files = Object.values(gist.files);
  const firstFile = files[0];
  const title = gist.description || firstFile?.filename || "Gist";

  return {
    title: `${title} - gists.sh`,
    description: `${firstFile?.filename} by ${user}`,
    openGraph: {
      title,
      description: `${firstFile?.filename} by ${user}`,
      type: "article",
    },
  };
}

export default async function GistPage({ params, searchParams }: PageProps) {
  const { user, gistId } = await params;
  const { file: fileParam } = await searchParams;
  const gist = await fetchGist(gistId);

  if (!gist) {
    notFound();
  }

  const files = Object.values(gist.files);
  const filenames = files.map((f) => f.filename);

  // Select active file
  const activeFile = fileParam
    ? files.find((f) => f.filename === fileParam) ?? files[0]
    : files[0];

  const activeFilename = activeFile.filename;

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div className="min-w-0">
            <h1 className="text-sm font-mono text-neutral-500 dark:text-neutral-400 truncate">
              {activeFilename}
            </h1>
            {gist.description && (
              <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500 truncate">
                {gist.description}
              </p>
            )}
          </div>

          {gist.owner && (
            <a
              href={gist.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 ml-4 shrink-0 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <span className="hidden sm:inline">{gist.owner.login}</span>
              <img
                src={gist.owner.avatar_url}
                alt={gist.owner.login}
                width={28}
                height={28}
                className="rounded-full"
              />
            </a>
          )}
        </header>

        {/* File tabs */}
        <Suspense>
          <FileTabs
            filenames={filenames}
            activeFile={activeFilename}
            user={user}
            gistId={gistId}
          />
        </Suspense>

        {/* Content */}
        <div className={filenames.length > 1 ? "mt-8" : ""}>
          {isMarkdown(activeFilename) ? (
            <MarkdownRenderer content={activeFile.content} />
          ) : (
            <CodeRenderer
              content={activeFile.content}
              filename={activeFilename}
              language={activeFile.language}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-600">
            <a
              href={gist.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              View on GitHub
            </a>
            <a
              href="/"
              className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              gists.sh
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
