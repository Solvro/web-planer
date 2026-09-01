import type { Redis } from "ioredis";
import { after } from "next/server";

interface GetOrSetRedisSmartOptions<T> {
  redis: Redis;
  key: string;
  minFreshSeconds: number;
  maxStaleSeconds: number;
  fetcher: () => Promise<T>;
  lockSeconds?: number;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

interface StoredEntry {
  data: string;
  fetchedAt: number;
}

async function readCache<T>(
  redis: Redis,
  key: string,
  deserialize: (value: string) => T,
): Promise<CacheEntry<T> | null> {
  try {
    const raw = await redis.get(key);
    if (raw == null) {
      return null;
    }
    const stored = JSON.parse(raw) as StoredEntry;
    return { data: deserialize(stored.data), fetchedAt: stored.fetchedAt };
  } catch {
    return null;
  }
}

async function refresh<T>({
  redis,
  key,
  fetcher,
  lockSeconds,
  serialize,
  maxStaleSeconds,
}: {
  redis: Redis;
  key: string;
  fetcher: () => Promise<T>;
  lockSeconds: number;
  serialize: (value: T) => string;
  maxStaleSeconds: number;
}): Promise<T | null> {
  const lockKey = `${key}:lock`;
  const lockAcquired = await redis.set(lockKey, "1", "EX", lockSeconds, "NX");

  if (!lockAcquired) {
    return null;
  }

  try {
    const data = await fetcher();
    const entry: StoredEntry = { data: serialize(data), fetchedAt: Date.now() };
    await redis.set(key, JSON.stringify(entry), "EX", maxStaleSeconds);
    return data;
  } catch {
    return null;
  } finally {
    await redis.del(lockKey).catch(() => {
      /* empty */
    });
  }
}

export async function getOrSetRedisSmart<T>({
  redis,
  key,
  minFreshSeconds,
  maxStaleSeconds,
  fetcher,
  lockSeconds = 60,
  serialize = JSON.stringify,
  deserialize = JSON.parse as (value: string) => T,
}: GetOrSetRedisSmartOptions<T>): Promise<T> {
  const cached = await readCache(redis, key, deserialize);
  const ageSeconds =
    cached == null
      ? Number.POSITIVE_INFINITY
      : (Date.now() - cached.fetchedAt) / 1000;

  if (cached != null && ageSeconds < minFreshSeconds) {
    return cached.data;
  }

  if (cached != null && ageSeconds < maxStaleSeconds) {
    after(async () => {
      await refresh({
        redis,
        key,
        fetcher,
        lockSeconds,
        serialize,
        maxStaleSeconds,
      });
    });
    return cached.data;
  }

  const fresh = await refresh({
    redis,
    key,
    fetcher,
    lockSeconds,
    serialize,
    maxStaleSeconds,
  });

  if (fresh != null) {
    return fresh;
  }

  if (cached != null) {
    return cached.data;
  }

  return fetcher();
}
