import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

const client = createClient({ 
  url: process.env.DATABASE_URL || "file:sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });
