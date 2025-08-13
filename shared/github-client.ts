import { Octokit } from "@octokit/rest";

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  private: boolean;
  owner: {
    login: string;
    avatarUrl: string;
  };
  updatedAt: string;
  language: string | null;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  htmlUrl: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };
  user: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  htmlUrl: string;
  gitUrl: string;
  downloadUrl: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    });
  }

  // Authentication
  async getAuthenticatedUser() {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      return {
        id: data.id,
        login: data.login,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatar_url,
      };
    } catch (error) {
      throw new Error(`Failed to get authenticated user: ${error}`);
    }
  }

  // Repositories
  async getUserRepositories(
    page = 1,
    perPage = 30,
  ): Promise<GitHubRepository[]> {
    try {
      const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
        page,
        per_page: perPage,
        sort: "updated",
        type: "all",
      });

      return data.map(
        (repo): GitHubRepository => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          htmlUrl: repo.html_url,
          cloneUrl: repo.clone_url,
          defaultBranch: repo.default_branch,
          private: repo.private,
          owner: {
            login: repo.owner.login,
            avatarUrl: repo.owner.avatar_url,
          },
          updatedAt: repo.updated_at,
          language: repo.language,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch repositories: ${error}`);
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        htmlUrl: data.html_url,
        cloneUrl: data.clone_url,
        defaultBranch: data.default_branch,
        private: data.private,
        owner: {
          login: data.owner.login,
          avatarUrl: data.owner.avatar_url,
        },
        updatedAt: data.updated_at,
        language: data.language,
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository: ${error}`);
    }
  }

  // Branches
  async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    try {
      const { data } = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
      });

      return data.map(
        (branch): GitHubBranch => ({
          name: branch.name,
          commit: {
            sha: branch.commit.sha,
            url: branch.commit.url,
          },
          protected: branch.protected,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch branches: ${error}`);
    }
  }

  // Commits
  async getCommits(
    owner: string,
    repo: string,
    sha?: string,
  ): Promise<GitHubCommit[]> {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        sha,
        per_page: 10,
      });

      return data.map(
        (commit): GitHubCommit => ({
          sha: commit.sha,
          message: commit.commit.message,
          author: {
            name: commit.commit.author?.name || "Unknown",
            email: commit.commit.author?.email || "",
            date: commit.commit.author?.date || "",
          },
          url: commit.html_url,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch commits: ${error}`);
    }
  }

  // Files
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string,
  ): Promise<GitHubFileContent> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      if (Array.isArray(data)) {
        throw new Error("Path is a directory, not a file");
      }

      return {
        name: data.name,
        path: data.path,
        sha: data.sha,
        size: data.size,
        url: data.url,
        htmlUrl: data.html_url,
        gitUrl: data.git_url,
        downloadUrl: data.download_url,
        type: data.type as "file" | "dir",
        content: data.content,
        encoding: data.encoding,
      };
    } catch (error) {
      throw new Error(`Failed to fetch file content: ${error}`);
    }
  }

  async getDirectoryContents(
    owner: string,
    repo: string,
    path = "",
    ref?: string,
  ): Promise<GitHubFileContent[]> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      if (!Array.isArray(data)) {
        throw new Error("Path is a file, not a directory");
      }

      return data.map(
        (item): GitHubFileContent => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
          size: item.size,
          url: item.url,
          htmlUrl: item.html_url,
          gitUrl: item.git_url,
          downloadUrl: item.download_url,
          type: item.type as "file" | "dir",
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch directory contents: ${error}`);
    }
  }

  // Pull Requests
  async getPullRequests(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
  ): Promise<GitHubPullRequest[]> {
    try {
      const { data } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state,
        per_page: 30,
      });

      return data.map(
        (pr): GitHubPullRequest => ({
          number: pr.number,
          title: pr.title,
          body: pr.body,
          state: pr.state as "open" | "closed",
          htmlUrl: pr.html_url,
          head: {
            ref: pr.head.ref,
            sha: pr.head.sha,
          },
          base: {
            ref: pr.base.ref,
            sha: pr.base.sha,
          },
          user: {
            login: pr.user?.login || "unknown",
            avatarUrl: pr.user?.avatar_url || "",
          },
          createdAt: pr.created_at,
          updatedAt: pr.updated_at,
          mergedAt: pr.merged_at,
        }),
      );
    } catch (error) {
      throw new Error(`Failed to fetch pull requests: ${error}`);
    }
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string,
  ): Promise<GitHubPullRequest> {
    try {
      const { data } = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
        body,
      });

      return {
        number: data.number,
        title: data.title,
        body: data.body,
        state: data.state as "open" | "closed",
        htmlUrl: data.html_url,
        head: {
          ref: data.head.ref,
          sha: data.head.sha,
        },
        base: {
          ref: data.base.ref,
          sha: data.base.sha,
        },
        user: {
          login: data.user?.login || "unknown",
          avatarUrl: data.user?.avatar_url || "",
        },
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        mergedAt: data.merged_at,
      };
    } catch (error) {
      throw new Error(`Failed to create pull request: ${error}`);
    }
  }

  // File Operations
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
    sha?: string,
  ): Promise<{ commit: GitHubCommit; content: GitHubFileContent }> {
    try {
      const { data } = await this.octokit.rest.repos.createOrUpdateFileContents(
        {
          owner,
          repo,
          path,
          message,
          content: Buffer.from(content, "utf-8").toString("base64"),
          branch,
          sha,
        },
      );

      return {
        commit: {
          sha: data.commit.sha,
          message: data.commit.message,
          author: {
            name: data.commit.author?.name || "Unknown",
            email: data.commit.author?.email || "",
            date: data.commit.author?.date || "",
          },
          url: data.commit.html_url,
        },
        content: {
          name: data.content.name,
          path: data.content.path,
          sha: data.content.sha,
          size: data.content.size,
          url: data.content.url,
          htmlUrl: data.content.html_url,
          gitUrl: data.content.git_url,
          downloadUrl: data.content.download_url,
          type: data.content.type as "file" | "dir",
        },
      };
    } catch (error) {
      throw new Error(`Failed to create/update file: ${error}`);
    }
  }

  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    sha: string,
    branch?: string,
  ): Promise<GitHubCommit> {
    try {
      const { data } = await this.octokit.rest.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        sha,
        branch,
      });

      return {
        sha: data.commit.sha,
        message: data.commit.message,
        author: {
          name: data.commit.author?.name || "Unknown",
          email: data.commit.author?.email || "",
          date: data.commit.author?.date || "",
        },
        url: data.commit.html_url,
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  // Webhooks
  async createWebhook(
    owner: string,
    repo: string,
    url: string,
    secret?: string,
  ) {
    try {
      const { data } = await this.octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url,
          content_type: "json",
          secret,
        },
        events: ["push", "pull_request"],
      });

      return {
        id: data.id,
        url: data.config.url,
        active: data.active,
        events: data.events,
      };
    } catch (error) {
      throw new Error(`Failed to create webhook: ${error}`);
    }
  }

  async deleteWebhook(owner: string, repo: string, hookId: number) {
    try {
      await this.octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error) {
      throw new Error(`Failed to delete webhook: ${error}`);
    }
  }
}

export function createGitHubClient(accessToken: string): GitHubClient {
  return new GitHubClient(accessToken);
}
