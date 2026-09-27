export class RateLimiter {
  private cache = new Map<string, { count: number; expiresAt: number }>();

  public check(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.cache.get(ip);

    // Clean up expired bounds passively
    if (this.cache.size > 1000) {
      for (const [key, value] of this.cache.entries()) {
        if (now > value.expiresAt) {
          this.cache.delete(key);
        }
      }
    }

    if (!record || now > record.expiresAt) {
      this.cache.set(ip, { count: 1, expiresAt: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false; // Rate limited
    }

    record.count++;
    return true;
  }
}

// Singleton instances for different resources
export const checkoutRateLimit = new RateLimiter();
