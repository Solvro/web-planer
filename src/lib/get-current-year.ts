import { cacheLife } from "next/cache";

// eslint-disable-next-line @typescript-eslint/require-await -- "use cache" requires an async function
export async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
