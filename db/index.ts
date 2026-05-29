import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema";
import path from "path";

const client = createClient({ 
  url: process.env.DATABASE_URL || "file:sqlite.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
  fetch: (url: string | URL | Request, options?: RequestInit) => {
    // Mem-bypass cache Next.js agar error asli dari Turso tidak tertutupi
    return fetch(url, { ...options, cache: "no-store" });
  }
});

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });
