import { isValidGistId } from "@/lib/github";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Best-effort rate limit: in-memory, so resets on cold starts (fine for serverless)
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 1 minute

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ user: string; gistId: string }> },
) {
  const { user, gistId } = await params;

  if (!isValidGistId(gistId)) {
    return NextResponse.json({ error: "Invalid gist ID" }, { status: 400 });
  }

  const now = Date.now();
  const lastRefresh = cooldowns.get(gistId);
  if (lastRefresh && now - lastRefresh < COOLDOWN_MS) {
    const retryAfter = Math.ceil((COOLDOWN_MS - (now - lastRefresh)) / 1000);
    return NextResponse.json(
      { error: "Too many refresh requests" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  cooldowns.set(gistId, now);
  // Purge the Data Cache (GitHub API responses) and the Vercel CDN edge cache
  // (matched via Vercel-Cache-Tag set in proxy.ts) immediately
  revalidateTag(`gist-${gistId}`, { expire: 0 });
  // Purge the Full Route Cache so the next request triggers a fresh render
  revalidatePath(`/${user}/${gistId}`);

  return NextResponse.json({ revalidated: true });
}
