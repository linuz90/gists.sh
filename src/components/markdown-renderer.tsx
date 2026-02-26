import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeShiki from "@shikijs/rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const sanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
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
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
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
    <div
      className="markdown-body max-w-none"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: String(result) }}
    />
  );
}
