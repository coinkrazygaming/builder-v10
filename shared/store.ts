import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Project, Page, Component, Asset } from './schema';

interface AppState {
  // Current user projects
  projects: Project[];
  currentProject: Project | null;
  
  // Current project data
  pages: Page[];
  currentPage: Page | null;
  components: Component[];
  assets: Asset[];
  
  // Editor state
  selectedElement: string | null;
  isPreviewMode: boolean;
  editorScale: number;
  
  // UI state
  sidebarCollapsed: boolean;
  isDarkMode: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoadingProjects: boolean;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  setPages: (pages: Page[]) => void;
  setCurrentPage: (page: Page | null) => void;
  addPage: (page: Page) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  
  setComponents: (components: Component[]) => void;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  deleteComponent: (id: string) => void;
  
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  
  setSelectedElement: (id: string | null) => void;
  setIsPreviewMode: (isPreview: boolean) => void;
  setEditorScale: (scale: number) => void;
  
  setSidebarCollapsed: (collapsed: boolean) => void;
  setIsDarkMode: (isDark: boolean) => void;
  
  setIsLoading: (loading: boolean) => void;
  setIsLoadingProjects: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      pages: [],
      currentPage: null,
      components: [],
      assets: [],
      selectedElement: null,
      isPreviewMode: false,
      editorScale: 1,
      sidebarCollapsed: false,
      isDarkMode: false,
      isLoading: false,
      isLoadingProjects: false,
      
      // Project actions
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      addProject: (project) => set((state) => ({ 
        projects: [...state.projects, project] 
      })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates } 
          : state.currentProject
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),
      
      // Page actions
      setPages: (pages) => set({ pages }),
      setCurrentPage: (page) => set({ currentPage: page }),
      addPage: (page) => set((state) => ({ 
        pages: [...state.pages, page] 
      })),
      updatePage: (id, updates) => set((state) => ({
        pages: state.pages.map(p => p.id === id ? { ...p, ...updates } : p),
        currentPage: state.currentPage?.id === id 
          ? { ...state.currentPage, ...updates } 
          : state.currentPage
      })),
      deletePage: (id) => set((state) => ({
        pages: state.pages.filter(p => p.id !== id),
        currentPage: state.currentPage?.id === id ? null : state.currentPage
      })),
      
      // Component actions
      setComponents: (components) => set({ components }),
      addComponent: (component) => set((state) => ({ 
        components: [...state.components, component] 
      })),
      updateComponent: (id, updates) => set((state) => ({
        components: state.components.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteComponent: (id) => set((state) => ({
        components: state.components.filter(c => c.id !== id)
      })),
      
      // Asset actions
      setAssets: (assets) => set({ assets }),
      addAsset: (asset) => set((state) => ({ 
        assets: [...state.assets, asset] 
      })),
      deleteAsset: (id) => set((state) => ({
        assets: state.assets.filter(a => a.id !== id)
      })),
      
      // Editor actions
      setSelectedElement: (id) => set({ selectedElement: id }),
      setIsPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),
      setEditorScale: (scale) => set({ editorScale: scale }),
      
      // UI actions
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
      
      // Loading actions
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsLoadingProjects: (loading) => set({ isLoadingProjects: loading }),
    }),
    {
      name: 'builder-store',
    }
  )
);
