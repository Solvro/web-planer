import CryptoJS, { HmacSHA1 } from "crypto-js";
import { cookies as cookiesPromise } from "next/headers";
import OAuth from "oauth-1.0a";

import { env } from "@/env.mjs";
import type { User } from "@/types";

function createHmacSha1Base64(base_string: string, key: string) {
  const hmac: CryptoJS.lib.WordArray = HmacSHA1(base_string, key);
  return CryptoJS.enc.Base64.stringify(hmac);
}

export const oauth = new OAuth({
  consumer: { key: env.USOS_CONSUMER_KEY, secret: env.USOS_CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return createHmacSha1Base64(base_string, key);
  },
});

export const getAccessToken = async (
  oauth_token: string,
  oauth_verifier: string,
  secret: string,
) => {
  const data = oauth.authorize(
    {
      url: `${env.USOS_APPS_URL}/services/oauth/access_token`,
      method: "POST",
      data: { oauth_token, oauth_verifier },
    },
    {
      key: oauth_token,
      secret,
    },
  );

  const response = await fetch(
    `${
      env.USOS_APPS_URL
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

  const parameters = new URLSearchParams(text);

  return {
    token: parameters.get("oauth_token"),
    secret: parameters.get("oauth_token_secret"),
  };
};

const removeMultipleSlashesFromUrl = (url: string) => {
  return url.replaceAll(/([^:]\/)\/+/g, "$1");
};

export async function getRequestToken() {
  const data = oauth.authorize({
    url: `${env.USOS_APPS_URL}/services/oauth/request_token`,
    method: "POST",
    data: {
      oauth_callback: removeMultipleSlashesFromUrl(
        `${env.SITE_URL}/api/callback`,
      ),
      scopes: "studies|offline_access",
    },
  });

  const response = await fetch(
    `${env.USOS_APPS_URL}/services/oauth/request_token?${new URLSearchParams(
      Object.entries(data),
    ).toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: oauth.toHeader(data).Authorization,
      },
    },
  );
  const parameters = new URLSearchParams(await response.text());

  return {
    token: parameters.get("oauth_token"),
    secret: parameters.get("oauth_token_secret"),
  };
}

export const auth = async (tokens?: {
  token?: string | undefined;
  secret?: string | undefined;
  disableThrow?: boolean;
}) => {
  const cookies = await cookiesPromise();
  const accessToken = tokens?.token ?? cookies.get("access_token")?.value;
  const accessSecret =
    tokens?.secret ?? cookies.get("access_token_secret")?.value;

  if (accessToken === "" || accessSecret === "") {
    if (tokens !== undefined) {
      return null;
    }
    throw new Error("No access token or access secret");
  }

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, accessSecret }),
      credentials: "include",
    });
    const data = (await response.json()) as User | { error: string };
    if ("error" in data) {
      cookies.delete({
        name: "access_token",
        path: "/",
      });
      cookies.delete({
        name: "access_token_secret",
        path: "/",
      });
      if (tokens !== undefined) {
        return null;
      }
      throw new Error(data.error);
    }

    try {
      const setCookieHeaders = response.headers.getSetCookie();
      for (const cookie of setCookieHeaders) {
        const preparedCookie = cookie.split(";")[0];
        const [name, value] = preparedCookie.split("=");
        cookies.set({
          name,
          value,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: true,
        });
      }
    } catch {}

    return data;
  } catch {
    if (tokens !== undefined) {
      return null;
    }
    throw new Error("Failed to authenticate");
  }
};

export const fetchToAdonis = async <T>({
  url,
  method,
  body,
}: {
  url: string;
  method: RequestInit["method"];
  body?: string | null;
}): Promise<T | null> => {
  try {
    const cookies = await cookiesPromise();
    const adonisSession = cookies.get("adonis-session")?.value;
    const token = cookies.get("token")?.value;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: `adonis-session=${adonisSession ?? ""}; token=${token ?? ""}`,
      },
      credentials: "include",
    };

    if (method !== "GET" && method !== "HEAD" && body !== undefined) {
      fetchOptions.body = body;
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}${url}`,
      fetchOptions,
    );
    const data = (await response.json()) as T;
    return data;
  } catch {
    return null;
  }
};
