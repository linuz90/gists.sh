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
