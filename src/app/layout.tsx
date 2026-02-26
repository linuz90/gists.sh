import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gists.sh"),
  title: "gists.sh",
  description: "Gists, but beautiful",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="llms-txt" href="/llms.txt" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=new URLSearchParams(window.location.search);var t=p.get('theme');var m=window.matchMedia('(prefers-color-scheme:dark)');if(t==='dark'||(t!=='light'&&m.matches)){document.documentElement.classList.add('dark')}if(!t){m.addEventListener('change',function(e){document.documentElement.classList.toggle('dark',e.matches)})}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
