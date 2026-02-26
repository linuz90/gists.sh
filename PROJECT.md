# gists.sh — Beautiful Gist Viewer

## What is this?

A minimal, beautifully designed frontend that wraps GitHub Gists. Instead of the clunky gist.github.com UI, gists.sh renders gist content with proper typography, syntax highlighting, and clean design.

## URL Scheme

- `gists.sh/{user}/{gist_id}` → beautiful rendered view
- `gists.sh/{user}/{gist_id}.md` → raw content (proxied from GitHub)
- `gists.sh/{user}/{gist_id}?file=somefile.py` → specific file in multi-file gist

## Domains

- **Primary:** gists.sh
- **Secondary:** gists.app (redirect to gists.sh)

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** for styling
- **Tiptap** for markdown rendering (or react-markdown + remark/rehype if simpler for MVP)
- **Shiki** for code syntax highlighting
- **Deployed on Vercel**

## Design Principles

- **Full minimalism.** White background, clean typography, nothing unnecessary.
- **Content is king.** The rendered gist content takes center stage.
- **Layout:**
  - Top-left: file name/path (small, subtle)
  - Top-right: gist author avatar + username (small, clickable → links to their GitHub)
  - Center: beautifully rendered content (markdown or syntax-highlighted code)
  - For multi-file gists: minimal tab bar below the header to switch files
- **Typography:** Use a clean system font stack or Inter for UI, monospace for code
- **No sidebar, no footer clutter, no ads. Just the content.**

## File Type Rendering

- `.md`, `.markdown` → Rendered markdown with proper typography (headings, lists, tables, code blocks, links, images)
- `.js`, `.ts`, `.py`, `.css`, `.json`, `.yaml`, `.toml`, `.sh`, `.bash`, `.go`, `.rs`, `.rb`, `.java`, `.c`, `.cpp`, `.html`, `.xml`, `.sql`, `.swift`, `.kt`, etc. → Syntax highlighted with Shiki
- `.html` → Syntax highlighted source code, with a small "Preview" toggle/button that shows rendered HTML in a sandboxed iframe
- `.txt`, unknown extensions → Rendered as plain text with monospace font
- **All file types should look beautiful.** Even plain text.

## Multi-file Gists

- If a gist has multiple files, show a minimal horizontal tab bar below the header
- First file is selected by default
- Tabs show file names
- If only one file, no tab bar shown
- `?file=filename.ext` query param to deep-link to a specific file

## Raw Content Endpoint

- `/{user}/{gist_id}.md` (or any extension like `.txt`, `.json`) → serves the raw content
- Proper `Content-Type` headers based on file extension
- This is an API route that proxies from GitHub's raw gist endpoint
- For multi-file gists, serves the first file by default, or use `?file=` param

## Caching Strategy

- Use Next.js ISR (Incremental Static Regeneration) or edge caching
- Cache gist API responses aggressively (gists rarely change)
- Revalidate every 1 hour (or on-demand if we add webhooks later)
- This keeps GitHub API usage minimal (5,000 req/hr with token)

## GitHub API Integration

- Use the GitHub REST API: `GET /gists/{gist_id}`
- Authenticate with a GitHub personal access token (stored in env var `GITHUB_TOKEN`)
- The API returns: files (name, content, language), owner (login, avatar_url), description, created_at, updated_at
- No need for user-facing auth — this is a read-only viewer

## Environment Variables

- `GITHUB_TOKEN` — GitHub PAT for API access (higher rate limits)

## MVP Scope (v0.1)

1. ✅ Single route: `/{user}/{gist_id}` that fetches and renders a gist
2. ✅ Markdown rendering with good typography
3. ✅ Code syntax highlighting with Shiki
4. ✅ Author avatar + name in header
5. ✅ File tabs for multi-file gists
6. ✅ Raw content endpoint: `/{user}/{gist_id}.md`
7. ✅ Responsive design (looks great on mobile too)
8. ✅ Error handling (404 for missing gists, rate limit handling)
9. ✅ Edge caching / ISR

## NOT in MVP

- Landing/home page (can be a simple "What is this?" page later)
- User authentication
- Creating gists through our UI
- Analytics
- Custom themes
- Upgrade/payment flow
