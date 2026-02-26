# CLAUDE.md — Agent Instructions for gists.sh

## What is this project?

gists.sh is a beautiful, minimal GitHub Gist viewer. It wraps gist.github.com with clean design, proper typography, and syntax highlighting. Read `PROJECT.md` for the full spec.

## Tech Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4
- react-markdown + remark-gfm + rehype for markdown rendering
- Shiki for syntax highlighting
- Deployed on Vercel

## Development

```bash
pnpm install
pnpm dev        # starts dev server on :3000
pnpm build      # production build (always run before pushing)
pnpm lint       # check for lint errors
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
- `GITHUB_TOKEN` — GitHub PAT for API access (higher rate limits)

## Project Structure

- `src/app/[user]/[gistId]/` — main gist viewer route
- `src/app/api/` — API routes (raw content proxy)
- `src/components/` — shared UI components
- `src/lib/` — utilities (GitHub API client, caching, etc.)
- `PROJECT.md` — full product spec and design direction

## Design Principles

- Full minimalism. White background, clean typography, nothing unnecessary.
- Content is king. The rendered gist takes center stage.
- No em dashes (—) in any user-facing copy. Use commas or periods instead.
- Responsive: must look great on mobile.

## Git Conventions

- Commit with clear, descriptive messages
- Always `pnpm build` before pushing (catch type errors)
- Push to `main` branch

## Key Decisions

- We use react-markdown (not Tiptap) for rendering since this is read-only
- Shiki for syntax highlighting (not Prism) — better theme support, same engine as VS Code
- GitHub API responses are cached aggressively (ISR, 1hr revalidation) since gists rarely change
- Raw content served via API route with proper Content-Type headers
