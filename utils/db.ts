import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "playwright_testing",
  user: "thangle",
});

export async function queryDatabase(sql: string, values: unknown[] = []) {
  await client.connect();

  const result = await client.query(sql, values);

  await client.end();

  return result.rows;
}
