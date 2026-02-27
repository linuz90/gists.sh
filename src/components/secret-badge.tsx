"use client";

import * as Tooltip from "@/components/ui/tooltip";
import { Lock } from "lucide-react";

export function SecretBadge() {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Lock
            className="inline-block size-3 ml-1.5 -mt-0.5 text-neutral-400 dark:text-neutral-500"
            strokeWidth={2.3}
            aria-hidden
          />
        </Tooltip.Trigger>
        <Tooltip.Content>Secret gist</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
