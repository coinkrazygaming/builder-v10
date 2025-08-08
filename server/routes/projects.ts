import { RequestHandler } from "express";
import { eq, and } from "drizzle-orm";

// GET /api/projects - Get all projects for the current user
export const getProjects: RequestHandler = async (req, res) => {
  try {
    const { db } = await import("@shared/db");
    const { projects } = await import("@shared/schema");

    // TODO: Get user ID from auth middleware
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, userId))
      .orderBy(projects.updatedAt);

    res.json(userProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// GET /api/projects/:id - Get a specific project
export const getProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, id),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// POST /api/projects - Create a new project
export const createProject: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const projectData: NewProject = {
      ...req.body,
      ownerId: userId,
    };

    const [newProject] = await db
      .insert(projects)
      .values(projectData)
      .returning();

    // Create a default home page
    const homePageData: NewPage = {
      projectId: newProject.id,
      name: "Home",
      slug: "/",
      title: "Home Page",
      description: "The main page of your website",
      content: {},
      isHomePage: true,
      createdBy: userId,
    };

    await db.insert(pages).values(homePageData);

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// PATCH /api/projects/:id - Update a project
export const updateProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(and(
        eq(projects.id, id),
        eq(projects.ownerId, userId)
      ))
      .returning();

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// DELETE /api/projects/:id - Delete a project
export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await db
      .delete(projects)
      .where(and(
        eq(projects.id, id),
        eq(projects.ownerId, userId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
