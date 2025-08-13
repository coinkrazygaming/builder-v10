import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not defined. Please set up your Neon database connection.\n" +
      "See DATABASE_SETUP.md for detailed instructions.",
  );
}

// Validate DATABASE_URL format
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
  throw new Error(
    "Invalid DATABASE_URL format. Expected a PostgreSQL connection string.\n" +
      "Example: postgresql://username:password@host:port/database",
  );
}

// Configure Neon client with connection pooling
const sql = neon(dbUrl, {
  // Enable connection pooling for better performance
  fullResults: true,
  arrayMode: false,
});

// Create Drizzle instance
export const db = drizzle({
  client: sql,
  logger: process.env.NODE_ENV === "development" ? true : false,
});

// Connection test function
export async function testConnection() {
  try {
    await db.execute("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}
