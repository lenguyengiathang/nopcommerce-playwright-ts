import { test as base } from "@playwright/test";
import { createSqlPool, querySqlServer, executeSqlServer } from "../utils/sqlserver";

export type DbFixtures = {
  db: {
    query: (
      sqlQuery: string,
      parameters?: Record<string, string | number | boolean | Date | null>,
    ) => Promise<Record<string, unknown>[]>;
    execute: (
      sqlQuery: string,
      parameters?: Record<string, string | number | boolean | Date | null>,
    ) => Promise<number[]>;
  };
};

export const test = base.extend<DbFixtures>({
  db: async ({}, use) => {
    const pool = await createSqlPool();

    try {
      await use({
        query: (sqlQuery, parameters) => querySqlServer(pool, sqlQuery, parameters),
        execute: (sqlQuery, parameters) => executeSqlServer(pool, sqlQuery, parameters),
      });
    } finally {
      await pool.close();
    }
  },
});
