import { AuthorFooter } from "@/components/author-footer";
import { CodeBlockEnhancer } from "@/components/code-block-enhancer";
import { CodeRenderer } from "@/components/code-renderer";
import { FileTabs } from "@/components/file-tabs";
import { HashScroller } from "@/components/hash-scroller";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PageCopyButtons } from "@/components/page-copy-buttons";
import { SecretBadge } from "@/components/secret-badge";
import { fetchGist, fetchUser, isMarkdown, isPlainText } from "@/lib/github";
import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

export const revalidate = 86400;

function ContentLoader() {
  return (
    <div className="flex-1 flex items-start justify-center pt-24">
      <div className="h-4 w-4 border-[1.5px] border-neutral-200 border-t-neutral-400 dark:border-neutral-700 dark:border-t-neutral-500 rounded-full animate-spin" />
    </div>
  );
}

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

const fetchGistCached = cache(async (gistId: string) => fetchGist(gistId));
const fetchUserCached = cache(async (username: string) => fetchUser(username));

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { user, gistId } = await params;
  const gist = await fetchGistCached(gistId);

  if (!gist) {
    return { title: "Not Found · gists.sh" };
  }

  const files = Object.values(gist.files);
  const firstFile = files[0];
  const title = gist.description || firstFile?.filename || "Gist";

  // Build a content preview for og:description instead of just "filename by author"
  // Strip frontmatter before generating preview
  const contentForPreview =
    firstFile?.content && isMarkdown(firstFile.filename)
      ? matter(firstFile.content).content
      : firstFile?.content;
  const rawPreview = contentForPreview
    ? contentForPreview
        .replace(/^#+\s+/gm, "") // strip markdown headings
        .replace(/[*_`~\[\]]/g, "") // strip markdown formatting
        .replace(/\s+/g, " ") // collapse whitespace
        .trim()
    : "";
  const description = rawPreview
    ? rawPreview.length > 200
      ? rawPreview.slice(0, 200).replace(/\s+\S*$/, "") + "..."
      : rawPreview
    : `${firstFile?.filename} by ${user}`;
  const githubUrl = `https://gist.github.com/${user}/${gistId}`;

  return {
    title: `${title} · gists.sh`,
    description,
    ...(gist.public && {
      alternates: {
        canonical: githubUrl,
      },
    }),
    ...(!gist.public && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://gists.sh/${user}/${gistId}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    fetchGistCached(gistId),
    fetchUserCached(user),
  ]);

  if (!gist) {
    notFound();
  }

  const files = Object.values(gist.files);
  const filenames = files.map((f) => f.filename);

  // Select active file
  const activeFile = fileParam
    ? (files.find((f) => f.filename === fileParam) ?? files[0])
    : files[0];

  const activeFilename = activeFile.filename;
  const githubUrl = `https://gist.github.com/${user}/${gistId}`;
  const activeContent = isMarkdown(activeFilename) ? (
    <MarkdownRenderer content={activeFile.content} />
  ) : isPlainText(activeFilename) ? (
    <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
      {activeFile.content}
    </div>
  ) : (
    <CodeRenderer
      content={activeFile.content}
      filename={activeFilename}
      language={activeFile.language}
    />
  );

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
                {gist.description || activeFilename}
                {!gist.public && <SecretBadge />}
              </h1>
              {gist.description && filenames.length === 1 && (
                <p className="mt-1 text-xs font-mono text-neutral-500 dark:text-neutral-500 truncate">
                  {activeFilename}
                </p>
              )}
            </div>

            <PageCopyButtons
              content={activeFile.content}
              originalUrl={gist.html_url}
              user={user}
              gistId={gistId}
              showCopyFormatted={isMarkdown(activeFilename)}
            />
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
          <div
            id="gist-content"
            className={`flex-1 flex flex-col${!hideHeader && filenames.length > 1 ? " mt-8 after-tabs" : ""}`}
          >
            <p className="sr-only">
              For the full content of this gist, refer to {githubUrl}
            </p>
            <Suspense fallback={<ContentLoader />}>{activeContent}</Suspense>
          </div>
        </CodeBlockEnhancer>

        {/* Author */}
        {!hideFooter && gist.owner && <AuthorFooter user={githubUser} />}

        {/* Footer */}
        {!hideFooter && (
          <footer className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-600">
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
