import { describe, expect, it } from 'vitest';
import { checkRateLimit } from '@/lib/security/rate-limit';

describe('rate limit', () => {
  it('allows initial requests', () => {
    const first = checkRateLimit('test-key');
    expect(first.ok).toBe(true);
  });
});
