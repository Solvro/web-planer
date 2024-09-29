import { LRUCache } from "lru-cache";

import { USOS_APPS_URL } from "@/env.mjs";
import { oauth } from "@/lib/auth";

const baseUrl = `${USOS_APPS_URL}/services`;

const cache = new LRUCache<string, object>({
  ttl: 60 * 60 * 1000,
  ttlAutopurge: false,
  max: 10000,
});

export const createClient = ({
  token,
  secret,
  fetch,
}: {
  token?: string;
  secret?: string;
  fetch: typeof window.fetch;
}) => {
  if (typeof token !== "string" || typeof secret !== "string") {
    throw new Error("No token or secret provided");
  }
  return {
    async get<R = unknown>(
      endpoint: string,
      { shouldCache }: { shouldCache: boolean } = { shouldCache: true },
    ): Promise<R> {
      const url = `${baseUrl}/${endpoint}`;

      if (cache.has(url) && shouldCache) {
        return cache.get(url) as R;
      }

      const data = oauth.authorize(
        {
          url,
          method: "GET",
        },
        {
          key: token,
          secret,
        },
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: oauth.toHeader(data).Authorization,
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.log("Not ok", await response.text());
        throw new Error("Unauthorized");
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json: object = await response.json();

      if (shouldCache) {
        cache.set(url, json);
      }

      return json as Promise<R>;
    },
    async post<R = unknown>(endpoint: string, body: unknown): Promise<R> {
      const url = `${baseUrl}/${endpoint}`;

      const data = oauth.authorize(
        {
          url,
          method: "POST",
          data: body,
          includeBodyHash: true,
        },
        {
          key: token,
          secret,
        },
      );
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: oauth.toHeader(data).Authorization,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json() as Promise<R>;
    },
  };
};

export type UsosClient = ReturnType<typeof createClient>;
