/**
 * Cloudflare D1 + Drizzle implementation of DbClientFactory.
 *
 * D1 has no row-level security, so `admin()` and `forUser()` return the same
 * handle. Per-user access control must be implemented in your repositories
 * (e.g. `.where(eq(table.userId, ctx.userId))`).
 */

import type { DbClientFactory, DbHandle } from "@repo/contracts";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../drizzle/schema";

// D1 binding type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Database = any;

export interface DrizzleD1Deps {
  d1: D1Database;
}

export function makeDrizzleD1Factory(deps: DrizzleD1Deps): DbClientFactory {
  const db = drizzle(deps.d1, { schema });

  return {
    admin(): DbHandle {
      return db;
    },
    forUser(_accessToken: string): DbHandle {
      // D1 has no RLS; auth is enforced in repos with explicit user filters.
      return db;
    },
  };
}
