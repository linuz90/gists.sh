import { NextRequest, NextResponse } from "next/server";

const RAW_EXTENSIONS = [
  ".md",
  ".txt",
  ".json",
  ".js",
  ".ts",
  ".py",
  ".css",
  ".html",
  ".xml",
  ".yaml",
  ".yml",
  ".toml",
  ".sh",
  ".go",
  ".rs",
  ".rb",
  ".java",
  ".c",
  ".cpp",
  ".swift",
  ".kt",
  ".sql",
];

const isDev = process.env.NODE_ENV === "development";

function buildCsp(): string {
  // No per-request nonce — nonces force dynamic rendering (x-nonce header
  // makes Next.js re-render every request), breaking ISR/CDN caching.
  // 'unsafe-inline' is sufficient here: the site has no auth/sensitive forms,
  // and gist content is sanitized by rehype-sanitize + default-src 'self'.
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://avatars.githubusercontent.com https://www.fabrizio.so",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

const securityHeaders: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "0",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 2) {
    const gistIdWithExt = parts[1];

    // Content negotiation: serve raw content when AI agents request text/markdown
    const accept = request.headers.get("accept") || "";
    const wantsRawContent =
      accept.includes("text/markdown") ||
      (accept.includes("text/plain") && !accept.includes("text/html"));

    if (
      wantsRawContent &&
      /^[a-f0-9]{20}$|^[a-f0-9]{32}$/.test(gistIdWithExt)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/api/raw/${gistIdWithExt}`;
      return applySecurityHeaders(NextResponse.rewrite(url));
    }

    // Handle /{user}/{gistId.ext} pattern for raw rewrites
    for (const ext of RAW_EXTENSIONS) {
      if (gistIdWithExt.endsWith(ext)) {
        const gistId = gistIdWithExt.slice(0, -ext.length);
        const url = request.nextUrl.clone();
        url.pathname = `/api/raw/${gistId}`;
        // Preserve ?file= param; skip CSP for raw text responses
        return applySecurityHeaders(NextResponse.rewrite(url));
      }
    }
  }

  const csp = buildCsp();

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);

  // Force Vercel CDN to cache gist pages for 24h. Next.js sets
  // Cache-Control: private, no-cache for pages with useSearchParams() in a
  // Suspense boundary. We override both Cache-Control (to remove "private",
  // which blocks CDN caching) and set Vercel-CDN-Cache-Control as the
  // authoritative CDN directive.
  // Vercel-Cache-Tag lets revalidateTag() in the refresh endpoint purge the
  // CDN edge cache (not just the Data Cache) for the specific gist.
  const isGistPage =
    parts.length === 2 &&
    /^[a-f0-9]{20}$|^[a-f0-9]{32}$/.test(parts[1]);
  if (isGistPage) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, must-revalidate",
    );
    response.headers.set(
      "Vercel-CDN-Cache-Control",
      "public, s-maxage=86400",
    );
    response.headers.set("Vercel-Cache-Tag", `gist-${parts[1]}`);
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
