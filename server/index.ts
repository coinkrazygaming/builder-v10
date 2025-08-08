import express from "express";
import { handleDemo } from "./routes/demo";
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} from "./routes/projects";
import {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  getPageVersions
} from "./routes/pages";

export function createServer() {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mock auth middleware - TODO: Replace with real Stack Auth middleware
  app.use('/api', (req, res, next) => {
    // For now, we'll mock the user ID
    // In production, this would be extracted from the Stack Auth token
    req.headers['x-user-id'] = 'mock-user-id';
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

  return app;
}
