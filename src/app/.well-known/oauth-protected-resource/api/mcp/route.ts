import { oauthProviderResourceClient } from "@better-auth/oauth-provider/resource-client";
import { connection } from "next/server";

import { env } from "@/env.mjs";
import { auth } from "@/lib/auth";

const resourceClient = oauthProviderResourceClient(auth).getActions();

export async function GET() {
  await connection();
  const metadata = await resourceClient.getProtectedResourceMetadata({
    resource: `${env.SITE_URL}/api/mcp`,
    authorization_servers: [`${env.SITE_URL}/api/auth`],
  });
  return Response.json(metadata);
}
