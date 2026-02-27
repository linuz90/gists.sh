import { HeadingAnchorHandler } from "@/components/heading-anchor-handler";
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

function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function isArrayOfPrimitives(value: unknown): value is (string | number)[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => isPrimitive(v))
  );
}

function isArrayOfObjects(value: unknown): value is Record<string, unknown>[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((v) => typeof v === "object" && v !== null && !Array.isArray(v))
  );
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function PrimitivePills({ items }: { items: (string | number)[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs"
        >
          {String(item)}
        </span>
      ))}
    </div>
  );
}

function ObjectTable({ items }: { items: Record<string, unknown>[] }) {
  const allKeys = [...new Set(items.flatMap((obj) => Object.keys(obj)))];

  return (
    <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900/50">
            {allKeys.map((key) => (
              <th
                key={key}
                className="px-3 py-1.5 text-left font-medium text-neutral-500 dark:text-neutral-500 border-b border-neutral-200 dark:border-neutral-800"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className={
                i < items.length - 1
                  ? "border-b border-neutral-100 dark:border-neutral-800/50"
                  : ""
              }
            >
              {allKeys.map((key) => (
                <td
                  key={key}
                  className="px-3 py-1.5 text-neutral-700 dark:text-neutral-300"
                >
                  {isArrayOfPrimitives(item[key]) ? (
                    <PrimitivePills items={item[key]} />
                  ) : isPrimitive(item[key]) ? (
                    <span className="font-mono">{String(item[key])}</span>
                  ) : item[key] != null ? (
                    <span className="font-mono text-neutral-400">
                      {JSON.stringify(item[key])}
                    </span>
                  ) : (
                    <span className="text-neutral-300 dark:text-neutral-700">
                      -
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BooleanChip({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md font-mono text-xs ${
        value
          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
      }`}
    >
      {String(value)}
    </span>
  );
}

function FrontmatterValue({ value }: { value: unknown }) {
  if (typeof value === "boolean") {
    return <BooleanChip value={value} />;
  }

  if (isPrimitive(value)) {
    return (
      <span className="text-neutral-900 dark:text-neutral-200">
        {String(value)}
      </span>
    );
  }

  if (isArrayOfPrimitives(value)) {
    return <PrimitivePills items={value} />;
  }

  if (isArrayOfObjects(value)) {
    return <ObjectTable items={value} />;
  }

  if (isPlainObject(value)) {
    return <NestedObject data={value} />;
  }

  // Fallback for mixed arrays or other types
  if (Array.isArray(value)) {
    return (
      <PrimitivePills
        items={value.map((v) =>
          typeof v === "string" || typeof v === "number"
            ? v
            : JSON.stringify(v),
        )}
      />
    );
  }

  return (
    <span className="text-neutral-500 font-mono text-xs">
      {JSON.stringify(value)}
    </span>
  );
}

function NestedObject({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data);

  return (
    <div className="flex flex-col gap-2 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800">
      {entries.map(([key, value]) => {
        const isComplex = isPlainObject(value) || isArrayOfObjects(value);

        return isComplex ? (
          <div key={key} className="flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-neutral-400 dark:text-neutral-600">
              {key}
            </span>
            <FrontmatterValue value={value} />
          </div>
        ) : (
          <div key={key} className="flex items-center gap-3">
            <span className="shrink-0 text-xs font-medium text-neutral-400 dark:text-neutral-600">
              {key}
            </span>
            <FrontmatterValue value={value} />
          </div>
        );
      })}
    </div>
  );
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
