import fetch from "node-fetch";
import crypto from "node:crypto";
import OAuth from "oauth-1.0a";

import logger from "@adonisjs/core/services/logger";

import env from "#start/env";

const baseUrl = `https://apps.usos.pwr.edu.pl/services`;

const oauth = new OAuth({
  consumer: {
    key: env.get("USOS_CONSUMER_KEY"),
    secret: env.get("USOS_CONSUMER_SECRET"),
  },
  signature_method: "HMAC-SHA1",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});
export const createClient = ({
  token,
  secret,
}: {
  token?: string;
  secret?: string;
}) => {
  if (typeof token !== "string" || typeof secret !== "string") {
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
        logger.info("Not ok", await response.text());
        throw new Error("Unauthorized");
      }

      const json = (await response.json()) as R;

      return json;
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
