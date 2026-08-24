import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function getPool(): Pool {
  if (globalForPrisma.pool) {
    return globalForPrisma.pool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("[Prisma] DATABASE_URL is not defined in environment variables.");
  }

  const isSSL =
    Boolean(connectionString) &&
    (connectionString?.includes("sslmode=require") ||
      connectionString?.includes("db.prisma.io") ||
      connectionString?.includes("neon.tech") ||
      connectionString?.includes("supabase") ||
      connectionString?.includes("railway") ||
      connectionString?.includes("vercel-storage") ||
      process.env.NODE_ENV === "production");

  const pool = new Pool({
    connectionString: connectionString || undefined,
    ssl: isSSL ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  globalForPrisma.pool = pool;
  return pool;
}

const createPrismaClient = () => {
  const pool = getPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In serverless / edge / dev, keep singleton instance
globalForPrisma.prisma = prisma;

export default prisma;
