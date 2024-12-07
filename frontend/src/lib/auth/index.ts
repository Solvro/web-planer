import CryptoJS, { HmacSHA1 } from "crypto-js";
import { cookies as cookiesPromise } from "next/headers";
import OAuth from "oauth-1.0a";

import { env } from "@/env.mjs";

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

export const auth = async ({
  token,
  secret,
}: {
  token?: string | null;
  secret?: string | null;
}) => {
  const cookies = await cookiesPromise();
  const accessToken = token ?? cookies.get("access_token")?.value;
  const accessSecret = secret ?? cookies.get("access_token_secret")?.value;

  if (accessToken === "" || accessSecret === "") {
    return false;
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
    const data = (await response.json()) as { error?: string };
    if (data.error !== undefined) {
      cookies.delete({
        name: "access_token",
        path: "/",
      });
      cookies.delete({
        name: "access_token_secret",
        path: "/",
      });
      throw new Error(data.error);
    }
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach((setCookie) => {
      const name = setCookie.split("=")[0];
      const value = setCookie.split("=")[1].split(";")[0];
      cookies.set({
        name,
        value,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: true,
      });
    });
    return true;
  } catch (error) {
    return false;
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
        Cookie: `adonis-session=${adonisSession}; token=${token}`,
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
  } catch (error) {
    return null;
  }
};
