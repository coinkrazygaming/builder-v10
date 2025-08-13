-- Migration: Add GitHub integration tables
-- Created: ${new Date().toISOString()}

-- Create enums
CREATE TYPE "sync_type" AS ENUM('push', 'pull', 'import');
CREATE TYPE "sync_status" AS ENUM('pending', 'success', 'failed');
CREATE TYPE "pr_status" AS ENUM('open', 'closed', 'merged');

-- Create GitHub repositories table
CREATE TABLE "github_repositories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" uuid NOT NULL,
  "repo_url" text NOT NULL,
  "repo_name" text NOT NULL,
  "repo_owner" text NOT NULL,
  "branch" text DEFAULT 'main',
  "access_token" text,
  "webhook_id" text,
  "last_sync" timestamp with time zone,
  "sync_enabled" boolean DEFAULT true,
  "auto_deploy_enabled" boolean DEFAULT false,
  "created_by" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Create GitHub sync history table
CREATE TABLE "github_sync_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "repository_id" uuid NOT NULL,
  "sync_type" "sync_type" NOT NULL,
  "commit_hash" text,
  "commit_message" text,
  "status" "sync_status" DEFAULT 'pending',
  "error_message" text,
  "changed_files" jsonb DEFAULT '[]',
  "triggered_by" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);

-- Create GitHub pull requests table
CREATE TABLE "github_pull_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "repository_id" uuid NOT NULL,
  "pr_number" integer NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "source_branch" text NOT NULL,
  "target_branch" text NOT NULL,
  "status" "pr_status" DEFAULT 'open',
  "pr_url" text NOT NULL,
  "created_by" text NOT NULL,
  "merged_by" text,
  "merged_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

-- Add GitHub repository ID to projects table
ALTER TABLE "projects" ADD COLUMN "github_repository_id" uuid;

-- Add foreign key constraints
ALTER TABLE "github_repositories" 
  ADD CONSTRAINT "github_repositories_project_id_projects_id_fk" 
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;

ALTER TABLE "github_sync_history" 
  ADD CONSTRAINT "github_sync_history_repository_id_github_repositories_id_fk" 
  FOREIGN KEY ("repository_id") REFERENCES "github_repositories"("id") ON DELETE CASCADE;

ALTER TABLE "github_pull_requests" 
  ADD CONSTRAINT "github_pull_requests_repository_id_github_repositories_id_fk" 
  FOREIGN KEY ("repository_id") REFERENCES "github_repositories"("id") ON DELETE CASCADE;

ALTER TABLE "projects" 
  ADD CONSTRAINT "projects_github_repository_id_github_repositories_id_fk" 
  FOREIGN KEY ("github_repository_id") REFERENCES "github_repositories"("id") ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX "github_repositories_project_id_idx" ON "github_repositories"("project_id");
CREATE INDEX "github_sync_history_repository_id_idx" ON "github_sync_history"("repository_id");
CREATE INDEX "github_sync_history_status_idx" ON "github_sync_history"("status");
CREATE INDEX "github_pull_requests_repository_id_idx" ON "github_pull_requests"("repository_id");
CREATE INDEX "github_pull_requests_status_idx" ON "github_pull_requests"("status");
CREATE INDEX "projects_github_repository_id_idx" ON "projects"("github_repository_id");
