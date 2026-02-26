# gists.sh

A beautiful, minimal gist viewer. Makes GitHub Gists look good.

## How it works

- `gists.sh/{user}/{gist_id}` → beautifully rendered gist
- `gists.sh/{user}/{gist_id}.md` → raw content

## Stack

- Next.js 15 (App Router)
- react-markdown + remark-gfm + rehype for markdown rendering
- Shiki for syntax highlighting
- Deployed on Vercel

## Development

```bash
pnpm install
pnpm dev        # starts dev server on :3000
pnpm build      # production build
```

## Agent Skill

gists.sh ships with an [agent skill](https://skills.sh) that teaches your coding agent to present `gists.sh` URLs whenever you create or share GitHub Gists. Works with Claude Code, Codex, and any agent that supports skills.

```bash
npx skills add linuz90/gists.sh
```

After installing, any gist your agent creates automatically gets a clean `gists.sh` shareable link.
