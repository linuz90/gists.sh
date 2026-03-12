import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - gists.sh",
  description:
    "Terms of service for using gists.sh, a free GitHub Gist viewer.",
};

export default async function TermsPage() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/terms.md"),
    "utf-8"
  );

  return (
    <main className="min-h-screen flex items-start justify-center px-5 sm:px-6 lg:px-8 py-12 sm:py-24">
      <div className="max-w-2xl w-full">
        <Link
          href="/"
          className="inline-block mb-8 text-sm font-medium text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          &larr; gists.sh
        </Link>
        <MarkdownRenderer content={content} />
      </div>
    </main>
  );
}
