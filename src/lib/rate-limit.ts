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

    if (Math.random() < 0.01) {
      await prisma.$executeRaw`
        DELETE FROM rate_limit_buckets
        WHERE expires_at < NOW()
      `;
    }

    return rows[0].count <= limit;
  }
}

export const checkoutRateLimit = new RateLimiter("checkout");
export const adminAuthRateLimit = new RateLimiter("admin-auth");
export const authRateLimit = new RateLimiter("customer-auth");
