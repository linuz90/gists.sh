"use client";

import { useState, useCallback, useRef } from "react";
import { ClipboardIcon, CheckIcon, LinkIcon } from "./copy-button";
import { Tooltip } from "./tooltip";

interface PageCopyButtonsProps {
  content: string;
}

export function PageCopyButtons({ content }: PageCopyButtonsProps) {
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const rawTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const linkTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }, []);

  const handleCopyRaw = useCallback(async () => {
    await copyText(content);
    setCopiedRaw(true);
    if (rawTimeout.current) clearTimeout(rawTimeout.current);
    rawTimeout.current = setTimeout(() => setCopiedRaw(false), 2000);
  }, [content, copyText]);

  const handleCopyLink = useCallback(async () => {
    await copyText(window.location.href);
    setCopiedLink(true);
    if (linkTimeout.current) clearTimeout(linkTimeout.current);
    linkTimeout.current = setTimeout(() => setCopiedLink(false), 2000);
  }, [copyText]);

  const btnClass =
    "p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors";

  return (
    <div className="flex items-center gap-1 ml-3 shrink-0">
      <Tooltip label={copiedRaw ? "Copied!" : "Copy raw"}>
        <button
          onClick={handleCopyRaw}
          className={btnClass}
          aria-label={copiedRaw ? "Copied" : "Copy raw content"}
        >
          {copiedRaw ? <CheckIcon /> : <ClipboardIcon />}
        </button>
      </Tooltip>
      <Tooltip label={copiedLink ? "Copied!" : "Copy link"}>
        <button
          onClick={handleCopyLink}
          className={btnClass}
          aria-label={copiedLink ? "Copied" : "Copy link"}
        >
          {copiedLink ? <CheckIcon /> : <LinkIcon />}
        </button>
      </Tooltip>
    </div>
  );
}
