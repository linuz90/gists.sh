import { NextRequest, NextResponse } from "next/server";
import { fetchGist, getMimeType } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gistId: string }> }
) {
  const { gistId } = await params;
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
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("rate limit") ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
