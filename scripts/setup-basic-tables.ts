import { db } from "../shared/db";

async function setupBasicTables() {
  try {
    console.log("🚀 Setting up basic database tables...");
    
    // Test connection first
    await db.execute("SELECT 1");
    console.log("✅ Database connection successful!");
    
    // Create enums first (handle existing ones)
    const enums = [
      { name: "project_status", values: "('draft', 'published', 'archived')" },
      { name: "page_status", values: "('draft', 'published', 'archived')" },
      { name: "member_role", values: "('owner', 'admin', 'editor', 'viewer')" },
    ];

    for (const enumDef of enums) {
      try {
        await db.execute(`CREATE TYPE "${enumDef.name}" AS ENUM${enumDef.values};`);
        console.log("✅ Created enum:", enumDef.name);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log("⚠️  Enum already exists:", enumDef.name);
        } else {
          console.log("⚠️  Could not create enum:", enumDef.name, error.message);
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
