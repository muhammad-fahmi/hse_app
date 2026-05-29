import { createClient } from "@libsql/client/web";
import * as fs from "fs";

async function push() {
  const dbUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error("Missing DATABASE_URL or DATABASE_AUTH_TOKEN in env vars");
    process.exit(1);
  }

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  const sql = fs.readFileSync("drizzle/0000_early_donald_blake.sql", "utf-8");
  
  // Split into individual statements
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Executing ${statements.length} statements...`);
  
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log("Success:", stmt.slice(0, 50) + "...");
    } catch (e) {
      if (e.message && e.message.includes("already exists")) {
        console.log("Already exists:", stmt.slice(0, 50) + "...");
        continue;
      }
      console.error("Error executing statement:");
      console.error(stmt);
      console.error(e);
      process.exit(1);
    }
  }
  
  console.log("Migration pushed successfully!");
  process.exit(0);
}

push();
