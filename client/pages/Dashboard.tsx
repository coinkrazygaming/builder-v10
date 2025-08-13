import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  MoreHorizontal,
  Globe,
  Edit,
  Trash2,
  ExternalLink,
  Layers,
  FolderOpen,
  Calendar,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  Github,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@shared/store";
import { useTheme } from "next-themes";
import { formatDistanceToNow } from "date-fns";
import GitHubImportDialog from "@/components/github/GitHubImportDialog";

// Mock user for demo
const mockUser = {
  id: "mock-user-id",
  displayName: "John Doe",
  primaryEmail: "john@example.com",
  signOut: () => {
    window.location.href = "/";
  },
};

export default function Dashboard() {
  const user = mockUser;
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    projects,
    isLoadingProjects,
    setProjects,
    setIsLoadingProjects,
    addProject,
    deleteProject,
  } = useAppStore();

  // Load projects from API
  useEffect(() => {
    setIsLoadingProjects(true);

    // Use the API endpoint
    fetch("/api/projects", {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setIsLoadingProjects(false);
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        setIsLoadingProjects(false);
      });
  }, [user, setProjects, setIsLoadingProjects]);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateProject = () => {
    const newProject = {
      name: "New Project",
      description: "A new website project",
      domain: `project-${Date.now()}.builder.app`,
      status: "draft" as const,
    };

    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify(newProject),
    })
      .then((res) => res.json())
      .then((project) => {
        addProject(project);
        navigate(`/editor/${project.id}`);
      })
      .catch((error) => {
        console.error("Error creating project:", error);
      });
  };

  const handleDeleteProject = (projectId: string) => {
    fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "x-user-id": user.id,
      },
    })
      .then(() => {
        deleteProject(projectId);
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BuilderClone
              </span>
            </Link>

            <Badge variant="secondary" className="ml-4">
              Dashboard
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
                    </span>
                  </div>
                  <span className="hidden md:block">
                    {user.displayName || user.primaryEmail}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => user.signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your websites and applications
              </p>
            </div>

            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline" asChild>
                <Link to="/github">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Link>
              </Button>
              <GitHubImportDialog
                projectId="" // Will be set after project creation
                onImportSuccess={(repo) => {
                  console.log("Repository imported:", repo);
                  // Refresh projects list
                  window.location.reload();
                }}
                trigger={
                  <Button variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Import from GitHub
                  </Button>
                }
              />
              <Button onClick={handleCreateProject}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {isLoadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No projects found" : "No projects yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first project to get started building"}
              </p>
              {!searchQuery && (
                <div className="flex space-x-2 justify-center">
                  <GitHubImportDialog
                    projectId=""
                    onImportSuccess={(repo) => {
                      console.log("Repository imported:", repo);
                      window.location.reload();
                    }}
                    trigger={
                      <Button variant="outline">
                        <Github className="w-4 h-4 mr-2" />
                        Import from GitHub
                      </Button>
                    }
                  />
                  <Button onClick={handleCreateProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || "No description"}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/editor/${project.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            project.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {project.status}
                        </Badge>
                        {project.customDomain && (
                          <Badge variant="outline" className="text-xs">
                            Custom Domain
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Globe className="w-4 h-4 mr-2" />
                        <span className="truncate">
                          {project.customDomain || project.domain}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Updated{" "}
                          {formatDistanceToNow(new Date(project.updatedAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/editor/${project.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Open Editor
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
