interface HeaderReader {
  get(name: string): string | null;
}

const BOT_UA_PATTERNS: RegExp[] = [
  /claudebot/i,
  /gptbot/i,
  /chatgpt-user/i,
  /perplexitybot/i,
  /googlebot/i,
  /google-extended/i,
  /bingbot/i,
  /applebot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /discordbot/i,
  /ccbot/i,
  /bytespider/i,
];

const BROWSER_ENGINE_RE =
  /(Chrome|CriOS|Firefox|FxiOS|Safari|Edg|OPR)\//i;

export function isBotRequest(headers: HeaderReader): boolean {
  const userAgent = headers.get("user-agent")?.trim() ?? "";
  const secFetchDest = headers.get("sec-fetch-dest");
  const secFetchMode = headers.get("sec-fetch-mode");

  if (BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return true;
  }

  if (!userAgent) {
    return true;
  }

  if (secFetchDest === "document" && secFetchMode === "navigate") {
    return false;
  }

  if (!BROWSER_ENGINE_RE.test(userAgent)) {
    return true;
  }

  return false;
}
