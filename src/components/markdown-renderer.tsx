import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import type { TocEntry } from "@/lib/toc";
import { rehypeExtractToc } from "@/lib/rehype-extract-toc";
import { TableOfContents } from "./table-of-contents";

const sanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  clobber: [],
  clobberPrefix: "",
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id"],
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      ["style", /^color:#[0-9a-fA-F]{3,8}$/],
    ],
    pre: [
      ...(defaultSchema.attributes?.pre ?? []),
      ["style", /^(background-color|color):#[0-9a-fA-F]{3,8}(;(background-color|color):#[0-9a-fA-F]{3,8})*;?$/],
    ],
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["style", /^(background-color|color):#[0-9a-fA-F]{3,8}(;(background-color|color):#[0-9a-fA-F]{3,8})*;?$/],
    ],
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className"],
  },
};

interface MarkdownRendererProps {
  content: string;
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const headings: TocEntry[] = [];

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeExtractToc(headings))
    .use(rehypeShiki, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultLanguage: "tsx",
    })
    .use(rehypeStringify)
    .process(content);

  return (
    <>
      <div
        className="markdown-body max-w-none"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: String(result) }}
      />
      {headings.length >= 3 && <TableOfContents headings={headings} />}
    </>
  );
}
