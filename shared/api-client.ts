import type { Project, NewProject, Page, NewPage, Component, NewComponent, Asset, NewAsset } from './schema';

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(project: NewProject): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
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
      method: 'POST',
      body: JSON.stringify(page),
    });
  }

  async updatePage(projectId: string, pageId: string, updates: Partial<Page>): Promise<Page> {
    return this.request<Page>(`/projects/${projectId}/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deletePage(projectId: string, pageId: string): Promise<void> {
    return this.request<void>(`/projects/${projectId}/pages/${pageId}`, {
      method: 'DELETE',
    });
  }

  // Components
  async getComponents(projectId?: string): Promise<Component[]> {
    const endpoint = projectId ? `/projects/${projectId}/components` : '/components';
    return this.request<Component[]>(endpoint);
  }

  async createComponent(component: NewComponent): Promise<Component> {
    return this.request<Component>('/components', {
      method: 'POST',
      body: JSON.stringify(component),
    });
  }

  async updateComponent(id: string, updates: Partial<Component>): Promise<Component> {
    return this.request<Component>(`/components/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteComponent(id: string): Promise<void> {
    return this.request<void>(`/components/${id}`, {
      method: 'DELETE',
    });
  }

  // Assets
  async getAssets(projectId: string): Promise<Asset[]> {
    return this.request<Asset[]>(`/projects/${projectId}/assets`);
  }

  async uploadAsset(projectId: string, file: File): Promise<Asset> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/assets`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async deleteAsset(projectId: string, assetId: string): Promise<void> {
    return this.request<void>(`/projects/${projectId}/assets/${assetId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
