"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FileTabsProps {
  filenames: string[];
  activeFile: string;
  user: string;
  gistId: string;
}

export function FileTabs({
  filenames,
  activeFile,
  user,
  gistId,
}: FileTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabClick = useCallback(
    (filename: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (filename === filenames[0]) {
        params.delete("file");
      } else {
        params.set("file", filename);
      }
      const query = params.toString();
      router.push(`/${user}/${gistId}${query ? `?${query}` : ""}`);
    },
    [router, searchParams, filenames, user, gistId]
  );

  if (filenames.length <= 1) return null;

  return (
    <div className="flex gap-6 overflow-x-auto overflow-y-hidden hide-scrollbar border-b border-neutral-200 dark:border-neutral-800">
      {filenames.map((name) => (
        <button
          key={name}
          onClick={() => handleTabClick(name)}
          className={`py-1.5 text-xs font-mono whitespace-nowrap transition-colors focus:outline-none -mb-px ${
            name === activeFile
              ? "text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100"
              : "text-neutral-500 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 border-b-2 border-transparent"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
