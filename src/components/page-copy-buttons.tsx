"use client";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Files,
  Link,
  RotateCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface PageCopyButtonsProps {
  content: string;
  filename: string;
  originalUrl: string;
  user: string;
  gistId: string;
  showCopyFormatted?: boolean;
}

export function PageCopyButtons({
  content,
  filename,
  originalUrl,
  user,
  gistId,
  showCopyFormatted = false,
}: PageCopyButtonsProps) {
  const { copied, copy, copyFormatted } = useCopyToClipboard();
  const router = useRouter();
  const refreshingRef = useRef(false);

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

  const handleCopyOriginalUrl = useCallback(() => {
    copy(originalUrl, "Original URL copied");
  }, [copy, originalUrl]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("File downloaded");
  }, [content, filename]);

  const handleOpenOriginal = useCallback(() => {
    window.open(originalUrl, "_blank", "noopener,noreferrer");
  }, [originalUrl]);

  const handleRefresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;

    const toastId = toast.loading("Refreshing gist...");
    try {
      const res = await fetch(`/${user}/${gistId}/refresh`, { method: "POST" });
      if (res.ok) {
        // Brief delay so the revalidated content is available before Next.js refetches
        await new Promise((r) => setTimeout(r, 1000));
        router.refresh();
        toast.success("Gist refreshed", { id: toastId });
      } else if (res.status === 429) {
        toast.error("Please wait a minute before refreshing again", {
          id: toastId,
        });
      } else {
        toast.error("Failed to refresh gist", { id: toastId });
      }
    } catch {
      toast.error("Failed to refresh gist", { id: toastId });
    } finally {
      refreshingRef.current = false;
    }
  }, [user, gistId, router]);

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
        case "d":
          handleDownload();
          break;
        case "f":
          if (showCopyFormatted) handleCopyFormatted();
          break;
        case "l":
          handleCopyLink();
          break;
        case "g":
          handleCopyOriginalUrl();
          break;
        case "o":
          handleOpenOriginal();
          break;
        case "r":
          handleRefresh();
          break;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    handleCopyRaw,
    handleCopyFormatted,
    handleCopyLink,
    handleCopyOriginalUrl,
    handleDownload,
    handleOpenOriginal,
    handleRefresh,
    showCopyFormatted,
  ]);

  const triggerClass =
    "p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors outline-none";

  const shortcutClass =
    "text-[0.6875rem] text-neutral-500 dark:text-neutral-400 ml-4";

  return (
    <div className="flex items-center ml-3 -mt-1 -mr-1 shrink-0">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className={triggerClass}
            aria-label={copied ? "Copied" : "Copy"}
            suppressHydrationWarning
          >
            {copied ? (
              <Check size={15} className="text-green-600 dark:text-green-400" />
            ) : (
              <Copy size={15} className="opacity-60" />
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="bottom" align="end">
          <DropdownMenu.Item onSelect={handleCopyRaw}>
            <Copy size={14} />
            <span className="flex-1">Copy raw</span>
            <span className={shortcutClass}>C</span>
          </DropdownMenu.Item>
          {showCopyFormatted && (
            <DropdownMenu.Item onSelect={handleCopyFormatted}>
              <Files size={14} />
              <span className="flex-1">Copy formatted</span>
              <span className={shortcutClass}>F</span>
            </DropdownMenu.Item>
          )}
          <DropdownMenu.Item onSelect={handleDownload}>
            <Download size={14} />
            <span className="flex-1">Download file</span>
            <span className={shortcutClass}>D</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleCopyLink}>
            <Link size={14} />
            <span className="flex-1">Copy link</span>
            <span className={shortcutClass}>L</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleCopyOriginalUrl}>
            <Link size={14} />
            <span className="flex-1">Copy original URL</span>
            <span className={shortcutClass}>G</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={handleOpenOriginal}>
            <ExternalLink size={14} />
            <span className="flex-1">Open on GitHub</span>
            <span className={shortcutClass}>O</span>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={handleRefresh}>
            <RotateCw size={14} />
            <span className="flex-1">Refresh gist</span>
            <span className={shortcutClass}>R</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
