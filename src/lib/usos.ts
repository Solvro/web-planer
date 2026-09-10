import { createHmac } from "node:crypto";
import OAuth from "oauth-1.0a";

const USOS_APPS_URL =
  process.env.USOS_APPS_URL ?? "https://apps.usos.pwr.edu.pl";
const USOS_CONSUMER_KEY = process.env.USOS_CONSUMER_KEY ?? "";
const USOS_CONSUMER_SECRET = process.env.USOS_CONSUMER_SECRET ?? "";

function createHmacSha1Base64(baseString: string, key: string) {
  return createHmac("sha1", key).update(baseString).digest("base64");
}

const oauth = new OAuth({
  consumer: { key: USOS_CONSUMER_KEY, secret: USOS_CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return createHmacSha1Base64(baseString, key);
  },
});

export class UsosApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, statusText: string, body: string) {
    super(`USOS API request failed: ${status.toString()} ${statusText}`);
    this.name = "UsosApiError";
    this.status = status;
    this.body = body;
  }
}

export function isUsosObjectNotFound(error: unknown): boolean {
  if (!(error instanceof UsosApiError) || error.status !== 400) {
    return false;
  }
  try {
    const parsed = JSON.parse(error.body) as { error?: string };
    return parsed.error === "object_not_found";
  } catch {
    return false;
  }
}

async function requestUsosApi(
  endpoint: string,
  parameters_: Record<string, string | number | boolean> | undefined,
  method: "GET" | "POST",
  signed: boolean,
): Promise<Response> {
  const url = `${USOS_APPS_URL}/services/${endpoint}`;
  const data = parameters_ ?? {};
  const parameters = new URLSearchParams();

  if (signed && USOS_CONSUMER_KEY !== "") {
    const authData = oauth.authorize({ url, method, data });
    for (const [key, value] of Object.entries(authData)) {
      parameters.append(key, String(value));
    }
    for (const [key, value] of Object.entries(data)) {
      parameters.append(key, String(value));
    }
    return fetch(`${url}?${parameters.toString()}`, {
      method,
      headers: { Authorization: oauth.toHeader(authData).Authorization },
    });
  }

  for (const [key, value] of Object.entries(data)) {
    parameters.append(key, String(value));
  }
  return fetch(`${url}?${parameters.toString()}`, { method });
}

export async function fetchUsosApi<T>(
  endpoint: string,
  parameters_?: Record<string, string | number | boolean>,
  method: "GET" | "POST" = "GET",
): Promise<T> {
  let response = await requestUsosApi(endpoint, parameters_, method, true);
  // Consumer: ignored / optional methods still work if the consumer key is rejected.
  if (response.status === 401) {
    response = await requestUsosApi(endpoint, parameters_, method, false);
  }

  if (!response.ok) {
    throw new UsosApiError(
      response.status,
      response.statusText,
      await response.text(),
    );
  }

  return response.json() as Promise<T>;
}
