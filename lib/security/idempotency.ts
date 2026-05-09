type CacheItem = {
  expiresAt: number;
  response: unknown;
};

const cache = new Map<string, CacheItem>();
const TTL_MS = 10 * 60 * 1000;

export function getIdempotentResponse(key: string): unknown | null {
  const now = Date.now();
  const item = cache.get(key);
  if (!item) {
    return null;
  }
  if (item.expiresAt < now) {
    cache.delete(key);
    return null;
  }
  return item.response;
}

export function saveIdempotentResponse(key: string, response: unknown): void {
  cache.set(key, {
    expiresAt: Date.now() + TTL_MS,
    response
  });
}
