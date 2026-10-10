import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export class RateLimiter {
  constructor(private readonly namespace: string) {}

  async check(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isSafeInteger(windowMs) || windowMs < 1000) {
      throw new Error("Invalid rate-limit configuration");
    }

    const windowSeconds = Math.ceil(windowMs / 1000);
    const windowStart = BigInt(Math.floor(Date.now() / (windowSeconds * 1000)));
    const key = createHash("sha256")
      .update(`${this.namespace}:${identifier}`)
      .digest("hex");

    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO rate_limit_buckets (key, window_start, count, expires_at)
      VALUES (${key}, ${windowStart}, 1, NOW() + (${windowSeconds} * INTERVAL '1 second') * 2)
      ON CONFLICT (key, window_start)
      DO UPDATE SET count = rate_limit_buckets.count + 1
      RETURNING count
    `;

    const row = rows[0];
    if (!row) {
      throw new Error("Rate limiter did not return a counter");
    }

    if (Math.random() < 0.01) {
      try {
        await prisma.$executeRaw`
          DELETE FROM rate_limit_buckets
          WHERE expires_at < NOW()
        `;
      } catch (error) {
        // Cleanup is best-effort maintenance. A transient cleanup failure must not
        // turn an otherwise valid customer/auth request into a 500 response.
        console.warn("Rate-limit bucket cleanup failed", error instanceof Error ? error.message : "unknown error");
      }
    }

    return row.count <= limit;
  }
}

export const checkoutRateLimit = new RateLimiter("checkout");
export const adminAuthRateLimit = new RateLimiter("admin-auth");
export const authRateLimit = new RateLimiter("customer-auth");
