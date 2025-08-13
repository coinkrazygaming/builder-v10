import { db } from "../shared/db";

async function setupBasicTables() {
  try {
    console.log("🚀 Setting up basic database tables...");
    
    // Test connection first
    await db.execute("SELECT 1");
    console.log("✅ Database connection successful!");
    
    // Create enums first (if they don't exist)
    const enums = [
      `CREATE TYPE IF NOT EXISTS "project_status" AS ENUM('draft', 'published', 'archived');`,
      `CREATE TYPE IF NOT EXISTS "page_status" AS ENUM('draft', 'published', 'archived');`,
      `CREATE TYPE IF NOT EXISTS "member_role" AS ENUM('owner', 'admin', 'editor', 'viewer');`,
    ];
    
    for (const enumSql of enums) {
      try {
        await db.execute(enumSql);
        console.log("✅ Created enum:", enumSql.match(/TYPE.*?"(\w+)"/)?.[1]);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log("⚠️  Enum already exists:", enumSql.match(/TYPE.*?"(\w+)"/)?.[1]);
        } else {
          throw error;
        }
      }
    }
    
    // Create basic projects table
    const createProjectsTable = `
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "description" text,
        "domain" text,
        "custom_domain" text,
        "status" "project_status" DEFAULT 'draft',
        "owner_id" text NOT NULL,
        "github_repository_id" uuid,
        "settings" jsonb DEFAULT '{}',
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now()
      );
    `;
    
    await db.execute(createProjectsTable);
    console.log("✅ Created projects table");
    
    // Create basic pages table
    const createPagesTable = `
      CREATE TABLE IF NOT EXISTS "pages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "project_id" uuid NOT NULL,
        "name" text NOT NULL,
        "slug" text NOT NULL,
        "title" text,
        "description" text,
        "content" jsonb DEFAULT '{}',
        "status" "page_status" DEFAULT 'draft',
        "is_home_page" boolean DEFAULT false,
        "seo_metadata" jsonb DEFAULT '{}',
        "created_by" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "published_at" timestamp with time zone
      );
    `;
    
    await db.execute(createPagesTable);
    console.log("✅ Created pages table");
    
    // Add foreign key constraints
    try {
      await db.execute(`
        ALTER TABLE "pages" 
        ADD CONSTRAINT IF NOT EXISTS "pages_project_id_projects_id_fk" 
        FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
      `);
      console.log("✅ Added foreign key constraint");
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log("⚠️  Foreign key constraint already exists");
      } else {
        console.log("⚠️  Could not add foreign key constraint:", error.message);
      }
    }
    
    // Check tables
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("📋 Available tables:", tables.rows.map(row => row.table_name));
    console.log("🎉 Basic database setup complete!");
    
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupBasicTables();
