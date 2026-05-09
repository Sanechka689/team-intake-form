type Bucket = {
  firstHitAt: number;
  count: number;
};

const buckets = new Map<string, Bucket>();

function getWindowMs(): number {
  return Number(process.env.RATE_LIMIT_WINDOW_MS ?? '60000');
}

function getMaxHits(): number {
  return Number(process.env.RATE_LIMIT_MAX ?? '8');
}

export function checkRateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const windowMs = getWindowMs();
  const maxHits = getMaxHits();

  const current = buckets.get(key);
  if (!current || now - current.firstHitAt > windowMs) {
    buckets.set(key, { firstHitAt: now, count: 1 });
    return { ok: true, retryAfterSec: 0 };
  }

  if (current.count >= maxHits) {
    const retryAfterSec = Math.ceil((windowMs - (now - current.firstHitAt)) / 1000);
    return { ok: false, retryAfterSec };
  }

  current.count += 1;
  return { ok: true, retryAfterSec: 0 };
}
