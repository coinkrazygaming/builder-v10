import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GitPullRequest, AlertCircle, GitBranch } from "lucide-react";
import { apiClient } from "@shared/api-client";
import type { GitHubBranch, GitHubPullRequest } from "@shared/github-client";

interface GitHubPRDialogProps {
  accessToken: string;
  owner: string;
  repo: string;
  currentBranch?: string;
  onPRCreated?: (pullRequest: GitHubPullRequest) => void;
  trigger?: React.ReactNode;
}

export default function GitHubPRDialog({
  accessToken,
  owner,
  repo,
  currentBranch = "main",
  onPRCreated,
  trigger,
}: GitHubPRDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sourceBranch, setSourceBranch] = useState(currentBranch);
  const [targetBranch, setTargetBranch] = useState("main");

  // Load branches when dialog opens
  useEffect(() => {
    if (isOpen && accessToken) {
      loadBranches();
    }
  }, [isOpen, accessToken]);

  const loadBranches = async () => {
    try {
      setIsLoading(true);
      const branchList = await apiClient.getGitHubBranches(accessToken, owner, repo);
      setBranches(branchList);
      
      // Set default target branch (usually main or master)
      const mainBranch = branchList.find(b => b.name === "main") || 
                        branchList.find(b => b.name === "master") ||
                        branchList[0];
      if (mainBranch) {
        setTargetBranch(mainBranch.name);
      }
    } catch (err) {
      setError("Failed to load branches");
      console.error("Error loading branches:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePR = async () => {
    if (!title.trim()) {
      setError("Please enter a title for the pull request");
      return;
    }

    if (sourceBranch === targetBranch) {
      setError("Source and target branches must be different");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const pullRequest = await apiClient.createGitHubPullRequest(
        accessToken,
        owner,
        repo,
        title,
        sourceBranch,
        targetBranch,
        description || undefined
      );

      onPRCreated?.(pullRequest);
      setIsOpen(false);
      resetForm();
    } catch (err) {
      setError("Failed to create pull request. Please check your permissions and try again.");
      console.error("Error creating PR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSourceBranch(currentBranch);
    setTargetBranch("main");
    setError(null);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <GitPullRequest className="w-4 h-4 mr-2" />
            Create Pull Request
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <GitPullRequest className="w-5 h-5" />
            <span>Create Pull Request</span>
          </DialogTitle>
          <DialogDescription>
            Create a new pull request in {owner}/{repo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Branch Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-branch">Source Branch</Label>
              <Select value={sourceBranch} onValueChange={setSourceBranch}>
                <SelectTrigger id="source-branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.name} value={branch.name}>
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4" />
                        <span>{branch.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-branch">Target Branch</Label>
              <Select value={targetBranch} onValueChange={setTargetBranch}>
                <SelectTrigger id="target-branch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.name} value={branch.name}>
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4" />
                        <span>{branch.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="pr-title">Title *</Label>
            <Input
              id="pr-title"
              placeholder="Brief description of your changes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="pr-description">Description</Label>
            <Textarea
              id="pr-description"
              placeholder="Detailed description of the changes, motivation, and context"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              You can use Markdown to format your description
            </p>
          </div>

          {/* Preview */}
          {sourceBranch && targetBranch && sourceBranch !== targetBranch && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <span className="font-medium">Merge:</span> {sourceBranch} → {targetBranch}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePR}
            disabled={isLoading || !title.trim() || sourceBranch === targetBranch}
          >
            {isLoading ? "Creating..." : "Create Pull Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
