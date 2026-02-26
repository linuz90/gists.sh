"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="top"
          sideOffset={6}
          className="z-50 rounded-md bg-neutral-900 px-2 py-1 text-[0.6875rem] leading-[1.4] text-neutral-50 whitespace-nowrap dark:bg-neutral-200 dark:text-neutral-900 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
        >
          {label}
          <RadixTooltip.Arrow className="fill-neutral-900 dark:fill-neutral-200" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
