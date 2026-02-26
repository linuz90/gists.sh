export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">gists.sh</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Beautiful GitHub Gist viewer
        </p>
        <p className="text-sm text-neutral-400 dark:text-neutral-500">
          Go to <code className="font-mono text-neutral-600 dark:text-neutral-300">gists.sh/username/gist-id</code> to view a gist
        </p>
      </div>
    </main>
  );
}
