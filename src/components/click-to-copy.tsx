"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

export function ClickToCopy({ text, toastMessage = "Copied to clipboard" }: { text: string; toastMessage?: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text, toastMessage)}
      className="flex items-center justify-between w-full font-mono text-[13px] bg-neutral-100 dark:bg-neutral-900 rounded-lg px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
    >
      <span>{text}</span>
      {copied ? (
        <Check size={15} className="text-green-600 dark:text-green-400 shrink-0 ml-3" />
      ) : (
        <Copy size={15} className="text-neutral-400 dark:text-neutral-500 shrink-0 ml-3" />
      )}
    </button>
  );
}
