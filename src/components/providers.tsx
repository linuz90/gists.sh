"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Toaster } from "sonner";

/**
 * Reads ?theme=dark|light from the URL and tells the parent to set
 * forcedTheme on ThemeProvider. This prevents URL-forced themes from
 * persisting to localStorage and polluting other tabs/pages.
 */
function ThemeParamSync({
  onForcedTheme,
}: {
  onForcedTheme: (theme: string | undefined) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const theme = searchParams.get("theme");
    if (theme === "dark" || theme === "light") {
      onForcedTheme(theme);
    } else {
      onForcedTheme(undefined);
    }
  }, [searchParams, onForcedTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // When a URL param forces a theme (?theme=dark|light), we use
  // next-themes' forcedTheme so the choice is page-specific and
  // doesn't write to localStorage / affect other tabs.
  const [forcedTheme, setForcedTheme] = useState<string | undefined>();

  const handleForcedTheme = useCallback(
    (theme: string | undefined) => setForcedTheme(theme),
    [],
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={forcedTheme}
    >
      <Suspense>
        <ThemeParamSync onForcedTheme={handleForcedTheme} />
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
