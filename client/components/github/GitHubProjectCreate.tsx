import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Github,
  Plus,
  AlertCircle,
  CheckCircle,
  Globe,
  Lock,
  GitBranch,
} from "lucide-react";
import { apiClient } from "@shared/api-client";
import GitHubImportDialog from "./GitHubImportDialog";
import type { GitHubRepository } from "@shared/github-client";

interface GitHubProjectCreateProps {
  onProjectCreated?: (project: any, repository?: GitHubRepository) => void;
}

export default function GitHubProjectCreate({ onProjectCreated }: GitHubProjectCreateProps) {
  const [activeTab, setActiveTab] = useState<"blank" | "github">("blank");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blank project form state
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDomain, setProjectDomain] = useState("");
  const [connectGitHub, setConnectGitHub] = useState(false);

  const handleCreateBlankProject = async () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate domain from project name if not provided
      const domain = projectDomain || 
        projectName.toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') + '.builder.app';

      const newProject = {
        name: projectName,
        description: projectDescription || undefined,
        domain,
        status: "draft" as const,
      };

      // Create project via API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "mock-user-id", // TODO: Get from auth context
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const project = await response.json();
      onProjectCreated?.(project);
      resetForm();
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error("Project creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubImport = (repository: GitHubRepository) => {
    // Create project from imported repository
    const project = {
      name: repository.name,
      description: repository.description || `Imported from ${repository.fullName}`,
      domain: `${repository.name.toLowerCase()}.builder.app`,
      status: "draft" as const,
      githubRepositoryId: repository.id.toString(),
    };

    onProjectCreated?.(project, repository);
  };

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectDomain("");
    setConnectGitHub(false);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Start building your website with our visual editor or import from GitHub
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "blank" | "github")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blank" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Blank Project</span>
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center space-x-2">
            <Github className="w-4 h-4" />
            <span>Import from GitHub</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blank" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Blank Project</CardTitle>
              <CardDescription>
                Start with a clean slate and build your website from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name *</Label>
                <Input
                  id="project-name"
                  placeholder="My Awesome Website"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Brief description of your project"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              {/* Domain */}
              <div className="space-y-2">
                <Label htmlFor="project-domain">Domain</Label>
                <div className="flex">
                  <Input
                    id="project-domain"
                    placeholder="my-website"
                    value={projectDomain}
                    onChange={(e) => setProjectDomain(e.target.value)}
                    disabled={isLoading}
                    className="rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .builder.app
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-generate from project name
                </p>
              </div>

              {/* GitHub Integration Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="connect-github"
                  checked={connectGitHub}
                  onCheckedChange={(checked) => setConnectGitHub(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="connect-github" className="text-sm">
                  Connect to GitHub repository (can be done later)
                </Label>
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Create Button */}
              <Button
                onClick={handleCreateBlankProject}
                disabled={isLoading || !projectName.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Creating Project..." : "Create Project"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>Import from GitHub</span>
              </CardTitle>
              <CardDescription>
                Import an existing repository and continue building with our visual editor
              </CardDescription>
            </CardContent>
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="p-8 border-2 border-dashed border-muted rounded-lg">
                  <Github className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect Your Repository</h3>
                  <p className="text-muted-foreground mb-4">
                    Import code from any GitHub repository and enhance it with visual editing
                  </p>
                  
                  <GitHubImportDialog
                    projectId="" // Will be created during import
                    onImportSuccess={handleGitHubImport}
                    trigger={
                      <Button size="lg">
                        <Github className="w-4 h-4 mr-2" />
                        Browse Repositories
                      </Button>
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                      <Github className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium">Import Code</h4>
                    <p className="text-xs text-muted-foreground">
                      Bring in your existing codebase
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                      <Plus className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium">Visual Editing</h4>
                    <p className="text-xs text-muted-foreground">
                      Enhance with drag-and-drop editor
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                      <GitBranch className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium">Stay Synced</h4>
                    <p className="text-xs text-muted-foreground">
                      Keep your repository up to date
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}