import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  GitBranch,
  Star,
  Lock,
  Globe,
  Calendar,
  Search,
  Import,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@shared/api-client";
import type { GitHubRepository, GitHubBranch } from "@shared/github-client";
import { formatDistanceToNow } from "date-fns";

interface GitHubImportDialogProps {
  projectId: string;
  onImportSuccess?: (repository: GitHubRepository) => void;
  trigger?: React.ReactNode;
}

export default function GitHubImportDialog({
  projectId,
  onImportSuccess,
  trigger,
}: GitHubImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"auth" | "repos" | "branches" | "importing">(
    "auth",
  );
  const [accessToken, setAccessToken] = useState("");
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(
    null,
  );
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      setError("Please enter your GitHub access token");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verify token and get user info
      const userData = await apiClient.getGitHubUser(accessToken);
      setUser(userData);

      // Fetch repositories
      const repos = await apiClient.getGitHubRepositories(accessToken);
      setRepositories(repos);
      setStep("repos");
    } catch (err) {
      setError("Failed to connect to GitHub. Please check your access token.");
      console.error("GitHub connection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRepository = async (repository: GitHubRepository) => {
    setSelectedRepo(repository);
    setIsLoading(true);
    setError(null);

    try {
      const repoName = repository.name;
      const owner = repository.owner.login;
      const repoBranches = await apiClient.getGitHubBranches(
        accessToken,
        owner,
        repoName,
      );
      setBranches(repoBranches);
      setSelectedBranch(repository.defaultBranch);
      setStep("branches");
    } catch (err) {
      setError("Failed to fetch repository branches");
      console.error("Branches fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedRepo || !selectedBranch) {
      setError("Please select a repository and branch");
      return;
    }

    setStep("importing");
    setIsLoading(true);
    setError(null);

    try {
      console.log("Starting GitHub import process...");
      console.log("Project ID provided:", projectId);
      console.log("Selected repo:", selectedRepo?.name);
      console.log("Selected branch:", selectedBranch);

      let targetProjectId = projectId;

      // If no project ID provided, create a new project first
      if (!targetProjectId || targetProjectId.trim() === "") {
        console.log("No project ID provided, creating new project...");
        const newProject = {
          name: selectedRepo.name,
          description: selectedRepo.description || `Imported from ${selectedRepo.fullName}`,
          domain: `${selectedRepo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.builder.app`,
          status: "draft" as const,
        };

        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "mock-user-id", // TODO: Get from auth context
          },
          body: JSON.stringify(newProject),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Project creation failed:", response.status, errorText);
          throw new Error(`Failed to create project: ${response.status} ${response.statusText}`);
        }

        const project = await response.json();
        targetProjectId = project.id;
        console.log("Created project successfully:", project.id);
      }

      console.log("Importing repository to project:", targetProjectId);
      console.log("Import parameters:", {
        owner: selectedRepo.owner.login,
        repo: selectedRepo.name,
        projectId: targetProjectId,
        branch: selectedBranch,
        hasAccessToken: !!accessToken
      });

      const result = await apiClient.importGitHubRepository(
        accessToken,
        selectedRepo.owner.login,
        selectedRepo.name,
        targetProjectId,
        selectedBranch,
      );

      console.log("Import result:", result);

      onImportSuccess?.(selectedRepo);
      setIsOpen(false);
      resetDialog();
    } catch (err) {
      console.error("Import error:", err);

      // Provide more specific error messages based on the error content
      if (err.message.includes("Failed to create project")) {
        setError("Could not create project. Please try again or create a project first.");
      } else if (err.message.includes("Project ID is required")) {
        setError("Project ID validation failed. Please try again.");
      } else if (err.message.includes("GitHub access token required")) {
        setError("GitHub authentication failed. Please check your access token.");
      } else if (err.message.includes("User ID required")) {
        setError("Authentication error. Please try again.");
      } else if (err.message.includes("API Error: 400")) {
        setError("Invalid request. Please check your repository selection and try again.");
      } else if (err.message.includes("API Error: 401")) {
        setError("Authentication failed. Please check your GitHub token.");
      } else if (err.message.includes("API Error: 404")) {
        setError("Repository not found. Please check the repository exists and is accessible.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Import failed: ${err.message}`);
      }

      setStep("branches");
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setStep("auth");
    setAccessToken("");
    setRepositories([]);
    setSelectedRepo(null);
    setBranches([]);
    setSelectedBranch("");
    setSearchQuery("");
    setError(null);
    setUser(null);
  };

  const renderAuthStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="github-token">GitHub Personal Access Token</Label>
        <Input
          id="github-token"
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Create a token at{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub Settings
          </a>{" "}
          with repo permissions
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleConnect}
        disabled={isLoading || !accessToken.trim()}
        className="w-full"
      >
        {isLoading ? "Connecting..." : "Connect to GitHub"}
      </Button>
    </div>
  );

  const renderRepositoriesStep = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Github className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || user?.login}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStep("auth")}>
          Change Account
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-2">
          {filteredRepositories.map((repo) => (
            <Card
              key={repo.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelectRepository(repo)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium">{repo.name}</h4>
                      {repo.private ? (
                        <Lock className="w-3 h-3 text-yellow-600" />
                      ) : (
                        <Globe className="w-3 h-3 text-green-600" />
                      )}
                      {repo.language && (
                        <Badge variant="secondary" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <GitBranch className="w-3 h-3" />
                        <span>{repo.defaultBranch}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(new Date(repo.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {filteredRepositories.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No repositories found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );

  const renderBranchesStep = () => (
    <div className="space-y-4">
      {selectedRepo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{selectedRepo.name}</CardTitle>
            <CardDescription>{selectedRepo.description}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-2">
        <Label>Select Branch</Label>
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.name} value={branch.name}>
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-4 h-4" />
                  <span>{branch.name}</span>
                  {branch.name === selectedRepo?.defaultBranch && (
                    <Badge variant="outline" className="text-xs">
                      default
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => setStep("repos")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleImport}
          disabled={!selectedBranch || isLoading}
          className="flex-1"
        >
          <Import className="w-4 h-4 mr-2" />
          Import Repository
        </Button>
      </div>
    </div>
  );

  const renderImportingStep = () => (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h3 className="text-lg font-semibold">
          Repository Imported Successfully!
        </h3>
        <p className="text-muted-foreground">
          {selectedRepo?.name} has been imported into your project.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Import from GitHub
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>Import from GitHub</span>
          </DialogTitle>
          <DialogDescription>
            {step === "auth" &&
              "Connect your GitHub account to import repositories"}
            {step === "repos" && "Select a repository to import"}
            {step === "branches" && "Choose a branch to import from"}
            {step === "importing" && "Repository imported successfully"}
          </DialogDescription>
        </DialogHeader>

        {step === "auth" && renderAuthStep()}
        {step === "repos" && renderRepositoriesStep()}
        {step === "branches" && renderBranchesStep()}
        {step === "importing" && renderImportingStep()}
      </DialogContent>
    </Dialog>
  );
}
