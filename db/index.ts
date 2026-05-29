import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "path";

// Initialize SQLite database
const client = createClient({ url: "file:sqlite.db" });

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });
