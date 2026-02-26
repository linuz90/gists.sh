"use client";

import { useState, useCallback, useRef } from "react";
import { copyToClipboard } from "@/lib/clipboard";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const copy = useCallback(async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  return { copied, copy };
}
