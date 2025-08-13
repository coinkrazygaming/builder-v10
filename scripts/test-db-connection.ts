import { db } from "../shared/db";

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test basic connection
    const result = await db.execute("SELECT 1 as test");
    console.log("✅ Database connection successful!");
    console.log("📊 Test query result:", result);
    
    // Test if our tables exist
    try {
      const tablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `;
      const tables = await db.execute(tablesQuery);
      console.log("📋 Existing tables:", tables.rows.map(row => row.table_name));
    } catch (error) {
      console.log("⚠️  Could not fetch tables (database might be empty)");
    }
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.error("💡 Make sure your DATABASE_URL is set correctly");
    process.exit(1);
  }
}

testConnection();
