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
  public: boolean;
  files: Record<string, GistFile>;
  owner: GistOwner | null;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  blog: string | null;
  twitter_username: string | null;
  location: string | null;
}

export async function fetchUser(username: string): Promise<GitHubUser | null> {
  if (!isValidUsername(username)) return null;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

const GIST_ID_RE = /^[a-f0-9]+$/;
const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

export function isValidGistId(id: string): boolean {
  if (!GIST_ID_RE.test(id)) return false;
  return id.length === 20 || id.length === 32;
}

export function isValidUsername(username: string): boolean {
  return (
    username.length >= 1 && username.length <= 39 && USERNAME_RE.test(username)
  );
}

export async function fetchGist(gistId: string): Promise<Gist | null> {
  if (!isValidGistId(gistId)) return null;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers,
    // Tag enables on-demand purge via POST /{user}/{gistId}/refresh
    next: { revalidate: 86400, tags: [`gist-${gistId}`] },
  });

  if (res.status === 404) return null;

  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new Error(
        "GitHub API rate limit exceeded. Please try again later.",
      );
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
