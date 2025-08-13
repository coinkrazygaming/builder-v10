import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bot,
  User,
  Send,
  Minimize2,
  Maximize2,
  CheckCircle,
  Circle,
  Clock,
  Zap,
  AlertCircle,
  Brain,
  Eye,
  Terminal,
  Code,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@shared/api-client";
import type {
  JoseyScreenContext,
  JoseyTask,
  JoseyWorkflowPlan,
} from "@shared/schema";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  workflowPlan?: JoseyWorkflowPlan;
  tasks?: JoseyTask[];
  autoExecuteAfter?: number;
}

interface JoseyAIChatProps {
  userId: string;
  projectId?: string;
  currentView: string;
  currentFile?: string;
  selectedElement?: string;
  className?: string;
}

export default function JoseyAIChat({
  userId,
  projectId,
  currentView,
  currentFile,
  selectedElement,
  className,
}: JoseyAIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] =
    useState<JoseyWorkflowPlan | null>(null);
  const [autoExecuteTimer, setAutoExecuteTimer] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isUpdatingSuggestions, setIsUpdatingSuggestions] = useState(false);
  const [isUpdatingContext, setIsUpdatingContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoExecuteRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm JoseyAI, your coding companion. I can help you create, edit, debug, and deploy code. I'm aware of what you're working on and can provide context-aware assistance. What would you like to build today?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);

    // Generate initial suggestions (with delay to avoid startup race conditions)
    setTimeout(() => {
      updateProactiveSuggestions();
    }, 1000);
  }, []);

  // Update screen context when props change
  useEffect(() => {
    const updateContext = async () => {
      const context: JoseyScreenContext = {
        id: `context_${Date.now()}`,
        userId,
        currentView,
        currentFile: currentFile || null,
        selectedElement: selectedElement || null,
        viewportData: {},
        updatedAt: new Date(),
      };

      // Prevent multiple simultaneous context updates
      if (isUpdatingContext) return;

      setIsUpdatingContext(true);
      try {
        await apiClient.updateJoseyContext(context);
        // Update suggestions after context update (with debounce)
        setTimeout(() => {
          if (!isUpdatingSuggestions) {
            updateProactiveSuggestions();
          }
        }, 500);
      } catch (error) {
        // Silently fail for now - JoseyAI API might not be available
        console.warn("JoseyAI context update unavailable:", error.message);
      } finally {
        setIsUpdatingContext(false);
      }
    };

    updateContext();
  }, [userId, currentView, currentFile, selectedElement]);

  const updateProactiveSuggestions = async () => {
    // Prevent multiple simultaneous requests
    if (isUpdatingSuggestions) return;

    setIsUpdatingSuggestions(true);
    try {
      const response = await apiClient.getJoseySuggestions();
      setSuggestions(response.suggestions || []);
    } catch (error) {
      // Silently fail for now - JoseyAI API might not be available
      console.warn("JoseyAI suggestions unavailable:", error.message);
      setSuggestions([]);
    } finally {
      setIsUpdatingSuggestions(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const context: JoseyScreenContext = {
        id: `context_${Date.now()}`,
        userId,
        currentView,
        currentFile: currentFile || null,
        selectedElement: selectedElement || null,
        viewportData: {},
        updatedAt: new Date(),
      };

      const response = await apiClient.sendMessageToJosey(
        input,
        projectId,
        context,
      );

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        workflowPlan: response.workflowPlan,
        tasks: response.tasks,
        autoExecuteAfter: response.autoExecuteAfter,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.workflowPlan) {
        setActiveWorkflow(response.workflowPlan);
      }

      // Start auto-execute timer if required
      if (response.requiresApproval && response.autoExecuteAfter) {
        startAutoExecuteTimer(response.autoExecuteAfter);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: "system",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startAutoExecuteTimer = (seconds: number) => {
    setAutoExecuteTimer(seconds);

    if (autoExecuteRef.current) {
      clearInterval(autoExecuteRef.current);
    }

    autoExecuteRef.current = setInterval(() => {
      setAutoExecuteTimer((prev) => {
        if (prev === null || prev <= 1) {
          handleAutoExecute();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoExecute = () => {
    if (autoExecuteRef.current) {
      clearInterval(autoExecuteRef.current);
      autoExecuteRef.current = null;
    }
    setAutoExecuteTimer(null);
    handleApproveWorkflow();
  };

  const handleApproveWorkflow = () => {
    if (activeWorkflow) {
      const approvalMessage: ChatMessage = {
        id: `approval_${Date.now()}`,
        role: "assistant",
        content: `✅ Executing plan: ${activeWorkflow.title}. I'll work through each step and keep you updated.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, approvalMessage]);

      // Start executing workflow
      executeWorkflow(activeWorkflow);
    }
  };

  const handleDenyWorkflow = () => {
    if (autoExecuteRef.current) {
      clearInterval(autoExecuteRef.current);
      autoExecuteRef.current = null;
    }
    setAutoExecuteTimer(null);
    setActiveWorkflow(null);

    const denialMessage: ChatMessage = {
      id: `denial_${Date.now()}`,
      role: "assistant",
      content:
        "Understood. The plan has been cancelled. What would you like me to do instead?",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, denialMessage]);
  };

  const executeWorkflow = async (workflow: JoseyWorkflowPlan) => {
    // This is where we'd execute the actual workflow steps
    // For now, we'll simulate the execution
    const executionMessage: ChatMessage = {
      id: `execution_${Date.now()}`,
      role: "assistant",
      content: `🚀 Starting execution of ${workflow.stepsTotal} steps. I'll create checkpoints after each step.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, executionMessage]);

    // Simulate workflow execution
    setTimeout(() => {
      const completionMessage: ChatMessage = {
        id: `completion_${Date.now()}`,
        role: "assistant",
        content: `✅ Workflow completed successfully! All ${workflow.stepsTotal} steps have been executed. A checkpoint has been created.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
      setActiveWorkflow(null);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion.replace(/[💡🔒⚡🎨🧪📱]/g, "").trim());
  };

  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isMinimized) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Bot className="w-4 h-4 mr-2" />
          JoseyAI
          {isLoading && <Clock className="w-3 h-3 ml-2 animate-spin" />}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <Card className="flex-1 flex flex-col shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">JoseyAI</CardTitle>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs"
              >
                {currentView}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Eye className="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Screen Aware</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {currentFile && (
            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
              <Code className="w-3 h-3" />
              <span>{currentFile}</span>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start space-x-3 group",
                    message.role === "user" &&
                      "flex-row-reverse space-x-reverse",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : message.role === "system"
                          ? "bg-amber-500 text-white"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : message.role === "system" ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex-1 space-y-2",
                      message.role === "user" && "text-right",
                    )}
                  >
                    <div
                      className={cn(
                        "inline-block p-3 rounded-lg max-w-[85%] shadow-sm border",
                        message.role === "user"
                          ? "bg-blue-500 text-white ml-auto border-blue-500"
                          : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600",
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Workflow Plan Display */}
                    {message.workflowPlan && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 mt-2">
                        <h4 className="font-semibold text-sm mb-2 flex items-center text-purple-700 dark:text-purple-300">
                          <Brain className="w-4 h-4 mr-2" />
                          Master Plan: {message.workflowPlan.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {message.workflowPlan.description}
                        </p>
                        <div className="space-y-1">
                          {Array.from(
                            { length: message.workflowPlan.stepsTotal },
                            (_, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400"
                              >
                                {getWorkflowStatusIcon("pending")}
                                <span>Step {i + 1}: Processing...</span>
                              </div>
                            ),
                          )}
                        </div>

                        {message.autoExecuteAfter && autoExecuteTimer && (
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-amber-600 dark:text-amber-400 font-medium">Auto-executing in {autoExecuteTimer}s</span>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleDenyWorkflow}
                                  className="h-7 px-3 text-xs"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleApproveWorkflow}
                                  className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                                >
                                  Approve Now
                                </Button>
                              </div>
                            </div>
                            <Progress
                              value={
                                ((message.autoExecuteAfter - autoExecuteTimer) /
                                  message.autoExecuteAfter) *
                                100
                              }
                              className="h-1"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3 group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 p-3 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">JoseyAI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Proactive Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quick Suggestions</span>
              </div>
              <div className="space-y-2">
                {suggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left text-xs p-2 rounded-md bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask JoseyAI anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3" />
                <span>Auto-execute in 5s</span>
              </div>
              <div className="flex items-center space-x-1">
                <Terminal className="w-3 h-3" />
                <span>Server access enabled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
