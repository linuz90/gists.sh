import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page min-h-screen flex items-center justify-center px-5 sm:px-6">
      {/* Pure CSS dark mode fallback — the layout's inline <head> script that adds
          .dark to <html> doesn't reliably execute on Next.js not-found pages
          (special error-boundary rendering path), so we use @media as the
          primary dark mode mechanism here. */}
      <style>{`
        @media (prefers-color-scheme: dark) {
          .not-found-page { background: #0a0a0a; color: #f5f5f5; }
          .not-found-404 { color: #262626 !important; }
          .not-found-msg { color: #a3a3a3 !important; }
          .not-found-link { color: #737373 !important; }
          .not-found-link:hover { color: #d4d4d4 !important; }
          .not-found-logo { color: #f5f5f5 !important; }
          .not-found-logo:hover { color: #a3a3a3 !important; }
        }
      `}</style>
      <div className="text-center space-y-6">
        <Link
          href="/"
          className="not-found-logo inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M11 4V11.5C11 11.8978 11.158 12.2794 11.4393 12.5607C11.7206 12.842 12.1022 13 12.5 13H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6C3 4.34315 4.34315 3 6 3H9.75736C10.553 3 11.3161 3.31607 11.8787 3.87868L20.1213 12.1213C20.6839 12.6839 21 13.447 21 14.2426V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          gists.sh
        </Link>
        <div className="space-y-2">
          <p className="not-found-404 text-5xl font-semibold tracking-tight text-neutral-200 dark:text-neutral-800">
            404
          </p>
          <p className="not-found-msg text-sm text-neutral-500 dark:text-neutral-400">
            This gist doesn&apos;t exist, is private, or the URL is wrong.
          </p>
        </div>
        <Link
          href="/"
          className="not-found-link inline-block text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 transition-colors"
        >
          &larr; Back to homepage
        </Link>
      </div>
    </main>
  );
}
