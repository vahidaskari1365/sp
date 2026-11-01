import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Lazy PostgreSQL client.
 *
 * IMPORTANT: this module must never throw at import time. Next.js imports route
 * and page modules while "Collecting page data" during `next build` — if the
 * connection string were validated at module scope, a build without
 * DATABASE_URL (e.g. a fresh Vercel project) would crash with
 * "Error: DATABASE_URL is required". Instead the pool is created on first
 * actual query, and callers handle failures gracefully.
 */

type Database = NodePgDatabase<Record<string, never>> & { $client: Pool };

const globalForDb = globalThis as typeof globalThis & {
  __termehPgPool?: Pool;
  __termehDb?: Database;
};

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment variables (for Vercel: Project → Settings → Environment Variables).",
    );
  }

  // Managed Postgres providers (Neon, Supabase, Railway…) usually require SSL.
  const requiresSsl =
    process.env.DATABASE_SSL === "true" || /sslmode=(require|verify-ca|verify-full)/.test(connectionString);

  return new Pool({
    connectionString,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
    ...(requiresSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

function getPool(): Pool {
  if (!globalForDb.__termehPgPool) {
    globalForDb.__termehPgPool = createPool();
  }
  return globalForDb.__termehPgPool;
}

function getDb(): Database {
  if (!globalForDb.__termehDb) {
    globalForDb.__termehDb = drizzle(getPool());
  }
  return globalForDb.__termehDb;
}

/**
 * `db` behaves exactly like a normal Drizzle client, but the underlying pool is
 * instantiated on first property access instead of at import time.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    const instance = getDb();
    const value = Reflect.get(instance as object, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
  set(_target, property, value) {
    const instance = getDb();
    return Reflect.set(instance as object, property, value, instance);
  },
  has(_target, property) {
    return Reflect.has(getDb() as object, property);
  },
});

export const pool: Pool = new Proxy({} as Pool, {
  get(_target, property) {
    const instance = getPool();
    const value = Reflect.get(instance as object, property, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
