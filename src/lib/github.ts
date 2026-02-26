export interface GistFile {
  filename: string;
  type: string;
  language: string | null;
  raw_url: string;
  size: number;
  content: string;
}

export interface GistOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Gist {
  id: string;
  description: string | null;
  files: Record<string, GistFile>;
  owner: GistOwner | null;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export async function fetchGist(gistId: string): Promise<Gist | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (res.status === 404) return null;

  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

const MARKDOWN_EXTENSIONS = new Set(["md", "markdown", "mdx"]);

export function isMarkdown(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return MARKDOWN_EXTENSIONS.has(ext);
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "txt";
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const map: Record<string, string> = {
    md: "text/markdown",
    markdown: "text/markdown",
    json: "application/json",
    js: "application/javascript",
    ts: "application/typescript",
    html: "text/html",
    css: "text/css",
    xml: "application/xml",
    yaml: "text/yaml",
    yml: "text/yaml",
    toml: "text/plain",
    py: "text/x-python",
    rb: "text/x-ruby",
    go: "text/x-go",
    rs: "text/x-rust",
    sh: "text/x-shellscript",
    txt: "text/plain",
  };
  return map[ext] ?? "text/plain";
}
