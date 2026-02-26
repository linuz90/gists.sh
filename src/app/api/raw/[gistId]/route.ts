import { NextRequest, NextResponse } from "next/server";
import { fetchGist, getMimeType, isValidGistId } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gistId: string }> }
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
    const targetFile = fileParam
      ? files.find((f) => f.filename === fileParam)
      : files[0];

    if (!targetFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const contentType = getMimeType(targetFile.filename);

    return new NextResponse(targetFile.content, {
      headers: {
        "Content-Type": `${contentType}; charset=utf-8`,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";
    if (message.includes("rate limit")) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
