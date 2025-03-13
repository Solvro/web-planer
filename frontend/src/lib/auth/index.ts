import CryptoJS, { HmacSHA1 } from "crypto-js";
import { cookies as cookiesPromise } from "next/headers";
import OAuth from "oauth-1.0a";

import { ADONIS_COOKIES } from "@/constants";
import { env } from "@/env.mjs";
import type { User } from "@/types";

function createHmacSha1Base64(base_string: string, key: string) {
  const hmac: CryptoJS.lib.WordArray = HmacSHA1(base_string, key);
  return CryptoJS.enc.Base64.stringify(hmac);
}

const oauth = new OAuth({
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

type AuthType = {
  noThrow?: boolean;
} & (
  | {
      payload?: {
        token: string;
        secret: string;
      };
      type: "usos";
    }
  | {
      payload?: {
        adonisSession: string;
        token: string;
      };
      type: "adonis";
    }
);

export const auth = async ({ payload, noThrow = false, type }: AuthType) => {
  const cookies = await cookiesPromise();
  let accessToken, accessSecret, token;
  if (type === "usos") {
    accessToken = payload?.token ?? cookies.get("access_token")?.value;
    accessSecret = payload?.secret ?? cookies.get("access_token_secret")?.value;
  } else {
    token = payload?.token ?? cookies.get("token")?.value;
  }

  if (
    (type === "usos" && (accessToken === "" || accessSecret === "")) ||
    (type === "adonis" && token === "")
  ) {
    if (noThrow) {
      return null;
    }
    throw new Error("No access token or access secret");
  }

  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}${type === "usos" ? "/user/login" : "/user"}`,
      {
        method: type === "usos" ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: type === "adonis" ? `token=${token ?? ""}` : "",
          "X-XSRF-TOKEN": cookies.get("XSRF-TOKEN")?.value ?? "",
        },
        body:
          type === "usos"
            ? JSON.stringify({ accessToken, accessSecret })
            : undefined,
        credentials: "include",
      },
    );
    if (!response.ok) {
      if (noThrow) {
        return null;
      }
      throw new Error("Failed to authenticate");
    }
    const data = (await response.json()) as User | { error: string };
    if ("error" in data) {
      try {
        cookies.delete({
          name: "access_token",
          path: "/",
        });
        cookies.delete({
          name: "access_token_secret",
          path: "/",
        });
      } catch {}
      if (noThrow) {
        return null;
      }
      throw new Error(data.error);
    }

    try {
      const setCookieHeaders = response.headers.getSetCookie();
      for (const cookie of setCookieHeaders) {
        const preparedCookie = cookie.split(";")[0];
        const [name, value] = preparedCookie.split("=");
        if (name === "XSRF-TOKEN") {
          cookies.set({
            name,
            value,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: false,
            secure: true,
            sameSite: "lax",
          });
        } else if (ADONIS_COOKIES.has(name)) {
          cookies.set({
            name,
            value,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
        }
      }
    } catch {}

    return data;
  } catch {
    if (payload !== undefined) {
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
    const token = cookies.get("token")?.value;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token ?? ""}`,
        "X-XSRF-TOKEN": cookies.get("XSRF-TOKEN")?.value ?? "",
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
