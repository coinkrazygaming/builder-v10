import type {
  Project,
  NewProject,
  Page,
  NewPage,
  Component,
  NewComponent,
  Asset,
  NewAsset,
  GithubRepository,
  NewGithubRepository,
} from "./schema";
import type {
  GitHubRepository,
  GitHubBranch,
  GitHubCommit,
  GitHubPullRequest,
  GitHubFileContent,
} from "./github-client";

class ApiClient {
  private baseUrl = "/api";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Clone the response to avoid body stream issues
    const responseClone = response.clone();

    if (!response.ok) {
      // Use the clone for error handling
      const errorText = await responseClone.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // Use the clone for non-JSON responses
      const responseText = await responseClone.text();
      throw new Error(
        `Expected JSON response but got ${contentType}: ${responseText.substring(0, 100)}`,
      );
    }

    try {
      // Use the original response for JSON parsing
      return await response.json();
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError.message}`);
    }
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>("/projects");
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(project: NewProject): Promise<Project> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Pages
  async getPages(projectId: string): Promise<Page[]> {
    return this.request<Page[]>(`/projects/${projectId}/pages`);
  }

  async getPage(projectId: string, pageId: string): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages/${pageId}`);
  }

  async createPage(projectId: string, page: NewPage): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages`, {
      method: "POST",
      body: JSON.stringify(page),
    });
  }

  async updatePage(
    projectId: string,
    pageId: string,
    updates: Partial<Page>,
  ): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages/${pageId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deletePage(projectId: string, pageId: string): Promise<void> {
    return this.request<void>(`/projects/${projectId}/pages/${pageId}`, {
      method: "DELETE",
    });
  }

  // Components
  async getComponents(projectId?: string): Promise<Component[]> {
    const endpoint = projectId
      ? `/projects/${projectId}/components`
      : "/components";
    return this.request<Component[]>(endpoint);
  }

  async createComponent(component: NewComponent): Promise<Component> {
    return this.request<Component>("/components", {
      method: "POST",
      body: JSON.stringify(component),
    });
  }

  async updateComponent(
    id: string,
    updates: Partial<Component>,
  ): Promise<Component> {
    return this.request<Component>(`/components/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteComponent(id: string): Promise<void> {
    return this.request<void>(`/components/${id}`, {
      method: "DELETE",
    });
  }

  // Assets
  async getAssets(projectId: string): Promise<Asset[]> {
    return this.request<Asset[]>(`/projects/${projectId}/assets`);
  }

  async uploadAsset(projectId: string, file: File): Promise<Asset> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${this.baseUrl}/projects/${projectId}/assets`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async deleteAsset(projectId: string, assetId: string): Promise<void> {
    return this.request<void>(`/projects/${projectId}/assets/${assetId}`, {
      method: "DELETE",
    });
  }

  // GitHub integration
  async getGitHubUser(accessToken: string) {
    return this.request(`/github/user`, {
      headers: {
        "x-github-token": accessToken,
      },
    });
  }

  async getGitHubRepositories(
    accessToken: string,
    page = 1,
    perPage = 30,
  ): Promise<GitHubRepository[]> {
    return this.request<GitHubRepository[]>(
      `/github/repositories?page=${page}&per_page=${perPage}`,
      {
        headers: {
          "x-github-token": accessToken,
        },
      },
    );
  }

  async getGitHubRepository(
    accessToken: string,
    owner: string,
    repo: string,
  ): Promise<GitHubRepository> {
    return this.request<GitHubRepository>(
      `/github/repositories/${owner}/${repo}`,
      {
        headers: {
          "x-github-token": accessToken,
        },
      },
    );
  }

  async getGitHubBranches(
    accessToken: string,
    owner: string,
    repo: string,
  ): Promise<GitHubBranch[]> {
    return this.request<GitHubBranch[]>(
      `/github/repositories/${owner}/${repo}/branches`,
      {
        headers: {
          "x-github-token": accessToken,
        },
      },
    );
  }

  async getGitHubContents(
    accessToken: string,
    owner: string,
    repo: string,
    path = "",
    ref?: string,
  ): Promise<GitHubFileContent[]> {
    const params = new URLSearchParams();
    if (path) params.append("path", path);
    if (ref) params.append("ref", ref);

    return this.request<GitHubFileContent[]>(
      `/github/repositories/${owner}/${repo}/contents?${params}`,
      {
        headers: {
          "x-github-token": accessToken,
        },
      },
    );
  }

  async getGitHubFile(
    accessToken: string,
    owner: string,
    repo: string,
    path: string,
    ref?: string,
  ): Promise<GitHubFileContent> {
    const params = new URLSearchParams({ path });
    if (ref) params.append("ref", ref);

    return this.request<GitHubFileContent>(
      `/github/repositories/${owner}/${repo}/file?${params}`,
      {
        headers: {
          "x-github-token": accessToken,
        },
      },
    );
  }

  async importGitHubRepository(
    accessToken: string,
    owner: string,
    repo: string,
    projectId: string,
    branch = "main",
  ) {
    return this.request(`/github/repositories/${owner}/${repo}/import`, {
      method: "POST",
      headers: {
        "x-github-token": accessToken,
      },
      body: JSON.stringify({ projectId, branch }),
    });
  }

  async getGitHubPullRequests(
    accessToken: string,
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
  ): Promise<GitHubPullRequest[]> {
    return this.request<GitHubPullRequest[]>(
      `/github/repositories/${owner}/${repo}/pull-requests?state=${state}`,
      {
        headers: {
          "x-github-token": accessToken,
        },
      },
    );
  }

  async createGitHubPullRequest(
    accessToken: string,
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string,
  ): Promise<GitHubPullRequest> {
    return this.request<GitHubPullRequest>(
      `/github/repositories/${owner}/${repo}/pull-requests`,
      {
        method: "POST",
        headers: {
          "x-github-token": accessToken,
        },
        body: JSON.stringify({ title, head, base, body }),
      },
    );
  }

  async createOrUpdateGitHubFile(
    accessToken: string,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
    sha?: string,
  ) {
    return this.request(`/github/repositories/${owner}/${repo}/files`, {
      method: "POST",
      headers: {
        "x-github-token": accessToken,
      },
      body: JSON.stringify({ path, content, message, branch, sha }),
    });
  }
}

export const apiClient = new ApiClient();
