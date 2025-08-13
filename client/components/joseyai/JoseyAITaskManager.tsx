import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  Target,
  ListTodo,
  Timer,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JoseyTask, JoseyWorkflowPlan } from "@shared/schema";

interface TaskGroup {
  id: string;
  title: string;
  description: string;
  tasks: JoseyTask[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
}

interface JoseyAITaskManagerProps {
  workflowPlan?: JoseyWorkflowPlan;
  tasks: JoseyTask[];
  onTaskAction?: (taskId: string, action: 'start' | 'complete' | 'skip') => void;
  className?: string;
}

export default function JoseyAITaskManager({
  workflowPlan,
  tasks,
  onTaskAction,
  className,
}: JoseyAITaskManagerProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);

  useEffect(() => {
    // Group tasks by workflow steps
    const groups = groupTasksByWorkflow(tasks);
    setTaskGroups(groups);
    
    // Auto-expand first incomplete group
    const firstIncomplete = groups.find(g => g.status !== 'completed');
    if (firstIncomplete) {
      setExpandedGroups(new Set([firstIncomplete.id]));
    }
  }, [tasks]);

  const groupTasksByWorkflow = (tasks: JoseyTask[]): TaskGroup[] => {
    // Group tasks by their parent or create default groups
    const groups: TaskGroup[] = [
      {
        id: 'analysis',
        title: 'Analysis & Planning',
        description: 'Understanding requirements and creating execution plan',
        tasks: tasks.filter(t => t.title.toLowerCase().includes('analy') || t.title.toLowerCase().includes('plan')),
        status: 'pending',
        priority: 1,
      },
      {
        id: 'implementation',
        title: 'Implementation',
        description: 'Creating and modifying code files',
        tasks: tasks.filter(t => t.title.toLowerCase().includes('implement') || t.title.toLowerCase().includes('create') || t.title.toLowerCase().includes('code')),
        status: 'pending',
        priority: 2,
      },
      {
        id: 'testing',
        title: 'Testing & Validation',
        description: 'Running tests and validating changes',
        tasks: tasks.filter(t => t.title.toLowerCase().includes('test') || t.title.toLowerCase().includes('valid')),
        status: 'pending',
        priority: 3,
      },
      {
        id: 'deployment',
        title: 'Deployment & Finalization',
        description: 'Deploying changes and creating checkpoints',
        tasks: tasks.filter(t => t.title.toLowerCase().includes('deploy') || t.title.toLowerCase().includes('checkpoint') || t.title.toLowerCase().includes('final')),
        status: 'pending',
        priority: 4,
      },
    ];

    // Add any ungrouped tasks to implementation
    const groupedTaskIds = new Set(groups.flatMap(g => g.tasks.map(t => t.id)));
    const ungroupedTasks = tasks.filter(t => !groupedTaskIds.has(t.id));
    groups[1].tasks.push(...ungroupedTasks);

    // Update group statuses based on tasks
    groups.forEach(group => {
      if (group.tasks.length === 0) {
        group.status = 'completed';
      } else if (group.tasks.every(t => t.status === 'completed')) {
        group.status = 'completed';
      } else if (group.tasks.some(t => t.status === 'in_progress')) {
        group.status = 'in_progress';
      } else if (group.tasks.some(t => t.status === 'failed')) {
        group.status = 'failed';
      } else {
        group.status = 'pending';
      }
    });

    return groups.filter(g => g.tasks.length > 0);
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string, size = "w-4 h-4") => {
    switch (status) {
      case 'completed':
        return <CheckCircle className={cn(size, "text-green-500")} />;
      case 'in_progress':
        return <Clock className={cn(size, "text-blue-500 animate-pulse")} />;
      case 'failed':
        return <AlertTriangle className={cn(size, "text-red-500")} />;
      default:
        return <Circle className={cn(size, "text-gray-400")} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return (completed / tasks.length) * 100;
  };

  const getTotalEstimatedTime = () => {
    return tasks.reduce((total, task) => total + (task.estimatedMinutes || 0), 0);
  };

  const getCompletedTime = () => {
    return tasks
      .filter(t => t.status === 'completed')
      .reduce((total, task) => total + (task.actualMinutes || task.estimatedMinutes || 0), 0);
  };

  if (tasks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No active tasks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Master Plan</span>
            </CardTitle>
            <CardDescription>
              {workflowPlan?.title || "AI Workflow Execution"}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(calculateProgress())}%
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Timer className="w-3 h-3" />
                <span>{getCompletedTime()}m / {getTotalEstimatedTime()}m</span>
              </div>
              <div className="flex items-center space-x-1">
                <ListTodo className="w-3 h-3" />
                <span>{tasks.filter(t => t.status === 'completed').length} / {tasks.length} tasks</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span>Auto-executing</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {taskGroups.map((group, groupIndex) => (
              <div key={group.id} className="border rounded-lg overflow-hidden">
                <div
                  className={cn(
                    "p-3 cursor-pointer transition-colors",
                    expandedGroups.has(group.id) ? "bg-purple-50" : "bg-gray-50 hover:bg-gray-100"
                  )}
                  onClick={() => toggleGroupExpansion(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(group.status)}
                        <span className="font-medium">{group.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(group.status)}
                      <Badge variant="outline" className="text-xs">
                        {group.tasks.length} tasks
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 ml-7">{group.description}</p>
                </div>

                {expandedGroups.has(group.id) && (
                  <div className="border-t bg-white">
                    {group.tasks.map((task, taskIndex) => (
                      <div key={task.id} className="p-3 border-b last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getStatusIcon(task.status)}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">{task.title}</h4>
                              {task.description && (
                                <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Timer className="w-3 h-3" />
                                  <span>
                                    {task.estimatedMinutes}m
                                    {task.actualMinutes && ` (${task.actualMinutes}m actual)`}
                                  </span>
                                </div>
                                {task.priority > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    Priority {task.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {task.status === 'pending' && (
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onTaskAction?.(task.id, 'skip')}
                              >
                                <SkipForward className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onTaskAction?.(task.id, 'start')}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          
                          {task.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => onTaskAction?.(task.id, 'complete')}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
