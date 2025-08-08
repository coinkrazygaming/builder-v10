import { RequestHandler } from "express";

// Mock pages data
const mockPages = [
  {
    id: "home",
    projectId: "1",
    name: "Home Page",
    slug: "/",
    title: "Welcome to My Website",
    description: "The homepage of my awesome website",
    content: {},
    status: "draft",
    isHomePage: true,
    seoMetadata: {},
    createdBy: "mock-user-id",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null,
  }
];

// GET /api/projects/:projectId/pages - Get all pages for a project
export const getPages: RequestHandler = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const projectPages = mockPages.filter(page => page.projectId === projectId);
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

    const page = mockPages.find(p => p.id === pageId && p.projectId === projectId);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
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

    const newPage = {
      id: Date.now().toString(),
      projectId,
      ...req.body,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPages.push(newPage);
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

    const pageIndex = mockPages.findIndex(p => p.id === pageId && p.projectId === projectId);
    
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }

    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...req.body,
      updatedAt: new Date(),
    };

    res.json(mockPages[pageIndex]);
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

    const page = mockPages.find(p => p.id === pageId && p.projectId === projectId);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (page.isHomePage) {
      return res.status(400).json({ error: 'Cannot delete the home page' });
    }

    const pageIndex = mockPages.findIndex(p => p.id === pageId && p.projectId === projectId);
    mockPages.splice(pageIndex, 1);
    
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

    // Mock version history
    const versions = [
      {
        id: "v1",
        pageId,
        versionNumber: 1,
        content: {},
        changesDescription: "Initial version",
        createdBy: userId,
        createdAt: new Date(),
      }
    ];

    res.json(versions);
  } catch (error) {
    console.error('Error fetching page versions:', error);
    res.status(500).json({ error: 'Failed to fetch page versions' });
  }
};
