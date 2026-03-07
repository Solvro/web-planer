import CryptoJS, { HmacSHA1 } from "crypto-js";
import OAuth from "oauth-1.0a";

const USOS_APPS_URL =
  process.env.USOS_APPS_URL ?? "https://apps.usos.pwr.edu.pl";
const USOS_CONSUMER_KEY = process.env.USOS_CONSUMER_KEY ?? "";
const USOS_CONSUMER_SECRET = process.env.USOS_CONSUMER_SECRET ?? "";
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

function createHmacSha1Base64(baseString: string, key: string) {
  const hmac: CryptoJS.lib.WordArray = HmacSHA1(baseString, key);
  return CryptoJS.enc.Base64.stringify(hmac);
}

const oauth = new OAuth({
  consumer: { key: USOS_CONSUMER_KEY, secret: USOS_CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return createHmacSha1Base64(baseString, key);
  },
});

const removeMultipleSlashesFromUrl = (url: string) => {
  return url.replaceAll(/([^:]\/)\/+/g, "$1");
};

export async function getUsosRequestToken(callbackUrl?: string) {
  const data = oauth.authorize({
    url: `${USOS_APPS_URL}/services/oauth/request_token`,
    method: "POST",
    data: {
      oauth_callback: removeMultipleSlashesFromUrl(
        callbackUrl ?? `${SITE_URL}/api/auth/callback/usos`,
      ),
      scopes: "studies|offline_access",
    },
  });

  const response = await fetch(
    `${USOS_APPS_URL}/services/oauth/request_token?${new URLSearchParams(
      Object.entries(data),
    ).toString()}`,
    {
      method: "POST",
      headers: { Authorization: oauth.toHeader(data).Authorization },
    },
  );
  const parameters = new URLSearchParams(await response.text());

  const token = parameters.get("oauth_token");

  return {
    token,
    secret: parameters.get("oauth_token_secret"),
    authorizeUrl: token
      ? `${USOS_APPS_URL}/services/oauth/authorize?oauth_token=${token}`
      : null,
  };
}

export async function getUsosAccessToken(
  oauthToken: string,
  oauthVerifier: string,
  secret: string,
) {
  const data = oauth.authorize(
    {
      url: `${USOS_APPS_URL}/services/oauth/access_token`,
      method: "POST",
      data: { oauth_token: oauthToken, oauth_verifier: oauthVerifier },
    },
    { key: oauthToken, secret },
  );

  const response = await fetch(
    `${USOS_APPS_URL}/services/oauth/access_token?${new URLSearchParams(Object.entries(data)).toString()}`,
    {
      method: "POST",
      headers: { Authorization: oauth.toHeader(data).Authorization },
    },
  );
  const text = await response.text();
  const parameters = new URLSearchParams(text);

  return {
    token: parameters.get("oauth_token"),
    secret: parameters.get("oauth_token_secret"),
  };
}

export interface UsosUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  student_number: string | null;
  email: string | null;
  photo_urls?: { "50x50"?: string; "100x100"?: string };
}

export async function getUsosUserProfile(
  accessToken: string,
  accessSecret: string,
): Promise<UsosUserProfile | null> {
  const url = `${USOS_APPS_URL}/services/users/user`;
  const requestData = {
    url,
    method: "GET" as const,
    data: { fields: "id|first_name|last_name|student_number|email|photo_urls" },
  };

  const token = { key: accessToken, secret: accessSecret };

  const authData = oauth.authorize(requestData, token);

  const parameters = new URLSearchParams();
  for (const [key, value] of Object.entries(authData)) {
    parameters.append(key, String(value));
  }
  parameters.append(
    "fields",
    "id|first_name|last_name|student_number|email|photo_urls",
  );

  const response = await fetch(`${url}?${parameters.toString()}`, {
    method: "GET",
    headers: { Authorization: oauth.toHeader(authData).Authorization },
  });

  if (!response.ok) {
    return null;
  }

  return response.json() as Promise<UsosUserProfile>;
}

export function getUsosAuthorizationUrl(token: string) {
  return `${USOS_APPS_URL}/services/oauth/authorize?oauth_token=${token}`;
}
