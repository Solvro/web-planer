import CryptoJS, { HmacSHA1 } from "crypto-js";
import OAuth from "oauth-1.0a";

const USOS_APPS_URL =
  process.env.USOS_APPS_URL ?? "https://apps.usos.pwr.edu.pl";
const USOS_CONSUMER_KEY = process.env.USOS_CONSUMER_KEY ?? "";
const USOS_CONSUMER_SECRET = process.env.USOS_CONSUMER_SECRET ?? "";

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

export async function fetchUsosApi<T>(
  endpoint: string,
  parameters_?: Record<string, string | number | boolean>,
  method: "GET" | "POST" = "GET",
): Promise<T> {
  const url = `${USOS_APPS_URL}/services/${endpoint}`;

  const requestData = {
    url,
    method,
    data: parameters_ ?? {},
  };

  const authData = oauth.authorize(requestData);

  const parameters = new URLSearchParams();

  for (const [key, value] of Object.entries(authData)) {
    parameters.append(key, String(value));
  }

  if (parameters_ != null) {
    for (const [key, value] of Object.entries(parameters_)) {
      parameters.append(key, String(value));
    }
  }

  const fetchUrl = `${url}?${parameters.toString()}`;

  const response = await fetch(fetchUrl, {
    method,
    headers: { Authorization: oauth.toHeader(authData).Authorization },
  });

  if (!response.ok) {
    throw new Error(`USOS API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
