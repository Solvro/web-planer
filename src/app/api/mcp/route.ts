import { requireMcpAuth } from "@better-auth/mcp";
import { createMcpHandler } from "@modelcontextprotocol/server";

import { env } from "@/env.mjs";
import { auth } from "@/lib/auth";
import { claimsToAuthInfo } from "@/lib/mcp/auth-info";
import { buildMcpServer } from "@/lib/mcp/server";

const resource = `${env.SITE_URL}/api/mcp`;

const mcpServerHandler = createMcpHandler(() => buildMcpServer(), {
  legacy: "stateless",
});

export const POST = requireMcpAuth(
  auth,
  async (request, claims) =>
    mcpServerHandler.fetch(request, {
      authInfo: claimsToAuthInfo(request, claims),
    }),
  { resource },
);
