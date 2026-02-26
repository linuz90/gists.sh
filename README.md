# gists.sh

A beautiful, minimal gist viewer. Makes GitHub Gists look good.

## How it works

- `gists.sh/{user}/{gist_id}` → beautifully rendered gist
- `gists.sh/{user}/{gist_id}.md` → raw content

## Stack

- Next.js 15 (App Router)
- Tiptap for markdown rendering
- Shiki for syntax highlighting
- Deployed on Vercel

## Development

```bash
npm install
npm run dev
```
