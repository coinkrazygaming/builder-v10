import { RequestHandler } from "express";
import { createGitHubClient, GitHubRepository, GitHubBranch } from "@shared/github-client";

// GET /api/github/user - Get authenticated GitHub user
export const getGitHubUser: RequestHandler = async (req, res) => {
  try {
    console.log("GitHub user endpoint called");
    const accessToken = req.headers["x-github-token"] as string;
    console.log("Access token present:", !!accessToken);

    if (!accessToken) {
      console.log("No access token provided");
      return res.status(401).json({ error: "GitHub access token required" });
    }

    console.log("Creating GitHub client...");
    const client = createGitHubClient(accessToken);

    console.log("Fetching authenticated user...");
    const user = await client.getAuthenticatedUser();

    console.log("User fetched successfully:", user.login);
    res.json(user);
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    res.status(500).json({ error: "Failed to fetch GitHub user", details: error.message });
  }
};

// GET /api/github/repositories - Get user's GitHub repositories
export const getGitHubRepositories: RequestHandler = async (req, res) => {
  try {
    const accessToken = req.headers["x-github-token"] as string;
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 30;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }

    const client = createGitHubClient(accessToken);
    const repositories = await client.getUserRepositories(page, perPage);
    
    res.json(repositories);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

// GET /api/github/repositories/:owner/:repo - Get specific repository
export const getGitHubRepository: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }

    const client = createGitHubClient(accessToken);
    const repository = await client.getRepository(owner, repo);
    
    res.json(repository);
  } catch (error) {
    console.error("Error fetching GitHub repository:", error);
    res.status(500).json({ error: "Failed to fetch repository" });
  }
};

// GET /api/github/repositories/:owner/:repo/branches - Get repository branches
export const getGitHubBranches: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }

    const client = createGitHubClient(accessToken);
    const branches = await client.getBranches(owner, repo);
    
    res.json(branches);
  } catch (error) {
    console.error("Error fetching GitHub branches:", error);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
};

// GET /api/github/repositories/:owner/:repo/contents - Get repository contents
export const getGitHubContents: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const path = req.query.path as string || "";
    const ref = req.query.ref as string;
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }

    const client = createGitHubClient(accessToken);
    const contents = await client.getDirectoryContents(owner, repo, path, ref);
    
    res.json(contents);
  } catch (error) {
    console.error("Error fetching GitHub contents:", error);
    res.status(500).json({ error: "Failed to fetch repository contents" });
  }
};

// GET /api/github/repositories/:owner/:repo/file - Get file content
export const getGitHubFile: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const path = req.query.path as string;
    const ref = req.query.ref as string;
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!path) {
      return res.status(400).json({ error: "File path is required" });
    }
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }

    const client = createGitHubClient(accessToken);
    const file = await client.getFileContent(owner, repo, path, ref);
    
    // Decode base64 content if it exists
    if (file.content && file.encoding === "base64") {
      file.content = Buffer.from(file.content, "base64").toString("utf-8");
    }
    
    res.json(file);
  } catch (error) {
    console.error("Error fetching GitHub file:", error);
    res.status(500).json({ error: "Failed to fetch file content" });
  }
};

// POST /api/github/repositories/:owner/:repo/import - Import repository to project
export const importGitHubRepository: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { projectId, branch = "main" } = req.body;
    const accessToken = req.headers["x-github-token"] as string;
    const userId = req.headers["x-user-id"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }
    
    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }
    
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const client = createGitHubClient(accessToken);
    
    // Get repository info
    const repository = await client.getRepository(owner, repo);
    
    // Get repository contents from the specified branch
    const contents = await client.getDirectoryContents(owner, repo, "", branch);
    
    // TODO: Process and import the repository structure into the project
    // This would involve:
    // 1. Creating pages from HTML files
    // 2. Importing assets
    // 3. Converting components
    // 4. Setting up the project structure
    
    // For now, return success with repository info
    res.json({
      success: true,
      repository,
      contents: contents.length,
      message: `Repository ${repository.fullName} imported successfully`,
    });
  } catch (error) {
    console.error("Error importing GitHub repository:", error);
    res.status(500).json({ error: "Failed to import repository" });
  }
};

// GET /api/github/repositories/:owner/:repo/pull-requests - Get pull requests
export const getGitHubPullRequests: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const state = req.query.state as "open" | "closed" | "all" || "open";
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }

    const client = createGitHubClient(accessToken);
    const pullRequests = await client.getPullRequests(owner, repo, state);
    
    res.json(pullRequests);
  } catch (error) {
    console.error("Error fetching GitHub pull requests:", error);
    res.status(500).json({ error: "Failed to fetch pull requests" });
  }
};

// POST /api/github/repositories/:owner/:repo/pull-requests - Create pull request
export const createGitHubPullRequest: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { title, head, base, body } = req.body;
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }
    
    if (!title || !head || !base) {
      return res.status(400).json({ error: "Title, head, and base branches are required" });
    }

    const client = createGitHubClient(accessToken);
    const pullRequest = await client.createPullRequest(owner, repo, title, head, base, body);
    
    res.status(201).json(pullRequest);
  } catch (error) {
    console.error("Error creating GitHub pull request:", error);
    res.status(500).json({ error: "Failed to create pull request" });
  }
};

// POST /api/github/repositories/:owner/:repo/files - Create or update file
export const createOrUpdateGitHubFile: RequestHandler = async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { path, content, message, branch, sha } = req.body;
    const accessToken = req.headers["x-github-token"] as string;
    
    if (!accessToken) {
      return res.status(401).json({ error: "GitHub access token required" });
    }
    
    if (!path || !content || !message) {
      return res.status(400).json({ error: "Path, content, and commit message are required" });
    }

    const client = createGitHubClient(accessToken);
    const result = await client.createOrUpdateFile(owner, repo, path, content, message, branch, sha);
    
    res.json(result);
  } catch (error) {
    console.error("Error creating/updating GitHub file:", error);
    res.status(500).json({ error: "Failed to create/update file" });
  }
};
