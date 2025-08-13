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
      { name: "message_role", values: "('user', 'assistant', 'system')" },
      { name: "task_status", values: "('pending', 'in_progress', 'completed', 'failed')" },
      { name: "plan_status", values: "('analyzing', 'planning', 'approved', 'executing', 'completed', 'failed')" },
    ];

    for (const enumDef of enums) {
      try {
        await db.execute(
          `CREATE TYPE "${enumDef.name}" AS ENUM${enumDef.values};`,
        );
        console.log("✅ Created enum:", enumDef.name);
      } catch (error) {
        if (error.message.includes("already exists")) {
          console.log("⚠️  Enum already exists:", enumDef.name);
        } else {
          console.log(
            "⚠️  Could not create enum:",
            enumDef.name,
            error.message,
          );
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

    // Create JoseyAI tables
    const createJoseyConversationsTable = `
      CREATE TABLE IF NOT EXISTS "josey_conversations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" text NOT NULL,
        "project_id" uuid,
        "title" text NOT NULL,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now()
      );
    `;

    const createJoseyMessagesTable = `
      CREATE TABLE IF NOT EXISTS "josey_messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "conversation_id" uuid NOT NULL,
        "role" "message_role" NOT NULL,
        "content" text NOT NULL,
        "metadata" jsonb DEFAULT '{}',
        "created_at" timestamp with time zone DEFAULT now()
      );
    `;

    const createJoseyTasksTable = `
      CREATE TABLE IF NOT EXISTS "josey_tasks" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "conversation_id" uuid NOT NULL,
        "parent_task_id" uuid,
        "title" text NOT NULL,
        "description" text,
        "status" "task_status" DEFAULT 'pending',
        "priority" integer DEFAULT 0,
        "estimated_minutes" integer,
        "actual_minutes" integer,
        "metadata" jsonb DEFAULT '{}',
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        "completed_at" timestamp with time zone
      );
    `;

    const createJoseyScreenContextTable = `
      CREATE TABLE IF NOT EXISTS "josey_screen_context" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" text NOT NULL,
        "current_view" text NOT NULL,
        "current_file" text,
        "selected_element" text,
        "viewport_data" jsonb DEFAULT '{}',
        "updated_at" timestamp with time zone DEFAULT now()
      );
    `;

    await db.execute(createJoseyConversationsTable);
    console.log("✅ Created josey_conversations table");

    await db.execute(createJoseyMessagesTable);
    console.log("✅ Created josey_messages table");

    await db.execute(createJoseyTasksTable);
    console.log("✅ Created josey_tasks table");

    await db.execute(createJoseyScreenContextTable);
    console.log("✅ Created josey_screen_context table");

    // Add foreign key constraints
    try {
      await db.execute(`
        ALTER TABLE "pages" 
        ADD CONSTRAINT IF NOT EXISTS "pages_project_id_projects_id_fk" 
        FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;
      `);
      console.log("✅ Added foreign key constraint");
    } catch (error) {
      if (error.message.includes("already exists")) {
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

    console.log(
      "📋 Available tables:",
      tables.rows.map((row) => row.table_name),
    );
    console.log("🎉 Basic database setup complete!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

setupBasicTables();
