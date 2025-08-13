import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Search,
  MoreHorizontal,
  ExternalLink,
  Settings,
  Trash2,
  Plus,
  Calendar,
  Users,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import GitHubImportDialog from "@/components/github/GitHubImportDialog";
import GitHubSync from "@/components/github/GitHubSync";
import GitHubPRDialog from "@/components/github/GitHubPRDialog";
import GitHubWorkflow from "@/components/github/GitHubWorkflow";
import type { GithubRepository, GithubSyncHistory, GithubPullRequest } from "@shared/schema";
import type { GitHubRepository } from "@shared/github-client";

// Mock data for demonstration
const mockRepositories: GithubRepository[] = [
  {
    id: "repo1",
    projectId: "project1",
    repoUrl: "https://github.com/user/my-website",
    repoName: "my-website",
    repoOwner: "user",
    branch: "main",
    accessToken: "mock-token",
    webhookId: null,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    syncEnabled: true,
    autoDeployEnabled: false,
    createdBy: "user123",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "repo2",
    projectId: "project2",
    repoUrl: "https://github.com/user/portfolio",
    repoName: "portfolio",
    repoOwner: "user",
    branch: "main",
    accessToken: "mock-token",
    webhookId: "webhook123",
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    syncEnabled: true,
    autoDeployEnabled: true,
    createdBy: "user123",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export default function GitHubDashboard() {
  const [repositories, setRepositories] = useState<GithubRepository[]>(mockRepositories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepository | null>(repositories[0] || null);

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.repoOwner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRepositoryImport = (repository: GitHubRepository) => {
    // Convert GitHub repository to local repository format
    const newRepo: GithubRepository = {
      id: `repo${repositories.length + 1}`,
      projectId: `project${repositories.length + 1}`,
      repoUrl: repository.htmlUrl,
      repoName: repository.name,
      repoOwner: repository.owner.login,
      branch: repository.defaultBranch,
      accessToken: "mock-token", // Should be stored securely
      webhookId: null,
      lastSync: null,
      syncEnabled: true,
      autoDeployEnabled: false,
      createdBy: "user123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRepositories([...repositories, newRepo]);
    setSelectedRepo(newRepo);
  };

  const handleDisconnectRepository = (repoId: string) => {
    setRepositories(repositories.filter(repo => repo.id !== repoId));
    if (selectedRepo?.id === repoId) {
      setSelectedRepo(repositories.find(repo => repo.id !== repoId) || null);
    }
  };

  const getSyncStatusBadge = (repo: GithubRepository) => {
    if (!repo.syncEnabled) {
      return <Badge variant="outline">Disabled</Badge>;
    }
    
    if (!repo.lastSync) {
      return <Badge variant="secondary">Never synced</Badge>;
    }

    const hoursSinceSync = (Date.now() - new Date(repo.lastSync).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceSync < 1) {
      return <Badge variant="default" className="bg-green-500">Recently synced</Badge>;
    } else if (hoursSinceSync < 24) {
      return <Badge variant="secondary">Synced today</Badge>;
    } else {
      return <Badge variant="outline">Needs sync</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                GitHub Integration
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <GitHubImportDialog
              projectId=""
              onImportSuccess={handleRepositoryImport}
              trigger={
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Repository
                </Button>
              }
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Repository List */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connected Repositories</CardTitle>
                  <CardDescription>
                    Manage your GitHub repository connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Repository List */}
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {filteredRepositories.map((repo) => (
                        <Card
                          key={repo.id}
                          className={`cursor-pointer transition-colors ${
                            selectedRepo?.id === repo.id
                              ? "bg-muted border-primary"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedRepo(repo)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{repo.repoName}</h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View on GitHub
                                      </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Settings className="mr-2 h-4 w-4" />
                                      Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDisconnectRepository(repo.id)}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Disconnect
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              
                              <p className="text-xs text-muted-foreground">
                                {repo.repoOwner}/{repo.repoName}
                              </p>
                              
                              <div className="flex items-center space-x-2">
                                <GitBranch className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs">{repo.branch}</span>
                                {getSyncStatusBadge(repo)}
                              </div>
                              
                              {repo.lastSync && (
                                <p className="text-xs text-muted-foreground">
                                  Last sync: {formatDistanceToNow(new Date(repo.lastSync), { addSuffix: true })}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>

                  {filteredRepositories.length === 0 && !searchQuery && (
                    <div className="text-center py-8">
                      <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Repositories Connected</h3>
                      <p className="text-muted-foreground mb-4">
                        Connect your first GitHub repository to get started
                      </p>
                      <GitHubImportDialog
                        projectId=""
                        onImportSuccess={handleRepositoryImport}
                        trigger={
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Connect Repository
                          </Button>
                        }
                      />
                    </div>
                  )}

                  {filteredRepositories.length === 0 && searchQuery && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No repositories found matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Repository Details */}
            <div className="lg:col-span-2">
              {selectedRepo ? (
                <Tabs defaultValue="sync" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sync">Sync & Deploy</TabsTrigger>
                    <TabsTrigger value="workflow">Push/Pull</TabsTrigger>
                    <TabsTrigger value="pull-requests">Pull Requests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sync">
                    <GitHubSync
                      projectId={selectedRepo.projectId}
                      repository={selectedRepo}
                      onDisconnect={() => handleDisconnectRepository(selectedRepo.id)}
                    />
                  </TabsContent>

                  <TabsContent value="workflow">
                    <GitHubWorkflow
                      accessToken={selectedRepo.accessToken || ""}
                      owner={selectedRepo.repoOwner}
                      repo={selectedRepo.repoName}
                      branch={selectedRepo.branch}
                      projectId={selectedRepo.projectId}
                    />
                  </TabsContent>

                  <TabsContent value="pull-requests">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <GitPullRequest className="w-5 h-5" />
                              <span>Pull Requests</span>
                            </CardTitle>
                            <CardDescription>
                              Manage pull requests for {selectedRepo.repoName}
                            </CardDescription>
                          </div>
                          <GitHubPRDialog
                            accessToken={selectedRepo.accessToken || ""}
                            owner={selectedRepo.repoOwner}
                            repo={selectedRepo.repoName}
                            currentBranch={selectedRepo.branch}
                            onPRCreated={(pr) => {
                              console.log("PR created:", pr);
                            }}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-center py-8">
                          Pull request management coming soon...
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Github className="w-16 h-16 text-muted-foreground mx-auto" />
                      <h3 className="text-xl font-semibold">Select a Repository</h3>
                      <p className="text-muted-foreground">
                        Choose a repository from the list to manage its GitHub integration
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
