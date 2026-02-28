"use client";

import { CopyButton } from "@/components/copy-button";

export function CopiableBlock({
  text,
  className,
  preserveNewlines,
}: {
  text: string;
  className?: string;
  preserveNewlines?: boolean;
}) {
  return (
    <div className="relative group">
      <div
        className={`font-mono text-[13px] bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 pr-12 text-neutral-700 dark:text-neutral-300 ${preserveNewlines ? "whitespace-pre-wrap" : ""} ${className ?? ""}`}
      >
        {text}
      </div>
      <div className="absolute top-2.5 right-2.5 opacity-70 scale-85 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 transition-opacity">
        <CopyButton
          text={text}
          className="p-1 rounded cursor-pointer text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400 transition-colors"
        />
      </div>
    </div>
  );
}
