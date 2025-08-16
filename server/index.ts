import express from "express";
import { handleDemo } from "./routes/demo";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./routes/projects";
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  getPageVersions,
} from "./routes/pages";
import {
  testGitHub,
  getGitHubUser,
  getGitHubRepositories,
  getGitHubRepository,
  getGitHubBranches,
  getGitHubContents,
  getGitHubFile,
  importGitHubRepository,
  getGitHubPullRequests,
  createGitHubPullRequest,
  createOrUpdateGitHubFile,
} from "./routes/github";
import {
  sendMessage,
  updateContext,
  getSuggestions,
  createCheckpoint,
  logAction,
  executeWorkflowStep,
  getStatus,
} from "./routes/joseyai";
import {
  getTemplates,
  getTemplate,
  useTemplate,
  getTemplateCategories,
  rateTemplate,
} from "./routes/templates";
import {
  getComponents,
  getComponent,
  downloadComponent,
  getComponentCategories,
  rateComponent,
} from "./routes/components";

export function createServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Debug middleware - log all requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.url.startsWith("/api/github")) {
      console.log("GitHub API request detected");
      console.log("Headers:", req.headers);
    }
    next();
  });

  // Mock auth middleware - TODO: Replace with real Stack Auth middleware
  app.use("/api", (req, res, next) => {
    // For now, we'll mock the user ID
    // In production, this would be extracted from the Stack Auth token
    req.headers["x-user-id"] = "mock-user-id";
    next();
  });

  // Original demo routes
  app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });
  app.get("/api/demo", handleDemo);

  // Project routes
  app.get("/api/projects", getProjects);
  app.get("/api/projects/:id", getProject);
  app.post("/api/projects", createProject);
  app.patch("/api/projects/:id", updateProject);
  app.delete("/api/projects/:id", deleteProject);

  // Page routes
  app.get("/api/projects/:projectId/pages", getPages);
  app.get("/api/projects/:projectId/pages/:pageId", getPage);
  app.post("/api/projects/:projectId/pages", createPage);
  app.patch("/api/projects/:projectId/pages/:pageId", updatePage);
  app.delete("/api/projects/:projectId/pages/:pageId", deletePage);
  app.get("/api/projects/:projectId/pages/:pageId/versions", getPageVersions);

  // GitHub API routes
  console.log("Registering GitHub API routes...");
  app.get("/api/github/test", testGitHub);
  app.get("/api/github/user", getGitHubUser);
  app.get("/api/github/repositories", getGitHubRepositories);
  app.get("/api/github/repositories/:owner/:repo", getGitHubRepository);
  app.get("/api/github/repositories/:owner/:repo/branches", getGitHubBranches);
  app.get("/api/github/repositories/:owner/:repo/contents", getGitHubContents);
  app.get("/api/github/repositories/:owner/:repo/file", getGitHubFile);
  app.post(
    "/api/github/repositories/:owner/:repo/import",
    importGitHubRepository,
  );
  app.get(
    "/api/github/repositories/:owner/:repo/pull-requests",
    getGitHubPullRequests,
  );
  app.post(
    "/api/github/repositories/:owner/:repo/pull-requests",
    createGitHubPullRequest,
  );
  app.post(
    "/api/github/repositories/:owner/:repo/files",
    createOrUpdateGitHubFile,
  );
  console.log("GitHub API routes registered successfully");

  // JoseyAI API routes
  console.log("Registering JoseyAI API routes...");
  app.post("/api/joseyai/chat", sendMessage);
  app.post("/api/joseyai/context", updateContext);
  app.get("/api/joseyai/suggestions", getSuggestions);
  app.post("/api/joseyai/checkpoint", createCheckpoint);
  app.post("/api/joseyai/log", logAction);
  app.post("/api/joseyai/execute", executeWorkflowStep);
  app.get("/api/joseyai/status", getStatus);
  console.log("JoseyAI API routes registered successfully");

  // Templates API routes
  console.log("Registering Templates API routes...");
  app.get("/api/templates", getTemplates);
  app.get("/api/templates/categories", getTemplateCategories);
  app.get("/api/templates/:id", getTemplate);
  app.post("/api/templates/:id/use", useTemplate);
  app.post("/api/templates/:id/rate", rateTemplate);
  console.log("Templates API routes registered successfully");

  // Components API routes
  console.log("Registering Components API routes...");
  app.get("/api/components", getComponents);
  app.get("/api/components/categories", getComponentCategories);
  app.get("/api/components/:id", getComponent);
  app.post("/api/components/:id/download", downloadComponent);
  app.post("/api/components/:id/rate", rateComponent);
  console.log("Components API routes registered successfully");

  return app;
}
