import { getShikiLang, highlightCode } from "@/lib/shiki";

interface CodeRendererProps {
  content: string;
  filename: string;
  language: string | null;
}

export async function CodeRenderer({
  content,
  filename,
  language,
}: CodeRendererProps) {
  const lang = getShikiLang(filename, language);
  const html = await highlightCode(content, lang);

  return (
    <div
      className="text-[13px] leading-relaxed [&_pre]:rounded-lg [&_pre]:p-5 [&_pre]:overflow-x-auto"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
