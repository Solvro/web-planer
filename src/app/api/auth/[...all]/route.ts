import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

const { POST: authPost, GET } = toNextJsHandler(auth);

function isLoopbackHttpUri(uri: unknown): boolean {
  if (typeof uri !== "string") {
    return false;
  }
  try {
    const { protocol, hostname } = new URL(uri);
    return (
      protocol === "http:" &&
      (hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1")
    );
  } catch {
    return false;
  }
}

async function POST(request: Request): Promise<Response> {
  if (!new URL(request.url).pathname.endsWith("/oauth2/register")) {
    return authPost(request);
  }

  const body: unknown = await request
    .clone()
    .json()
    .catch(() => null);
  if (
    body === null ||
    typeof body !== "object" ||
    "application_type" in body ||
    !Array.isArray((body as { redirect_uris?: unknown }).redirect_uris) ||
    (body as { redirect_uris: unknown[] }).redirect_uris.length === 0 ||
    !(body as { redirect_uris: unknown[] }).redirect_uris.every((uri) =>
      isLoopbackHttpUri(uri),
    )
  ) {
    return authPost(request);
  }

  return authPost(
    new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify({ ...body, application_type: "native" }),
    }),
  );
}

export { GET, POST };
