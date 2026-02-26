import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeShiki from "@shikijs/rehype";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:underline prose-a:underline-offset-4 prose-code:before:content-none prose-code:after:content-none prose-code:bg-neutral-100 prose-code:dark:bg-neutral-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:p-0 prose-pre:bg-transparent prose-img:rounded-lg prose-blockquote:border-l-neutral-300 prose-blockquote:dark:border-l-neutral-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeShiki,
            {
              themes: {
                light: "github-light",
                dark: "github-dark",
              },
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
