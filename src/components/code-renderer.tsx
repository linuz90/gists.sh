import { highlightCode } from "@/lib/shiki";
import { getFileExtension } from "@/lib/github";

interface CodeRendererProps {
  content: string;
  filename: string;
  language: string | null;
}

// Map file extensions to Shiki language identifiers
function getShikiLang(filename: string, language: string | null): string {
  if (language) {
    const langMap: Record<string, string> = {
      "C#": "csharp",
      "C++": "cpp",
      "Objective-C": "objective-c",
      Shell: "bash",
      Batchfile: "batch",
    };
    return langMap[language] ?? language.toLowerCase();
  }
  const ext = getFileExtension(filename);
  const extMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    py: "python",
    rb: "ruby",
    rs: "rust",
    go: "go",
    sh: "bash",
    bash: "bash",
    zsh: "bash",
    yml: "yaml",
    yaml: "yaml",
    md: "markdown",
    json: "json",
    html: "html",
    css: "css",
    sql: "sql",
    toml: "toml",
    xml: "xml",
    kt: "kotlin",
    swift: "swift",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
  };
  return extMap[ext] ?? "text";
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
      className="text-sm leading-relaxed [&_pre]:rounded-lg [&_pre]:p-5 [&_pre]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
