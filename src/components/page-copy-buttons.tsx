"use client";

import { useEffect, useCallback } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Clipboard, ClipboardPaste, Check, Link } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

interface PageCopyButtonsProps {
  content: string;
}

export function PageCopyButtons({ content }: PageCopyButtonsProps) {
  const { copied, copy, copyFormatted } = useCopyToClipboard();

  const handleCopyRaw = useCallback(() => {
    copy(content, "Raw content copied");
  }, [copy, content]);

  const handleCopyFormatted = useCallback(() => {
    const el = document.getElementById("gist-content");
    if (!el) return;

    const clone = el.cloneNode(true) as HTMLElement;

    // Remove injected copy buttons from CodeBlockEnhancer
    clone.querySelectorAll(".code-copy-btn").forEach((btn) => btn.remove());

    // Unwrap CodeBlockEnhancer wrapper divs
    clone.querySelectorAll(".code-block-wrapper").forEach((wrapper) => {
      const pre = wrapper.querySelector("pre");
      if (pre && wrapper.parentNode) {
        wrapper.parentNode.insertBefore(pre, wrapper);
        wrapper.remove();
      }
    });

    copyFormatted(clone.innerHTML, content);
  }, [copyFormatted, content]);

  const handleCopyLink = useCallback(() => {
    copy(window.location.href, "Link copied");
  }, [copy]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Skip if any modifier key is held
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;

      // Skip if focus is inside an input, textarea, or contenteditable
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      switch (e.key) {
        case "c":
          handleCopyRaw();
          break;
        case "f":
          handleCopyFormatted();
          break;
        case "l":
          handleCopyLink();
          break;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleCopyRaw, handleCopyFormatted, handleCopyLink]);

  const triggerClass =
    "p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors outline-none";

  const itemClass =
    "flex items-center gap-2.5 px-2.5 py-1.5 text-[0.8125rem] rounded-md outline-none cursor-default select-none text-neutral-200 dark:text-neutral-700 data-[highlighted]:bg-white/10 dark:data-[highlighted]:bg-black/10 data-[highlighted]:text-white dark:data-[highlighted]:text-neutral-900";

  return (
    <div className="flex items-center ml-3 shrink-0">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={triggerClass}
            aria-label={copied ? "Copied" : "Copy"}
            suppressHydrationWarning
          >
            {copied ? (
              <Check size={16} className="text-green-600 dark:text-green-400" />
            ) : (
              <Clipboard size={16} />
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            align="end"
            sideOffset={6}
            className="z-50 min-w-[160px] rounded-lg bg-neutral-900 dark:bg-neutral-200 p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <DropdownMenu.Item className={itemClass} onSelect={handleCopyRaw}>
              <Clipboard size={14} />
              <span className="flex-1">Copy raw</span>
              <span className="text-[0.6875rem] text-neutral-500 dark:text-neutral-400 ml-4">C</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass} onSelect={handleCopyFormatted}>
              <ClipboardPaste size={14} />
              <span className="flex-1">Copy formatted</span>
              <span className="text-[0.6875rem] text-neutral-500 dark:text-neutral-400 ml-4">F</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item className={itemClass} onSelect={handleCopyLink}>
              <Link size={14} />
              <span className="flex-1">Copy link</span>
              <span className="text-[0.6875rem] text-neutral-500 dark:text-neutral-400 ml-4">L</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
