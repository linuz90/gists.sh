import { Providers } from "@/components/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gists.sh"),
  title: "gists.sh",
  description: "Gists, but beautiful",
};

// Theme initialization order:
// 1) This inline script runs in <head> before first paint to avoid flash.
// 2) It resolves first-paint theme as: ?theme=dark|light, otherwise system.
// 3) It also writes localStorage.theme so next-themes' later body script agrees.
// 4) After hydration, ThemeParamSync keeps runtime state aligned with URL params.
const themePrepaintStyle = `
html,
body {
  background: #ffffff;
  color: #171717;
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  html,
  body {
    background: #0a0a0a;
    color: #f5f5f5;
    color-scheme: dark;
  }
}

html.light,
html.light body {
  background: #ffffff;
  color: #171717;
  color-scheme: light;
}

html.dark,
html.dark body {
  background: #0a0a0a;
  color: #f5f5f5;
  color-scheme: dark;
}
`;

const themeInitScript = `
(() => {
  try {
    const root = document.documentElement;
    const params = new URLSearchParams(window.location.search);
    const queryTheme = params.get("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    const theme =
      queryTheme === "dark" || queryTheme === "light"
        ? queryTheme
        : systemTheme;

    // Keep next-themes' later body script in sync with URL-based overrides.
    localStorage.setItem(
      "theme",
      queryTheme === "dark" || queryTheme === "light" ? queryTheme : "system",
    );

    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themePrepaintStyle }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="llms-txt" href="/llms.txt" />
      </head>
      <body className="font-sans bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
