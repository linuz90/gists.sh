import { NextRequest, NextResponse } from "next/server";

const RAW_EXTENSIONS = [
  ".md", ".txt", ".json", ".js", ".ts", ".py", ".css", ".html",
  ".xml", ".yaml", ".yml", ".toml", ".sh", ".go", ".rs", ".rb",
  ".java", ".c", ".cpp", ".swift", ".kt", ".sql",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const parts = pathname.split("/").filter(Boolean);

  // Only handle /{user}/{gistId.ext} pattern
  if (parts.length !== 2) return NextResponse.next();

  const gistIdWithExt = parts[1];

  for (const ext of RAW_EXTENSIONS) {
    if (gistIdWithExt.endsWith(ext)) {
      const gistId = gistIdWithExt.slice(0, -ext.length);
      const url = request.nextUrl.clone();
      url.pathname = `/api/raw/${gistId}`;
      // Preserve ?file= param
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
