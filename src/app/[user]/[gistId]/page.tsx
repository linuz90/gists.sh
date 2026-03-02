import { AuthorFooter } from "@/components/author-footer";
import { CodeRenderer } from "@/components/code-renderer";
import { GistClientShell } from "@/components/gist-client-shell";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { CsvViewer } from "@/components/renderers/csv-viewer";
import { IcsViewer } from "@/components/renderers/ics-viewer";
import { JsonViewer } from "@/components/renderers/json-viewer";
import { StructuredFileViewer } from "@/components/renderers/structured-file-viewer";
import { YamlViewer } from "@/components/renderers/yaml-viewer";
import type { GistFile } from "@/lib/github";
import {
  fetchGist,
  fetchUser,
  isCSV,
  isICS,
  isJSON,
  isMarkdown,
  isPlainText,
  isStructuredData,
  isYAML,
} from "@/lib/github";
import { getShikiLang, highlightCode } from "@/lib/shiki";
import matter from "gray-matter";
import type { Metadata } from "next";
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

// Pre-render a single file's content (server-side)
async function renderFileContent(file: GistFile) {
  const { filename, content, language } = file;

  if (isMarkdown(filename)) {
    return <MarkdownRenderer content={content} />;
  }

  if (isStructuredData(filename)) {
    const rawHtml = await highlightCode(
      content,
      getShikiLang(filename, language),
    );

    if (isJSON(filename)) {
      return (
        <StructuredFileViewer rawHtml={rawHtml} rawContent={content}>
          <JsonViewer content={content} />
        </StructuredFileViewer>
      );
    }
    if (isYAML(filename)) {
      return (
        <StructuredFileViewer rawHtml={rawHtml} rawContent={content}>
          <YamlViewer content={content} />
        </StructuredFileViewer>
      );
    }
    if (isCSV(filename)) {
      return (
        <StructuredFileViewer rawHtml={rawHtml} rawContent={content}>
          <CsvViewer content={content} filename={filename} />
        </StructuredFileViewer>
      );
    }
    if (isICS(filename)) {
      return (
        <StructuredFileViewer rawHtml={rawHtml} rawContent={content}>
          <IcsViewer content={content} />
        </StructuredFileViewer>
      );
    }
  }

  if (isPlainText(filename)) {
    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
        {content}
      </div>
    );
  }

  return (
    <CodeRenderer content={content} filename={filename} language={language} />
  );
}

export default async function GistPage({ params }: PageProps) {
  const { user, gistId } = await params;
  const [gist, githubUser] = await Promise.all([
    fetchGistCached(gistId),
    fetchUserCached(user),
  ]);

  if (!gist) {
    notFound();
  }

  const files = Object.values(gist.files);
  const filenames = files.map((f) => f.filename);

  // Build serializable file data for the client shell
  const fileData = files.map((f) => ({
    filename: f.filename,
    content: f.content,
    language: f.language,
    isMarkdown: isMarkdown(f.filename),
  }));

  // Pre-render ALL files in parallel so the page doesn't depend on searchParams.
  // This makes the page ISR-cacheable — searchParams are read client-side only.
  const renderedPanels = await Promise.all(
    files.map(async (file) => (
      <Suspense key={file.filename} fallback={<ContentLoader />}>
        {await renderFileContent(file)}
      </Suspense>
    )),
  );

  return (
    <Suspense fallback={<ContentLoader />}>
      <GistClientShell
        filenames={filenames}
        fileData={fileData}
        gistDescription={gist.description}
        gistPublic={gist.public}
        gistHtmlUrl={gist.html_url}
        gistOwner={!!gist.owner}
        user={user}
        gistId={gistId}
        authorFooter={gist.owner ? <AuthorFooter user={githubUser} /> : null}
      >
        {renderedPanels}
      </GistClientShell>
    </Suspense>
  );
}
