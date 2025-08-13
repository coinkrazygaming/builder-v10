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
  getGitHubUser,
  getGitHubRepositories,
  getGitHubRepository,
  getGitHubBranches,
  getGitHubContents,
  getGitHubFile,
  importGitHubRepository,
  getGitHubPullRequests,
  createGitHubPullRequest,
  createOrUpdateGitHubFile
} from "./routes/github";

export function createServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
  app.get("/api/github/user", getGitHubUser);
  app.get("/api/github/repositories", getGitHubRepositories);
  app.get("/api/github/repositories/:owner/:repo", getGitHubRepository);
  app.get("/api/github/repositories/:owner/:repo/branches", getGitHubBranches);
  app.get("/api/github/repositories/:owner/:repo/contents", getGitHubContents);
  app.get("/api/github/repositories/:owner/:repo/file", getGitHubFile);
  app.post("/api/github/repositories/:owner/:repo/import", importGitHubRepository);
  app.get("/api/github/repositories/:owner/:repo/pull-requests", getGitHubPullRequests);
  app.post("/api/github/repositories/:owner/:repo/pull-requests", createGitHubPullRequest);
  app.post("/api/github/repositories/:owner/:repo/files", createOrUpdateGitHubFile);

  return app;
}
