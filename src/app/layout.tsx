import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "gists.sh",
  description: "Beautiful GitHub Gist viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
