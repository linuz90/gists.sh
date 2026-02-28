import { getFileExtension } from "@/lib/github";
import { codeToHtml } from "shiki";

// Map file extensions to Shiki language identifiers
export function getShikiLang(filename: string, language: string | null): string {
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

export async function highlightCode(
  code: string,
  lang: string,
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang: lang || "text",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  } catch {
    // Fallback for unsupported languages
    return await codeToHtml(code, {
      lang: "text",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });
  }
}
