"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={300}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--color-neutral-900)",
            color: "var(--color-neutral-100)",
            border: "none",
            fontSize: "0.8125rem",
          },
        }}
      />
    </TooltipProvider>
  );
}
