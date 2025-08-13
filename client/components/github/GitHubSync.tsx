import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Settings,
  Upload,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type {
  GithubRepository,
  GithubSyncHistory,
  GithubPullRequest,
} from "@shared/schema";

interface GitHubSyncProps {
  projectId: string;
  repository?: GithubRepository;
  onDisconnect?: () => void;
}

// Mock data for demonstration
const mockSyncHistory: GithubSyncHistory[] = [
  {
    id: "1",
    repositoryId: "repo1",
    syncType: "push",
    commitHash: "abc123",
    commitMessage: "Update homepage design",
    status: "success",
    errorMessage: null,
    changedFiles: ["pages/home.tsx", "styles/global.css"],
    triggeredBy: "user123",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    repositoryId: "repo1",
    syncType: "pull",
    commitHash: "def456",
    commitMessage: "Add new component library",
    status: "success",
    errorMessage: null,
    changedFiles: ["components/ui/button.tsx"],
    triggeredBy: "user456",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    repositoryId: "repo1",
    syncType: "push",
    commitHash: "ghi789",
    commitMessage: "Fix responsive layout",
    status: "failed",
    errorMessage: "Merge conflict in styles/layout.css",
    changedFiles: ["styles/layout.css"],
    triggeredBy: "user123",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
];

const mockPullRequests: GithubPullRequest[] = [
  {
    id: "pr1",
    repositoryId: "repo1",
    prNumber: 42,
    title: "Feature: Add dark mode support",
    description:
      "Implements dark mode theme switching with user preference persistence",
    sourceBranch: "feature/dark-mode",
    targetBranch: "main",
    status: "open",
    prUrl: "https://github.com/user/repo/pull/42",
    createdBy: "user123",
    mergedBy: null,
    mergedAt: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "pr2",
    repositoryId: "repo1",
    prNumber: 41,
    title: "Bugfix: Resolve mobile navigation issues",
    description: "Fixes hamburger menu not closing on mobile devices",
    sourceBranch: "bugfix/mobile-nav",
    targetBranch: "main",
    status: "merged",
    prUrl: "https://github.com/user/repo/pull/41",
    createdBy: "user456",
    mergedBy: "user123",
    mergedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
];

export default function GitHubSync({
  projectId,
  repository,
  onDisconnect,
}: GitHubSyncProps) {
  const [syncEnabled, setSyncEnabled] = useState(
    repository?.syncEnabled ?? true,
  );
  const [autoDeployEnabled, setAutoDeployEnabled] = useState(
    repository?.autoDeployEnabled ?? false,
  );
  const [syncHistory, setSyncHistory] =
    useState<GithubSyncHistory[]>(mockSyncHistory);
  const [pullRequests, setPullRequests] =
    useState<GithubPullRequest[]>(mockPullRequests);

  if (!repository) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Github className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">
              No GitHub Repository Connected
            </h3>
            <p className="text-muted-foreground">
              Connect a GitHub repository to enable version control and
              collaboration features.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePushChanges = () => {
    // TODO: Implement push to GitHub
    console.log("Pushing changes to GitHub...");
  };

  const handlePullChanges = () => {
    // TODO: Implement pull from GitHub
    console.log("Pulling changes from GitHub...");
  };

  const handleCreatePR = () => {
    // TODO: Implement create PR
    console.log("Creating pull request...");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPRStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="default" className="bg-green-500">
            Open
          </Badge>
        );
      case "merged":
        return (
          <Badge variant="secondary" className="bg-purple-500 text-white">
            Merged
          </Badge>
        );
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Repository Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Github className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">{repository.repoName}</CardTitle>
                <CardDescription>
                  {repository.repoOwner}/{repository.repoName} •{" "}
                  {repository.branch} branch
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href={repository.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Repository Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      <span className="text-red-500">Disconnect</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Disconnect GitHub Repository?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the connection between your project and
                        the GitHub repository. You won't be able to sync changes
                        automatically.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDisconnect}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sync-enabled">Enable Sync</Label>
              <p className="text-sm text-muted-foreground">
                Allow automatic synchronization with GitHub
              </p>
            </div>
            <Switch
              id="sync-enabled"
              checked={syncEnabled}
              onCheckedChange={setSyncEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-deploy">Auto Deploy</Label>
              <p className="text-sm text-muted-foreground">
                Deploy changes automatically when pushed to GitHub
              </p>
            </div>
            <Switch
              id="auto-deploy"
              checked={autoDeployEnabled}
              onCheckedChange={setAutoDeployEnabled}
              disabled={!syncEnabled}
            />
          </div>

          <Separator />

          <div className="flex space-x-2">
            <Button onClick={handlePushChanges} className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Push Changes
            </Button>
            <Button
              onClick={handlePullChanges}
              variant="outline"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Pull Changes
            </Button>
            <Button onClick={handleCreatePR} variant="outline">
              <GitPullRequest className="w-4 h-4 mr-2" />
              Create PR
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pull Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5" />
            <span>Pull Requests</span>
          </CardTitle>
          <CardDescription>
            Recent pull requests for this repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-48">
            <div className="space-y-3">
              {pullRequests.map((pr) => (
                <div
                  key={pr.id}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        #{pr.prNumber}
                      </span>
                      <span className="text-sm">{pr.title}</span>
                      {getPRStatusBadge(pr.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pr.sourceBranch} → {pr.targetBranch}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(pr.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={pr.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitCommit className="w-5 h-5" />
            <span>Sync History</span>
          </CardTitle>
          <CardDescription>Recent synchronization activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {syncHistory.map((sync) => (
                <div
                  key={sync.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <div className="mt-0.5">{getStatusIcon(sync.status)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {sync.syncType}
                      </Badge>
                      <span className="text-sm font-medium">
                        {sync.commitMessage}
                      </span>
                    </div>
                    {sync.commitHash && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {sync.commitHash}
                      </p>
                    )}
                    {sync.errorMessage && (
                      <p className="text-xs text-red-600">
                        {sync.errorMessage}
                      </p>
                    )}
                    {sync.changedFiles && sync.changedFiles.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {sync.changedFiles.length} file(s) changed
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(sync.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
