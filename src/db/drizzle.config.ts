// src/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

const supabaseDbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

const dbCredentialsConfig: any = supabaseDbUrl 
  ? { url: supabaseDbUrl, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.SQL_HOST || "",
      user: process.env.SQL_ADMIN_USER || process.env.SQL_USER || "",
      password: process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD || "",
      database: process.env.SQL_DB_NAME || "",
      ssl: false,
    };

if (!supabaseDbUrl && !process.env.SQL_HOST) {
  console.warn("Neither SUPABASE_DB_URL nor SQL_HOST are defined. Ensure database connection variables are configured.");
} else if (supabaseDbUrl) {
  console.log("Drizzle config targeting Supabase DB URL.");
} else {
  console.log(`Drizzle config targeting user: ${process.env.SQL_ADMIN_USER} to connect to Cloud SQL.`);
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle", // Output directory for migrations.
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: dbCredentialsConfig,
  verbose: true, // Enable verbose output.
});
