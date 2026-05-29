import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "sqlite.db",
    // @ts-expect-error - Drizzle config types are out of sync in this version
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
