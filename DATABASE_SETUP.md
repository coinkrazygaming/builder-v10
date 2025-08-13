# 🚀 Neon Database Setup Guide

This guide will help you connect your Builder.io clone to a new Neon PostgreSQL database.

## Step 1: Create a New Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign in or create an account
3. Click **"Create Project"**
4. Choose your settings:
   - **Project Name**: `builder-clone` (or your preferred name)
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: Latest (15+)
5. Click **"Create Project"**

## Step 2: Get Your Connection String

1. In your Neon project dashboard, go to **"Connection Details"**
2. Select **"Pooled connection"** for better performance
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.pooler.neon.tech/dbname?sslmode=require
   ```

## Step 3: Set Environment Variable

The DATABASE_URL will be set automatically using the DevServerControl tool.

## Step 4: Initialize Database Schema

After setting up the connection, run these commands to set up your database:

```bash
# Generate migration files
npm run db:generate

# Apply migrations to create tables
npm run db:push

# Test the connection
npm run db:test
```

## Step 5: Verify Setup

1. Check that the connection works: `npm run db:test`
2. Open Drizzle Studio to explore your database: `npm run db:studio`
3. Your Builder.io clone should now be connected to Neon!

## 🛠️ Troubleshooting

### Connection Issues
- Verify your DATABASE_URL format
- Check that your Neon database is active
- Ensure your IP is allowlisted in Neon (if applicable)

### Migration Issues
- Run `npm run db:generate` to create new migrations
- Use `npm run db:push` for development (direct schema sync)
- Use `npm run db:migrate` for production deployments

### Database Explorer
- Use `npm run db:studio` to visually explore your database
- Access at http://localhost:4983 (default Drizzle Studio port)

## 📋 Available Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:test` | Test database connection |
| `npm run db:generate` | Generate migration files |
| `npm run db:push` | Push schema changes directly |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:studio` | Open Drizzle Studio |

## 🔒 Security Notes

- Never commit your DATABASE_URL to version control
- Use environment variables for all database credentials
- Enable SSL connections (included in Neon connection strings)
- Regularly backup your database through Neon Console

Your Builder.io clone is now ready to use with Neon PostgreSQL! 🎉
