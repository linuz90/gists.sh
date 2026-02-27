import { codeToHtml } from "shiki";

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
