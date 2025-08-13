import type {
  JoseyConversation,
  JoseyMessage,
  JoseyTask,
  JoseyWorkflowPlan,
  JoseyCheckpoint,
  JoseyLog,
  JoseyScreenContext,
} from "./schema";

export interface JoseyRequest {
  message: string;
  userId: string;
  projectId?: string;
  context?: JoseyScreenContext;
}

export interface JoseyResponse {
  message: string;
  action?: JoseyAction;
  workflowPlan?: JoseyWorkflowPlan;
  tasks?: JoseyTask[];
  requiresApproval?: boolean;
  autoExecuteAfter?: number; // seconds
}

export interface JoseyAction {
  type: 'code_edit' | 'file_create' | 'file_delete' | 'server_command' | 'environment_setup' | 'checkpoint_create';
  payload: any;
  description: string;
}

export interface JoseyWorkflowStep {
  id: string;
  title: string;
  description: string;
  actions: JoseyAction[];
  dependencies?: string[];
  estimatedMinutes?: number;
}

export interface JoseyMasterPlan {
  id: string;
  title: string;
  description: string;
  steps: JoseyWorkflowStep[];
  totalSteps: number;
  completedSteps: number;
  status: 'analyzing' | 'planning' | 'approved' | 'executing' | 'completed' | 'failed';
}

export class JoseyAIService {
  private static instance: JoseyAIService;
  private conversations: Map<string, JoseyConversation> = new Map();
  private activeWorkflows: Map<string, JoseyMasterPlan> = new Map();
  private screenContexts: Map<string, JoseyScreenContext> = new Map();

  static getInstance(): JoseyAIService {
    if (!JoseyAIService.instance) {
      JoseyAIService.instance = new JoseyAIService();
    }
    return JoseyAIService.instance;
  }

  async processRequest(request: JoseyRequest): Promise<JoseyResponse> {
    console.log("🤖 JoseyAI processing request:", request.message);
    
    // Update screen context
    if (request.context) {
      this.updateScreenContext(request.userId, request.context);
    }

    // Analyze the request
    const analysis = await this.analyzeRequest(request);
    
    // Create workflow plan
    const workflowPlan = await this.createWorkflowPlan(request, analysis);
    
    // Generate response
    const response: JoseyResponse = {
      message: this.generateResponseMessage(analysis, workflowPlan),
      workflowPlan,
      requiresApproval: workflowPlan.steps.length > 1,
      autoExecuteAfter: 5, // Auto-execute after 5 seconds
    };

    return response;
  }

