import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidGistId } from "@/lib/github";

// Best-effort rate limit: in-memory, so resets on cold starts (fine for serverless)
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ user: string; gistId: string }> }
) {
  const { gistId } = await params;

  if (!isValidGistId(gistId)) {
    return NextResponse.json({ error: "Invalid gist ID" }, { status: 400 });
  }

  const now = Date.now();
  const lastRefresh = cooldowns.get(gistId);
  if (lastRefresh && now - lastRefresh < COOLDOWN_MS) {
    const retryAfter = Math.ceil((COOLDOWN_MS - (now - lastRefresh)) / 1000);
    return NextResponse.json(
      { error: "Too many refresh requests" },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  cooldowns.set(gistId, now);
  // expire must match the revalidate window in fetchGist() so Next.js
  // correctly identifies and purges the ISR fetch cache entry for this tag
  revalidateTag(`gist-${gistId}`, { expire: 86400 });

  return NextResponse.json({ revalidated: true });
}
