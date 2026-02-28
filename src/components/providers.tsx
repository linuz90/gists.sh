"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider, useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Toaster } from "sonner";

function ThemeParamSync() {
  const searchParams = useSearchParams();
  const { setTheme } = useTheme();

  useEffect(() => {
    // Runtime theme source of truth:
    // ?theme=dark|light forces that theme, otherwise use system.
    // This mirrors the early head script in layout.tsx to avoid drift.
    const theme = searchParams.get("theme");
    if (theme === "dark" || theme === "light") {
      setTheme(theme);
    } else {
      setTheme("system");
    }
  }, [searchParams, setTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // next-themes still injects its own script in <body>; the layout head script
    // handles first paint, this provider handles hydrated runtime updates.
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense>
        <ThemeParamSync />
      </Suspense>
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
    </ThemeProvider>
  );
}
