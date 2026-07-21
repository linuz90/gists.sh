import { MAX_RAW_FILE_BYTES } from "@/lib/file-preview";
import { fetchGist, getMimeType, isValidGistId } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

function encodeContentDispositionFilename(filename: string): string {
  return encodeURIComponent(filename).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function getRawCacheControl(versioned: boolean): string {
  return versioned
    ? "public, s-maxage=86400, stale-while-revalidate=86400"
    : "public, max-age=0, must-revalidate";
}

function getRawResponseHeaders(
  contentType: string,
  filename: string,
  download: boolean,
  versioned: boolean,
): HeadersInit {
  return {
    "Content-Type": `${contentType}; charset=utf-8`,
    "Content-Security-Policy": "default-src 'none'",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": getRawCacheControl(versioned),
    ...(download && {
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeContentDispositionFilename(filename)}`,
    }),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gistId: string }> },
) {
  const { gistId } = await params;

  if (!isValidGistId(gistId)) {
    return NextResponse.json({ error: "Invalid gist ID" }, { status: 400 });
  }

  const fileParam = request.nextUrl.searchParams.get("file");

  try {
    const gist = await fetchGist(gistId);

    if (!gist) {
      return NextResponse.json({ error: "Gist not found" }, { status: 404 });
    }

    const files = Object.values(gist.files);
    const isCurrentVersion =
      request.nextUrl.searchParams.get("v") === gist.updated_at;

    // Multi-file: when no specific file requested, multiple files exist,
    // and the client accepts markdown, return all files concatenated
    const acceptsMarkdown = request.headers
      .get("accept")
      ?.includes("text/markdown");
    if (!fileParam && files.length > 1 && acceptsMarkdown) {
      if (gist.truncated || files.some((file) => file.truncated)) {
        return NextResponse.json(
          {
            error:
              "Combined output is unavailable because one or more files are too large. Request each file separately with ?file=filename.",
          },
          {
            status: 413,
            headers: { "Cache-Control": "no-store" },
          },
        );
      }

      const combined = files
        .map((f) => `# ${f.filename}\n\n${f.content}`)
        .join("\n\n---\n\n");

      return new NextResponse(combined, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Security-Policy": "default-src 'none'",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": getRawCacheControl(isCurrentVersion),
        },
      });
    }

    const targetFile = fileParam
      ? files.find((f) => f.filename === fileParam)
      : files[0];

    if (!targetFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (targetFile.size > MAX_RAW_FILE_BYTES) {
      return NextResponse.json(
        {
          error: "Files larger than 10 MB must be cloned from GitHub.",
          git_pull_url: gist.git_pull_url,
        },
        {
          status: 413,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const contentType = getMimeType(targetFile.filename);
    const download = request.nextUrl.searchParams.has("download");
    const headers = getRawResponseHeaders(
      contentType,
      targetFile.filename,
      download,
      isCurrentVersion,
    );

    // GitHub omits the remainder of large files from the gist API response.
    // Stream its revision-specific raw URL so copy and download actions receive
    // the complete file without adding it to the page's server/client payload.
    if (targetFile.truncated) {
      const rawResponse = await fetch(targetFile.raw_url, {
        // Large responses exceed Next.js's 2 MB data-cache limit. The route's
        // Cache-Control header still lets the CDN cache the streamed response.
        cache: "no-store",
      });

      if (!rawResponse.ok || !rawResponse.body) {
        throw new Error(`GitHub raw content error: ${rawResponse.status}`);
      }

      return new NextResponse(rawResponse.body, { headers });
    }

    return new NextResponse(targetFile.content, {
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
