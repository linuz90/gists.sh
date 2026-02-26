"use client";

import { Clipboard, Check, Link } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Tooltip } from "./tooltip";

interface PageCopyButtonsProps {
  content: string;
}

export function PageCopyButtons({ content }: PageCopyButtonsProps) {
  const { copied: copiedRaw, copy: copyRaw } = useCopyToClipboard();
  const { copied: copiedLink, copy: copyLink } = useCopyToClipboard();

  const btnClass =
    "p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors";

  return (
    <div className="flex items-center gap-1 ml-3 shrink-0">
      <Tooltip label={copiedRaw ? "Copied!" : "Copy raw"}>
        <button
          onClick={() => copyRaw(content)}
          className={btnClass}
          aria-label={copiedRaw ? "Copied" : "Copy raw content"}
        >
          {copiedRaw ? <Check size={16} className="text-green-600 dark:text-green-400" /> : <Clipboard size={16} />}
        </button>
      </Tooltip>
      <Tooltip label={copiedLink ? "Copied!" : "Copy link"}>
        <button
          onClick={() => copyLink(window.location.href)}
          className={btnClass}
          aria-label={copiedLink ? "Copied" : "Copy link"}
        >
          {copiedLink ? <Check size={16} className="text-green-600 dark:text-green-400" /> : <Link size={16} />}
        </button>
      </Tooltip>
    </div>
  );
}
