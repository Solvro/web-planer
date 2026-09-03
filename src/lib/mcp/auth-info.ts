import type { AuthInfo } from "@modelcontextprotocol/server";
import type { JWTPayload } from "jose";

export function claimsToAuthInfo(
  request: Request,
  claims: JWTPayload,
): AuthInfo {
  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const scope = typeof claims.scope === "string" ? claims.scope : "";

  return {
    token,
    clientId: typeof claims.aud === "string" ? claims.aud : "",
    scopes: scope.length > 0 ? scope.split(" ") : [],
    expiresAt: claims.exp,
    extra: { userId: claims.sub ?? "" },
  };
}

export function userIdFromAuthInfo(authInfo: AuthInfo | undefined): string {
  const userId = authInfo?.extra?.userId;
  if (typeof userId !== "string" || userId.length === 0) {
    throw new Error("MCP request is missing an authenticated user id");
  }
  return userId;
}
