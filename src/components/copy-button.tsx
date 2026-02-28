"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export function CopyButton({
  text,
  className = "",
  label = "Copy",
  children,
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text, "Copied to clipboard")}
      className={className}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
    >
      {children ? (
        children
      ) : copied ? (
        <Check size={15} className="text-green-600 dark:text-green-400" />
      ) : (
        <Copy size={15} className="opacity-60" />
      )}
    </button>
  );
}
