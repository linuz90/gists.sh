import { HeadingAnchorHandler } from "@/components/heading-anchor-handler";
import {
  FrontmatterValue,
  isArrayOfObjects,
  isPlainObject,
} from "@/components/renderers/structured-data-primitives";
import { rehypeExtractToc } from "@/lib/rehype-extract-toc";
import type { TocEntry } from "@/lib/toc";
import rehypeShiki from "@shikijs/rehype";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { TableOfContents } from "./table-of-contents";

const sanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  clobber: [],
  clobberPrefix: "",
  tagNames: [...(defaultSchema.tagNames ?? []), "svg", "path"],
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
      [
        "style",
        /^(background-color|color):#[0-9a-fA-F]{3,8}(;(background-color|color):#[0-9a-fA-F]{3,8})*;?$/,
      ],
    ],
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      [
        "style",
        /^(background-color|color):#[0-9a-fA-F]{3,8}(;(background-color|color):#[0-9a-fA-F]{3,8})*;?$/,
      ],
    ],
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      "ariaHidden",
      "ariaLabel",
      "tabIndex",
    ],
    svg: ["xmlns", "viewBox", "width", "height", "fill"],
    path: ["d"],
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className"],
  },
};

interface MarkdownRendererProps {
  content: string;
}

function FrontmatterDisplay({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  return (
    <div className="mb-8 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden text-[13px]">
      {entries.map(([key, value], i) => {
        const isComplex = isPlainObject(value) || isArrayOfObjects(value);
        const hasSeparator = i < entries.length - 1;

        return (
          <div
            key={key}
            className={`px-4 py-3${hasSeparator ? " border-b border-neutral-200 dark:border-neutral-800" : ""}${isComplex ? " flex flex-col gap-2" : " flex gap-4"}`}
          >
            <span className="shrink-0 font-mono text-neutral-500 dark:text-neutral-500 font-medium min-w-[100px]">
              {key}
            </span>
            <FrontmatterValue value={value} />
          </div>
        );
      })}
    </div>
  );
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const headings: TocEntry[] = [];

  // Parse frontmatter if present
  const { data: frontmatter, content: markdownContent } = matter(content);
  const hasFrontmatter = Object.keys(frontmatter).length > 0;

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    // Adds a clickable link icon before each heading (like GitHub).
    // We use ariaHidden instead of className because rehype-sanitize
    // strips unrecognized class values. CSS targets a[aria-hidden] instead.
    // Click behavior (copy permalink + toast) is in <HeadingAnchorHandler>.
    .use(rehypeAutolinkHeadings, {
      behavior: "prepend",
      properties: {
        ariaHidden: "true",
        tabIndex: -1,
      },
      content: {
        type: "element",
        tagName: "svg",
        properties: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 16 16",
          width: 16,
          height: 16,
          fill: "currentColor",
        },
        children: [
          {
            type: "element",
            tagName: "path",
            properties: {
              d: "m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z",
            },
            children: [],
          },
        ],
      },
    })
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
    .process(markdownContent);

  return (
    <>
      <HeadingAnchorHandler />
      {hasFrontmatter && <FrontmatterDisplay data={frontmatter} />}
      <div
        className="markdown-body max-w-none"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: String(result) }}
      />
      {headings.length >= 3 && <TableOfContents headings={headings} />}
    </>
  );
}
