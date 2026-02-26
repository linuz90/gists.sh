# gists.sh

A minimal, beautiful viewer for GitHub Gists. Replace `gist.github.com` with `gists.sh` in any gist URL. That's it.

**[gists.sh](https://gists.sh)**

## Usage

```
gist.github.com/user/abc123  →  gists.sh/user/abc123
```

Markdown gets proper typography. Code gets syntax highlighting via Shiki. Multi-file gists get tabs. Everything looks clean.

### URL parameters

Customize how any gist renders by appending query params:

| Param | Effect |
|---|---|
| `?theme=dark` | Force dark mode |
| `?theme=light` | Force light mode |
| `?noheader` | Hide title, tabs, and copy buttons |
| `?nofooter` | Hide author info and footer |
| `?mono` | Monospace font for all text |

Combine them: `gists.sh/user/abc123?theme=dark&noheader&nofooter`

### Raw content

Append `.md` (or any extension) to get the raw file content with proper `Content-Type` headers:

```
gists.sh/user/abc123.md
```

## Agent skill

Teach your coding agent to use gists.sh links whenever it creates or shares gists. Works with Claude Code, Codex, Cursor, and any agent that supports [skills](https://skills.sh).

```bash
npx skills add linuz90/gists.sh
```

## Self-hosting

```bash
pnpm install
cp .env.local.example .env.local  # add your GITHUB_TOKEN
pnpm dev
```

A [GitHub personal access token](https://github.com/settings/tokens) with the `gist` scope raises your API rate limit from 60 to 5,000 requests/hour. Note: the `gist` scope grants read access to all gists on the account, including secret ones. If that's a concern, use a token from a dedicated account with no sensitive gists.
## Stack

Next.js 15, Tailwind CSS v4, react-markdown, Shiki, deployed on Vercel.

## Author

Built by [Fabrizio Rinaldi](https://fabrizio.so) ([@linuz90](https://x.com/linuz90)).
