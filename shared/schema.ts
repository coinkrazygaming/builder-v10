import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "published",
  "archived",
]);
export const pageStatusEnum = pgEnum("page_status", [
  "draft",
  "published",
  "archived",
]);
export const memberRoleEnum = pgEnum("member_role", [
  "owner",
  "admin",
  "editor",
  "viewer",
]);

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  domain: text("domain"),
  customDomain: text("custom_domain"),
  status: projectStatusEnum("status").default("draft"),
  ownerId: text("owner_id").notNull(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Project members table
export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  role: memberRoleEnum("role").default("viewer"),
  invitedAt: timestamp("invited_at", { withTimezone: true }).defaultNow(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
});

// Pages table
export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  title: text("title"),
  description: text("description"),
  content: jsonb("content").default({}),
  status: pageStatusEnum("status").default("draft"),
  isHomePage: boolean("is_home_page").default(false),
  seoMetadata: jsonb("seo_metadata").default({}),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

// Page versions for version history
export const pageVersions = pgTable("page_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  content: jsonb("content").notNull(),
  changesDescription: text("changes_description"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Components library
export const components = pgTable("components", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  props: jsonb("props").default({}),
  template: jsonb("template").notNull(),
  thumbnail: text("thumbnail"),
  isPublic: boolean("is_public").default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Media assets
export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt"),
  folder: text("folder"),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// GitHub repository integration tables
export const githubRepositories = pgTable("github_repositories", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  repoUrl: text("repo_url").notNull(),
  repoName: text("repo_name").notNull(),
  repoOwner: text("repo_owner").notNull(),
  branch: text("branch").default("main"),
  accessToken: text("access_token"),
  webhookId: text("webhook_id"),
  lastSync: timestamp("last_sync", { withTimezone: true }),
  syncEnabled: boolean("sync_enabled").default(true),
  autoDeployEnabled: boolean("auto_deploy_enabled").default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// GitHub sync history
export const githubSyncHistory = pgTable("github_sync_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  repositoryId: uuid("repository_id")
    .notNull()
    .references(() => githubRepositories.id, { onDelete: "cascade" }),
  syncType: pgEnum("sync_type", ["push", "pull", "import"])("sync_type").notNull(),
  commitHash: text("commit_hash"),
  commitMessage: text("commit_message"),
  status: pgEnum("sync_status", ["pending", "success", "failed"])("status").default("pending"),
  errorMessage: text("error_message"),
  changedFiles: jsonb("changed_files").default([]),
  triggeredBy: text("triggered_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// GitHub pull requests
export const githubPullRequests = pgTable("github_pull_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  repositoryId: uuid("repository_id")
    .notNull()
    .references(() => githubRepositories.id, { onDelete: "cascade" }),
  prNumber: integer("pr_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  sourceBranch: text("source_branch").notNull(),
  targetBranch: text("target_branch").notNull(),
  status: pgEnum("pr_status", ["open", "closed", "merged"])("status").default("open"),
  prUrl: text("pr_url").notNull(),
  createdBy: text("created_by").notNull(),
  mergedBy: text("merged_by"),
  mergedAt: timestamp("merged_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Export types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type PageVersion = typeof pageVersions.$inferSelect;
export type NewPageVersion = typeof pageVersions.$inferInsert;
export type Component = typeof components.$inferSelect;
export type NewComponent = typeof components.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;
export type GithubRepository = typeof githubRepositories.$inferSelect;
export type NewGithubRepository = typeof githubRepositories.$inferInsert;
export type GithubSyncHistory = typeof githubSyncHistory.$inferSelect;
export type NewGithubSyncHistory = typeof githubSyncHistory.$inferInsert;
export type GithubPullRequest = typeof githubPullRequests.$inferSelect;
export type NewGithubPullRequest = typeof githubPullRequests.$inferInsert;
