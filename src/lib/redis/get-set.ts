import type { Redis } from "ioredis";

interface GetOrSetRedisOptions<T> {
  redis: Redis;
  key: string;
  ttlSeconds: number;
  fetcher: () => Promise<T>;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  lockTimeoutSeconds?: number;
  waitForLockMs?: number;
  waitPollIntervalMs?: number;
}

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getOrSetRedis<T>({
  redis,
  key,
  ttlSeconds,
  fetcher,
  serialize = JSON.stringify,
  deserialize = JSON.parse as (value: string) => T,
  lockTimeoutSeconds = 15,
  waitForLockMs = 3000,
  waitPollIntervalMs = 100,
}: GetOrSetRedisOptions<T>): Promise<T> {
  const lockKey = `${key}:lock`;

  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      return deserialize(cached);
    }

    const lockAcquired = await redis.set(
      lockKey,
      "1",
      "EX",
      lockTimeoutSeconds,
      "NX",
    );

    if (lockAcquired) {
      try {
        const fresh = await fetcher();

        await redis.set(key, serialize(fresh), "EX", ttlSeconds);

        return fresh;
      } finally {
        await redis.del(lockKey).catch(() => {});
      }
    }

    const startedAt = Date.now();

    while (Date.now() - startedAt < waitForLockMs) {
      await sleep(waitPollIntervalMs);

      const cachedAfterWait = await redis.get(key);
      if (cachedAfterWait !== null) {
        return deserialize(cachedAfterWait);
      }
    }

    return await fetcher();
  } catch {
    return await fetcher();
  }
}
