type RedisLike = {
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    options?: {
      ex?: number;
      nx?: boolean;
    },
  ): Promise<unknown>;
  del(key: string): Promise<unknown>;
};

type GetOrSetRedisOptions<T> = {
  redis: RedisLike;
  key: string;
  ttlSeconds: number;
  fetcher: () => Promise<T>;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  lockTimeoutSeconds?: number;
  waitForLockMs?: number;
  waitPollIntervalMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const lockAcquired = await redis.set(lockKey, "1", {
      nx: true,
      ex: lockTimeoutSeconds,
    });

    if (lockAcquired) {
      try {
        const fresh = await fetcher();

        await redis.set(key, serialize(fresh), {
          ex: ttlSeconds,
        });

        return fresh;
      } finally {
        await redis.del(lockKey).catch(() => undefined);
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
