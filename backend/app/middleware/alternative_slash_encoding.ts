import type { HttpContext } from "@adonisjs/core/http";
import { NextFn } from "@adonisjs/core/types/http";

/**
 * Replaces all / in id fields with |.
 *
 * A field is considered to be an "id field" if it's name is "id" or ends with "Id".
 * The object passed in is traversed recursively and modified in-place.
 *
 * @param input the object to transform
 */
function replaceSlashesInIds(input: unknown) {
  // not an object/array - don't care
  if (typeof input !== "object" || input === null) {
    return;
  }
  // array - iterate over items and recurse
  if (Array.isArray(input)) {
    for (const item of input) {
      replaceSlashesInIds(item);
    }
    return;
  }
  // object - iterate over properties, modify and/or recurse
  const obj = input as Record<string, unknown>;
  for (const prop in obj) {
    if (
      (prop === "id" || prop.endsWith("Id")) &&
      typeof obj[prop] === "string"
    ) {
      obj[prop] = obj[prop].replaceAll("/", "|");
    } else if (typeof obj[prop] === "object") {
      replaceSlashesInIds(obj[prop]);
    }
  }
}

/**
 * The traefik proxy really does not like when request URLs include encoded slashes.
 * This can be disabled, but it would risk exposing path traversal vulnerabilities in badly written software.
 * So instead, the backend allows substituting / in URL parameters with |.
 * This middleware will also automatically decode all URL parameters, and replace all / with | in "id fields" of responses
 */
export default class AlternativeSlashEncodingMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // edit the parameters
    ctx.params = Object.fromEntries(
      Object.entries(ctx.params).map(([name, value]) => {
        if (typeof value !== "string") {
          return [name, value];
        }
        return [name, decodeURIComponent(value).replaceAll("|", "/")];
      }),
    );

    await next();
    // edit the response
    if (ctx.response.hasContent) {
      replaceSlashesInIds(ctx.response.content?.[0]);
    }
  }
}
