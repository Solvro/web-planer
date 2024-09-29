import crypto from "crypto";
import OAuth from "oauth-1.0a";

import { env } from "@/env.mjs";

export const oauth = new OAuth({
  consumer: { key: env.USOS_CONSUMER_KEY, secret: env.USOS_CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

export const getAccessToken = async (
  oauth_token: string,
  oauth_verifier: string,
  secret: string,
) => {
  const data = oauth.authorize(
    {
      url: `https://apps.${env.USOS_BASE_URL}/services/oauth/access_token`,
      method: "POST",
      data: { oauth_token, oauth_verifier },
    },
    {
      key: oauth_token,
      secret,
    },
  );

  const response = await fetch(
    `https://apps.${
      env.USOS_BASE_URL
    }/services/oauth/access_token?${new URLSearchParams(Object.entries(data)).toString()}
		`,
    {
      method: "POST",
      headers: {
        Authorization: oauth.toHeader(data).Authorization,
      },
    },
  );
  const text = await response.text();

  const params = new URLSearchParams(text);

  return {
    token: params.get("oauth_token"),
    secret: params.get("oauth_token_secret"),
  };
};

const removeMultipleSlashesFromUrl = (url: string) => {
  return url.replace(/([^:]\/)\/+/g, "$1");
};

export async function getRequestToken() {
  const data = oauth.authorize({
    url: `https://apps.${env.USOS_BASE_URL}/services/oauth/request_token`,
    method: "POST",
    data: {
      oauth_callback: removeMultipleSlashesFromUrl(
        `${env.SITE_URL}/api/callback`,
      ),
      scopes: "studies|offline_access",
    },
  });

  const response = await fetch(
    `https://apps.${
      env.USOS_BASE_URL
    }/services/oauth/request_token?${new URLSearchParams(
      Object.entries(data),
    ).toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: oauth.toHeader(data).Authorization,
      },
    },
  );
  const params = new URLSearchParams(await response.text());

  return {
    token: params.get("oauth_token"),
    secret: params.get("oauth_token_secret"),
  };
}
