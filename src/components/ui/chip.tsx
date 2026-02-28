"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Chip({ active, onClick, children, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono text-xs rounded-md px-2.5 py-1 transition-colors cursor-pointer select-none",
        active
          ? "bg-neutral-800 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500",
        className,
      )}
    >
      {children}
    </button>
  );
}
