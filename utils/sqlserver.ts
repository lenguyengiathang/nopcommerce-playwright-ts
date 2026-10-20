import sql from "mssql";
import { databaseConfig } from "../config/database.config";

export async function querySqlServer(
  pool: sql.ConnectionPool,
  sqlQuery: string,
  parameters: Record<string, string | number | boolean | Date | null> = {},
) {
  const request = pool.request();

  for (const [name, value] of Object.entries(parameters)) {
    request.input(name, value);
  }

  const result = await request.query(sqlQuery);

  return result.recordset;
}

export async function executeSqlServer(
  pool: sql.ConnectionPool,
  sqlQuery: string,
  parameters: Record<string, string | number | boolean | Date | null> = {},
): Promise<number[]> {
  const request = pool.request();

  for (const [name, value] of Object.entries(parameters)) {
    request.input(name, value);
  }

  const result = await request.query(sqlQuery);

  return result.rowsAffected;
}

export async function createSqlPool() {
  return await sql.connect(databaseConfig);
}
