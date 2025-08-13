import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  GitBranch,
  GitCommit,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import { apiClient } from "@shared/api-client";

interface FileChange {
  path: string;
  type: "added" | "modified" | "deleted";
  content?: string;
}

interface GitHubWorkflowProps {
  accessToken: string;
  owner: string;
  repo: string;
  branch: string;
  projectId: string;
}

export default function GitHubWorkflow({
  accessToken,
  owner,
  repo,
  branch,
  projectId,
}: GitHubWorkflowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPushDialog, setShowPushDialog] = useState(false);
  const [showPullDialog, setShowPullDialog] = useState(false);
  
  // Push state
  const [commitMessage, setCommitMessage] = useState("");
  const [pendingChanges, setPendingChanges] = useState<FileChange[]>([
    {
      path: "pages/home.tsx",
      type: "modified",
      content: "Updated homepage content",
    },
    {
      path: "components/hero.tsx",
      type: "added",
      content: "New hero component",
    },
    {
      path: "styles/old-theme.css",
      type: "deleted",
    },
  ]);
  
  // Pull state
  const [incomingChanges, setIncomingChanges] = useState<FileChange[]>([]);
  const [pullProgress, setPullProgress] = useState(0);

  const handlePush = async () => {
    if (!commitMessage.trim()) {
      setError("Please enter a commit message");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate pushing changes
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        // Update progress if needed
      }

      // TODO: Implement actual push logic
      // This would involve:
      // 1. Collecting all modified files from the project
      // 2. Converting them to GitHub file format
      // 3. Creating commits for each file
      // 4. Pushing to the repository

      setSuccess(`Successfully pushed ${pendingChanges.length} changes to ${branch}`);
      setPendingChanges([]);
      setShowPushDialog(false);
      setCommitMessage("");
    } catch (err) {
      setError("Failed to push changes to GitHub");
      console.error("Push error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePull = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setPullProgress(0);

    try {
      // Simulate fetching changes
      for (let i = 0; i <= 100; i += 20) {
        setPullProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // TODO: Implement actual pull logic
      // This would involve:
      // 1. Fetching latest commits from GitHub
      // 2. Comparing with local project state
      // 3. Identifying changed files
      // 4. Updating project files
      // 5. Preserving local changes or handling conflicts

      // Mock incoming changes
      const mockIncoming: FileChange[] = [
        {
          path: "components/navigation.tsx",
          type: "modified",
          content: "Updated navigation component",
        },
        {
          path: "utils/helpers.ts",
          type: "added",
          content: "New utility functions",
        },
      ];

      setIncomingChanges(mockIncoming);
      setSuccess(`Successfully pulled ${mockIncoming.length} changes from ${branch}`);
      setShowPullDialog(false);
    } catch (err) {
      setError("Failed to pull changes from GitHub");
      console.error("Pull error:", err);
    } finally {
      setIsLoading(false);
      setPullProgress(0);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "added":
        return <Plus className="w-3 h-3 text-green-500" />;
      case "modified":
        return <FileText className="w-3 h-3 text-blue-500" />;
      case "deleted":
        return <Minus className="w-3 h-3 text-red-500" />;
      default:
        return <FileText className="w-3 h-3 text-gray-500" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-100 text-green-800";
      case "modified":
        return "bg-blue-100 text-blue-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Push Changes</span>
            </CardTitle>
            <CardDescription>
              Push your local changes to GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending changes:</span>
                <Badge variant="outline">{pendingChanges.length}</Badge>
              </div>
              <Button
                onClick={() => setShowPushDialog(true)}
                disabled={pendingChanges.length === 0 || isLoading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Push to {branch}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Pull Changes</span>
            </CardTitle>
            <CardDescription>
              Pull latest changes from GitHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Incoming changes:</span>
                <Badge variant="outline">{incomingChanges.length}</Badge>
              </div>
              <Button
                onClick={handlePull}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Pull from {branch}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Push Dialog */}
      <Dialog open={showPushDialog} onOpenChange={setShowPushDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Push Changes to GitHub</span>
            </DialogTitle>
            <DialogDescription>
              Review your changes and commit them to {branch}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Commit Message */}
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message *</Label>
              <Input
                id="commit-message"
                placeholder="Brief description of your changes"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Changed Files */}
            <div className="space-y-2">
              <Label>Changed Files ({pendingChanges.length})</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                {pendingChanges.map((change, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-muted rounded-sm">
                    {getChangeIcon(change.type)}
                    <span className="text-sm font-mono flex-1">{change.path}</span>
                    <Badge variant="outline" className={`text-xs ${getChangeColor(change.type)}`}>
                      {change.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPushDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePush}
              disabled={isLoading || !commitMessage.trim()}
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Pushing...
                </>
              ) : (
                <>
                  <GitCommit className="w-4 h-4 mr-2" />
                  Commit & Push
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pull Progress Dialog */}
      <Dialog open={showPullDialog} onOpenChange={setShowPullDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Pulling Changes</span>
            </DialogTitle>
            <DialogDescription>
              Fetching latest changes from {branch}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Progress value={pullProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {pullProgress}% complete
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
