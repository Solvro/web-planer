import { oauthProviderResourceClient } from "@better-auth/oauth-provider/resource-client";

import { env } from "@/env.mjs";
import { auth } from "@/lib/auth";

/**
 * RFC 9728 protected-resource metadata for `/api/mcp`. An authorization
 * server doesn't publish this itself — `requireMcpAuth`'s 401 challenge on
 * `/api/mcp` points here (`{origin}/.well-known/oauth-protected-resource{resource path}`,
 * per RFC 9728 §3.1), so this route has to exist for MCP clients to discover
 * how to authenticate.
 */
const resourceClient = oauthProviderResourceClient(auth).getActions();

export async function GET() {
  const metadata = await resourceClient.getProtectedResourceMetadata({
    resource: `${env.SITE_URL}/api/mcp`,
    authorization_servers: [`${env.SITE_URL}/api/auth`],
  });
  return Response.json(metadata);
}
