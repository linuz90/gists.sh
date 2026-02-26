"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { copyToClipboard, copyFormattedToClipboard } from "@/lib/clipboard";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const resetAfterCopy = useCallback((message: string) => {
    setCopied(true);
    toast(message, { id: "copy", duration: 2000 });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  const copy = useCallback(async (text: string, label?: string) => {
    await copyToClipboard(text);
    resetAfterCopy(label ?? "Copied to clipboard");
  }, [resetAfterCopy]);

  const copyFormatted = useCallback(async (html: string, plainText: string) => {
    await copyFormattedToClipboard(html, plainText);
    resetAfterCopy("Formatted content copied");
  }, [resetAfterCopy]);

  return { copied, copy, copyFormatted };
}
