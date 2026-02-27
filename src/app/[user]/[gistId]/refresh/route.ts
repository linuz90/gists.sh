import { isValidGistId } from "@/lib/github";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Best-effort rate limit: in-memory, so resets on cold starts (fine for serverless)
const cooldowns = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ user: string; gistId: string }> },
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
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  cooldowns.set(gistId, now);
  // Route handlers used by external callers (webhooks/agents) should force
  // immediate expiration so the next request is a blocking revalidate.
  revalidateTag(`gist-${gistId}`, { expire: 0 });

  return NextResponse.json({ revalidated: true });
}
