import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-semibold tracking-tight text-neutral-200 dark:text-neutral-800">
          404
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Gist not found
        </p>
        <Link
          href="/"
          className="inline-block text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          &larr; Back to gists.sh
        </Link>
      </div>
    </main>
  );
}
