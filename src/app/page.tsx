import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">gists.sh</h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
            GitHub Gists are the fastest way to share code, notes, and snippets.
            But they look terrible. This fixes that.
          </p>
        </div>

        {/* How it works */}
        <div className="space-y-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            How it works
          </h2>
          <div className="space-y-3">
            <div className="font-mono text-sm bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3">
              <span className="text-neutral-400 dark:text-neutral-600 line-through decoration-neutral-300 dark:decoration-neutral-700">
                gist.github.com
              </span>
              <span className="text-neutral-400 dark:text-neutral-600">/user/gist-id</span>
            </div>
            <div className="flex justify-center py-1">
              <ArrowDown size={20} className="text-blue-500" strokeWidth={2} />
            </div>
            <div className="font-mono text-sm bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3">
              <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                gists.sh
              </span>
              <span className="text-neutral-400 dark:text-neutral-600">/user/gist-id</span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 leading-relaxed">
            Replace <code className="font-mono text-neutral-500 dark:text-neutral-400">gist.github.com</code> with <code className="font-mono text-neutral-500 dark:text-neutral-400">gists.sh</code> in
            any gist URL. Clean typography, syntax highlighting, no clutter.
          </p>
        </div>

        {/* Try it */}
        <div className="space-y-5">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Try it
          </h2>
          <a
            href="/linuz90/93618e39c629a4d55c03df4d5391e4ca"
            className="block font-mono text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            gists.sh/linuz90/93618e39c629a4d55c03df4d5391e4ca →
          </a>
        </div>
      </div>
    </main>
  );
}
