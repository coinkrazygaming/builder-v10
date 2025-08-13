import { db } from "../shared/db";
import {
  projects,
  projectMembers,
  pages,
  pageVersions,
  components,
  assets,
  githubRepositories,
  githubSyncHistory,
  githubPullRequests,
} from "../shared/schema";

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...");

    // Test connection first
    console.log("🔍 Testing database connection...");
    await db.execute("SELECT 1");
    console.log("✅ Database connection successful!");

    // Check if tables already exist
    const checkTablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'projects', 'project_members', 'pages', 'page_versions', 
        'components', 'assets', 'github_repositories', 
        'github_sync_history', 'github_pull_requests'
      )
      ORDER BY table_name;
    `;

    const existingTables = await db.execute(checkTablesQuery);
    console.log(
      "📋 Existing tables:",
      existingTables.rows.map((row) => row.table_name),
    );

    if (existingTables.rows.length > 0) {
      console.log(
        "⚠️  Some tables already exist. Use 'npm run db:push' to sync schema changes.",
      );
      return;
    }

    console.log("📦 Creating database schema...");
    console.log(
      "ℹ️  Use 'npm run db:push' to create tables based on your schema",
    );
    console.log(
      "ℹ️  Or use 'npm run db:generate' and 'npm run db:migrate' for production",
    );

    console.log("✨ Database initialization complete!");
    console.log("\n🎯 Next steps:");
    console.log(
      "1. Update your DATABASE_URL with your real Neon connection string",
    );
    console.log("2. Run 'npm run db:push' to create tables");
    console.log("3. Run 'npm run db:studio' to explore your database");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);

    if (error.message.includes("authentication failed")) {
      console.error(
        "🔐 Authentication issue - check your DATABASE_URL credentials",
      );
    } else if (error.message.includes("getaddrinfo ENOTFOUND")) {
      console.error("🌐 Network issue - check your DATABASE_URL host");
    } else if (error.message.includes("password authentication failed")) {
      console.error("🔑 Invalid password - verify your DATABASE_URL");
    }

    console.error("\n💡 Troubleshooting:");
    console.error("- Verify your Neon database is active");
    console.error("- Check your DATABASE_URL format");
    console.error("- Ensure your IP is allowlisted in Neon");

    process.exit(1);
  }
}

initializeDatabase();
