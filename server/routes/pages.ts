import { RequestHandler } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@shared/db";
import { pages, projects, pageVersions, NewPage, NewPageVersion } from "@shared/schema";

// GET /api/projects/:projectId/pages - Get all pages for a project
export const getPages: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectPages = await db
      .select()
      .from(pages)
      .where(eq(pages.projectId, projectId))
      .orderBy(pages.updatedAt);

    res.json(projectPages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

// GET /api/projects/:projectId/pages/:pageId - Get a specific page
export const getPage: RequestHandler = async (req, res) => {
  try {
    const { projectId, pageId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const page = await db
      .select()
      .from(pages)
      .where(and(
        eq(pages.id, pageId),
        eq(pages.projectId, projectId)
      ))
      .limit(1);

    if (page.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page[0]);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

// POST /api/projects/:projectId/pages - Create a new page
export const createPage: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const pageData: NewPage = {
      ...req.body,
      projectId,
      createdBy: userId,
    };

    const [newPage] = await db
      .insert(pages)
      .values(pageData)
      .returning();

    // Create initial version
    const versionData: NewPageVersion = {
      pageId: newPage.id,
      versionNumber: 1,
      content: newPage.content,
      changesDescription: "Initial version",
      createdBy: userId,
    };

    await db.insert(pageVersions).values(versionData);

    res.status(201).json(newPage);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
};

// PATCH /api/projects/:projectId/pages/:pageId - Update a page
export const updatePage: RequestHandler = async (req, res) => {
  try {
    const { projectId, pageId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get current page for version tracking
    const currentPage = await db
      .select()
      .from(pages)
      .where(and(
        eq(pages.id, pageId),
        eq(pages.projectId, projectId)
      ))
      .limit(1);

    if (currentPage.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const [updatedPage] = await db
      .update(pages)
      .set({
        ...req.body,
        updatedAt: new Date(),
      })
      .where(and(
        eq(pages.id, pageId),
        eq(pages.projectId, projectId)
      ))
      .returning();

    // Create new version if content changed
    if (req.body.content && JSON.stringify(req.body.content) !== JSON.stringify(currentPage[0].content)) {
      const latestVersion = await db
        .select()
        .from(pageVersions)
        .where(eq(pageVersions.pageId, pageId))
        .orderBy(pageVersions.versionNumber)
        .limit(1);

      const nextVersionNumber = latestVersion.length > 0 ? latestVersion[0].versionNumber + 1 : 1;

      const versionData: NewPageVersion = {
        pageId,
        versionNumber: nextVersionNumber,
        content: req.body.content,
        changesDescription: req.body.changesDescription || "Updated content",
        createdBy: userId,
      };

      await db.insert(pageVersions).values(versionData);
    }

    res.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
};

// DELETE /api/projects/:projectId/pages/:pageId - Delete a page
export const deletePage: RequestHandler = async (req, res) => {
  try {
    const { projectId, pageId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if this is the home page
    const page = await db
      .select()
      .from(pages)
      .where(and(
        eq(pages.id, pageId),
        eq(pages.projectId, projectId)
      ))
      .limit(1);

    if (page.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page[0].isHomePage) {
      return res.status(400).json({ error: 'Cannot delete the home page' });
    }

    const result = await db
      .delete(pages)
      .where(and(
        eq(pages.id, pageId),
        eq(pages.projectId, projectId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
};

// GET /api/projects/:projectId/pages/:pageId/versions - Get page version history
export const getPageVersions: RequestHandler = async (req, res) => {
  try {
    const { projectId, pageId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify project ownership
    const project = await db
      .select()
      .from(projects)
      .where(and(
        eq(projects.id, projectId),
        eq(projects.ownerId, userId)
      ))
      .limit(1);

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const versions = await db
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))
      .orderBy(pageVersions.versionNumber);

    res.json(versions);
  } catch (error) {
    console.error('Error fetching page versions:', error);
    res.status(500).json({ error: 'Failed to fetch page versions' });
  }
};
