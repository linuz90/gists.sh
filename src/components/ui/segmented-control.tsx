"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
  href?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  id?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  id,
}: SegmentedControlProps<T>) {
  return (
    <div className="relative inline-flex rounded-lg bg-neutral-100 dark:bg-neutral-900">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative z-1 inline-flex items-center gap-2 font-mono text-xs px-2.5 py-1 rounded-md transition-colors duration-200 cursor-pointer select-none ${
              isActive
                ? "text-neutral-900 dark:text-neutral-100"
                : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={id ?? "segmented-control-indicator"}
                className="absolute inset-0 rounded-md bg-white dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 shadow-sm"
                transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
              />
            )}
            <span className="relative z-1">{opt.label}</span>
            {opt.href && (
              <a
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative z-1 opacity-40 hover:opacity-100 transition-opacity p-1.5 -m-1.5"
              >
                <ArrowUpRight size={12} />
              </a>
            )}
          </button>
        );
      })}
    </div>
  );
}
