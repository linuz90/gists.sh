import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchGist, fetchUser, isMarkdown } from "@/lib/github";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CodeRenderer } from "@/components/code-renderer";
import { FileTabs } from "@/components/file-tabs";
import { AuthorFooter } from "@/components/author-footer";
import { PageCopyButtons } from "@/components/page-copy-buttons";
import { CodeBlockEnhancer } from "@/components/code-block-enhancer";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ user: string; gistId: string }>;
  searchParams: Promise<{
    file?: string;
    theme?: string;
    noheader?: string;
    nofooter?: string;
    mono?: string;
  }>;
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
  const resolvedSearchParams = await searchParams;
  const { file: fileParam } = resolvedSearchParams;
  const hideHeader = resolvedSearchParams.noheader !== undefined;
  const hideFooter = resolvedSearchParams.nofooter !== undefined;
  const monoMode = resolvedSearchParams.mono !== undefined;
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
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12${monoMode ? " font-mono" : ""}`}>
        {/* Header */}
        {!hideHeader && (
          <header className="flex items-start justify-between mb-8">
            <div className="min-w-0">
              <h1 className="text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300 truncate">
                {activeFilename}
              </h1>
              {gist.description && (
                <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500 truncate">
                  {gist.description}
                </p>
              )}
            </div>

            <PageCopyButtons content={activeFile.content} />
          </header>
        )}

        {/* File tabs */}
        {!hideHeader && (
          <Suspense>
            <FileTabs
              filenames={filenames}
              activeFile={activeFilename}
              user={user}
              gistId={gistId}
            />
          </Suspense>
        )}

        {/* Content */}
        <CodeBlockEnhancer>
          <div id="gist-content" className={!hideHeader && filenames.length > 1 ? "mt-8" : ""}>
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
        {!hideFooter && gist.owner && <AuthorFooter user={githubUser} />}

        {/* Footer */}
        {!hideFooter && (
          <footer className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 dark:text-neutral-600">
              <a
                href={gist.html_url}
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
            </div>
          </footer>
        )}
      </div>
    </main>
  );
}
