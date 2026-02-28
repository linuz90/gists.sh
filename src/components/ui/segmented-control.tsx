"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const idx = options.findIndex((o) => o.value === value);
    const btn = container.children[idx + 1] as HTMLElement; // +1 for the indicator div
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex rounded-lg bg-neutral-100 dark:bg-neutral-900 p-0.5"
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-0.5 h-[calc(100%-4px)] rounded-md bg-white dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700 shadow-sm transition-all duration-300 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative z-[1] inline-flex items-center font-mono text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer select-none ${
            value === opt.value
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
