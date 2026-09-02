export interface ParsedUserAgent {
  browser: string;
  os: string;
  isMobile: boolean;
}

const BROWSER_PATTERNS: [RegExp, string][] = [
  [/edg\//i, "Edge"],
  [/opr\/|opera/i, "Opera"],
  [/firefox/i, "Firefox"],
  [/chrome|crios/i, "Chrome"],
  [/safari/i, "Safari"],
];

const OS_PATTERNS: [RegExp, string][] = [
  [/windows/i, "Windows"],
  [/mac os x|macintosh/i, "macOS"],
  [/android/i, "Android"],
  [/iphone|ipad|ipod|ios/i, "iOS"],
  [/linux/i, "Linux"],
];

/**
 * Best-effort browser/OS label from a raw User-Agent string, for display
 * only (device names in a session list). Not meant to be exhaustive.
 */
export function parseUserAgent(
  userAgent: string | null | undefined,
): ParsedUserAgent {
  if (userAgent == null || userAgent === "") {
    return {
      browser: "Nieznana przeglądarka",
      os: "Nieznany system",
      isMobile: false,
    };
  }

  const browser =
    BROWSER_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1] ??
    "Nieznana przeglądarka";
  const os =
    OS_PATTERNS.find(([pattern]) => pattern.test(userAgent))?.[1] ??
    "Nieznany system";
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  return { browser, os, isMobile };
}
