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
    <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 pb-px">
      {filenames.map((name) => (
        <button
          key={name}
          onClick={() => handleTabClick(name)}
          className={`px-3 py-2 text-sm font-mono whitespace-nowrap transition-colors rounded-t-md ${
            name === activeFile
              ? "text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100"
              : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
