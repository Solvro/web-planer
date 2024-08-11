import { USOS_APPS_URL } from "@/env.mjs";
import { oauth } from "@/lib/auth";

const baseUrl = `${USOS_APPS_URL}/services`;

export const createClient = ({
  token,
  secret,
  fetch,
}: {
  token?: string;
  secret?: string;
  fetch: typeof window.fetch;
}) => {
  if (!token || !secret) {
    throw new Error("No token or secret provided");
  }
  return {
    async get<R = unknown>(endpoint: string): Promise<R> {
      const url = `${baseUrl}/${endpoint}`;

      const data = oauth.authorize(
        {
          url,
          method: "GET",
        },
        {
          key: token,
          secret,
        }
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
        console.log("Not ok", await response.text());
        throw new Error("Unauthorized");
      }

      return response.json();
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
        }
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

      return response.json();
    },
  };
};

export type UsosClient = ReturnType<typeof createClient>;
