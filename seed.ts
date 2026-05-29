import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./db/schema";
import { auth } from "./lib/auth";

async function seed() {
  console.log("Seeding admin officer...");
  
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "admin@company.com",
        password: "password123",
        name: "Admin Officer",
      }
    });
    console.log("Admin officer created:", res.user.email);
  } catch (error: any) {
    console.error("Error creating admin:", error.message || error);
  }
}

seed();
