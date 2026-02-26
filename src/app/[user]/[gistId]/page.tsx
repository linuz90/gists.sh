import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchGist, fetchUser, isMarkdown } from "@/lib/github";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CodeRenderer } from "@/components/code-renderer";
import { FileTabs } from "@/components/file-tabs";
import { AuthorFooter } from "@/components/author-footer";
import { PageCopyButtons } from "@/components/page-copy-buttons";
import { CodeBlockEnhancer } from "@/components/code-block-enhancer";
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
  const [gist, githubUser] = await Promise.all([
    fetchGist(gistId),
    fetchUser(user),
  ]);

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
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

          <PageCopyButtons content={activeFile.content} />

          {gist.owner && (
            <a
              href={gist.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 shrink-0 hover:opacity-80 transition-opacity"
            >
              <img
                src={gist.owner.avatar_url}
                alt={gist.owner.login}
                width={24}
                height={24}
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
        <CodeBlockEnhancer>
          <div className={filenames.length > 1 ? "mt-8" : ""}>
            {isMarkdown(activeFilename) ? (
              <Suspense>
                <MarkdownRenderer content={activeFile.content} />
              </Suspense>
            ) : (
              <CodeRenderer
                content={activeFile.content}
                filename={activeFilename}
                language={activeFile.language}
              />
            )}
          </div>
        </CodeBlockEnhancer>

        {/* Author */}
        {gist.owner && <AuthorFooter user={githubUser} />}

        {/* Footer */}
        <footer className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-neutral-600">
            <a
              href={gist.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
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