  private async analyzeRequest(request: JoseyRequest): Promise<any> {
    // This is where we'd integrate with an actual AI model
    // For now, we'll use rule-based analysis
    
    const analysis = {
      intent: this.detectIntent(request.message),
      complexity: this.assessComplexity(request.message),
      requiresCode: this.requiresCodeChanges(request.message),
      requiresServer: this.requiresServerAccess(request.message),
      screenAware: !!request.context,
    };

    console.log("🔍 Request analysis:", analysis);
    return analysis;
  }

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('build')) {
      return 'create';
    } else if (lowerMessage.includes('fix') || lowerMessage.includes('debug') || lowerMessage.includes('error')) {
      return 'debug';
    } else if (lowerMessage.includes('edit') || lowerMessage.includes('change') || lowerMessage.includes('modify')) {
      return 'edit';
    } else if (lowerMessage.includes('deploy') || lowerMessage.includes('server') || lowerMessage.includes('environment')) {
      return 'deploy';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('explain')) {
      return 'help';
    }
    
    return 'general';
  }

  private assessComplexity(message: string): 'low' | 'medium' | 'high' {
    const indicators = [
      'component', 'database', 'api', 'server', 'deploy', 'test', 'integration'
    ];
    
    const matches = indicators.filter(indicator => 
      message.toLowerCase().includes(indicator)
    ).length;
    
    if (matches >= 3) return 'high';
    if (matches >= 1) return 'medium';
    return 'low';
  }

  private requiresCodeChanges(message: string): boolean {
    const codeKeywords = [
      'component', 'function', 'class', 'css', 'style', 'html', 'javascript', 'typescript'
    ];
    return codeKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private requiresServerAccess(message: string): boolean {
    const serverKeywords = [
      'server', 'deploy', 'environment', 'command', 'terminal', 'npm', 'run'
    ];
    return serverKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private async createWorkflowPlan(request: JoseyRequest, analysis: any): Promise<JoseyWorkflowPlan> {
    const steps = this.generateWorkflowSteps(request, analysis);
    
    return {
      id: `plan_${Date.now()}`,
      conversationId: request.userId, // Temporary, should be actual conversation ID
      title: `Plan: ${request.message.substring(0, 50)}...`,
      description: `Executing ${analysis.intent} request with ${analysis.complexity} complexity`,
      status: 'planning',
      stepsTotal: steps.length,
      stepsCompleted: 0,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generateWorkflowSteps(request: JoseyRequest, analysis: any): JoseyWorkflowStep[] {
    const steps: JoseyWorkflowStep[] = [];

    // Step 1: Always analyze and plan
    steps.push({
      id: 'analyze',
      title: 'Analyze Requirements',
      description: 'Understanding the request and current context',
      actions: [{
        type: 'checkpoint_create',
        payload: { name: 'pre_analysis' },
        description: 'Create checkpoint before starting'
      }],
      estimatedMinutes: 1,
    });

    // Step 2: Code changes if needed
    if (analysis.requiresCode) {
      steps.push({
        id: 'code_changes',
        title: 'Implement Code Changes',
        description: 'Creating or modifying code files',
        actions: [{
          type: 'code_edit',
          payload: { intent: analysis.intent },
          description: 'Implement required code changes'
        }],
        dependencies: ['analyze'],
        estimatedMinutes: 5,
      });
    }

    // Step 3: Server operations if needed
    if (analysis.requiresServer) {
      steps.push({
        id: 'server_ops',
        title: 'Server Operations',
        description: 'Execute server commands and deployments',
        actions: [{
          type: 'server_command',
          payload: { intent: analysis.intent },
          description: 'Run server commands'
        }],
        dependencies: analysis.requiresCode ? ['code_changes'] : ['analyze'],
        estimatedMinutes: 3,
      });
    }

    // Step 4: Final checkpoint
    steps.push({
      id: 'finalize',
      title: 'Finalize and Checkpoint',
      description: 'Create final checkpoint and summary',
      actions: [{
        type: 'checkpoint_create',
        payload: { name: 'completion' },
        description: 'Create completion checkpoint'
      }],
      dependencies: [steps[steps.length - 1].id],
      estimatedMinutes: 1,
    });

    return steps;
  }

  private generateResponseMessage(analysis: any, plan: JoseyWorkflowPlan): string {
    const contextAware = analysis.screenAware ? 
      "I can see what you're currently working on. " : "";
    
    const complexity = analysis.complexity === 'high' ? 
      "This is a complex request that will require multiple steps. " :
      analysis.complexity === 'medium' ?
      "This is a moderate request. " :
      "This is a straightforward request. ";

    return `${contextAware}${complexity}I'll ${analysis.intent} what you need. ` +
           `My plan involves ${plan.stepsTotal} steps. ` +
           `Would you like me to proceed? I'll auto-execute in 5 seconds if you don't respond.`;
  }

  updateScreenContext(userId: string, context: JoseyScreenContext): void {
    this.screenContexts.set(userId, context);
    console.log("📱 Updated screen context for user:", userId, context);
  }

  getScreenContext(userId: string): JoseyScreenContext | undefined {
    return this.screenContexts.get(userId);
  }

  async createCheckpoint(name: string, data: any): Promise<JoseyCheckpoint> {
    const checkpoint: JoseyCheckpoint = {
      id: `checkpoint_${Date.now()}`,
      conversationId: data.conversationId || 'default',
      taskId: data.taskId,
      name,
      description: `Checkpoint: ${name}`,
      snapshotData: data,
      createdAt: new Date(),
    };

    console.log("💾 Created checkpoint:", checkpoint.name);
    return checkpoint;
  }

  async logAction(action: string, details: string, success: boolean = true): Promise<JoseyLog> {
    const log: JoseyLog = {
      id: `log_${Date.now()}`,
      conversationId: 'default', // Should be actual conversation ID
      taskId: null,
      action,
      details,
      metadata: {},
      success,
      createdAt: new Date(),
    };

    console.log(`📝 ${success ? '✅' : '❌'} ${action}: ${details}`);
    return log;
  }

  generateProactiveSuggestions(context: JoseyScreenContext): string[] {
    const suggestions: string[] = [];

    if (context.currentView === 'editor') {
      suggestions.push(
        "💡 Consider adding error boundaries to your components",
        "🔒 I can help implement TypeScript for better type safety",
        "⚡ Want me to optimize your component performance?"
      );
    }

    if (context.currentFile?.endsWith('.tsx')) {
      suggestions.push(
        "🎨 I can help improve the component's styling",
        "🧪 Would you like me to create tests for this component?",
        "📱 I can make this component mobile-responsive"
      );
    }

    return suggestions;
  }
}

export const joseyAI = JoseyAIService.getInstance();
