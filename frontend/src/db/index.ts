import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(connectionString && connectionString.startsWith("postgres"));

// Use singleton in development to prevent connection exhaustion
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

let client: postgres.Sql | null = null;

if (isDatabaseConfigured && connectionString) {
  client = globalForDb.conn ?? postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.conn = client;
  }
}

export const db = client ? drizzle(client, { schema }) : null;
export { schema };
