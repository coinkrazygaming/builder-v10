import { RequestHandler } from "express";

// Mock data for development
const mockProjects = [
  {
    id: "1",
    name: "E-commerce Website",
    description: "Modern online store with shopping cart",
    domain: "mystore.builder.app",
    customDomain: null,
    status: "published",
    ownerId: "mock-user-id",
    settings: {},
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Portfolio Site",
    description: "Personal portfolio showcase",
    domain: "portfolio.builder.app",
    customDomain: "johndoe.com",
    status: "draft",
    ownerId: "mock-user-id",
    settings: {},
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
];

// GET /api/projects - Get all projects for the current user
export const getProjects: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Return mock projects for now
    const userProjects = mockProjects.filter((p) => p.ownerId === userId);
    res.json(userProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// GET /api/projects/:id - Get a specific project
export const getProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const project = mockProjects.find(
      (p) => p.id === id && p.ownerId === userId,
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

// POST /api/projects - Create a new project
export const createProject: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newProject = {
      id: Date.now().toString(),
      ...req.body,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// PATCH /api/projects/:id - Update a project
export const updateProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projectIndex = mockProjects.findIndex(
      (p) => p.id === id && p.ownerId === userId,
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: "Project not found" });
    }

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...req.body,
      updatedAt: new Date(),
    };

    res.json(mockProjects[projectIndex]);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

// DELETE /api/projects/:id - Delete a project
export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projectIndex = mockProjects.findIndex(
      (p) => p.id === id && p.ownerId === userId,
    );

    if (projectIndex === -1) {
      return res.status(404).json({ error: "Project not found" });
    }

    mockProjects.splice(projectIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};
