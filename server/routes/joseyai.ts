import { RequestHandler } from "express";
import { joseyAI, type JoseyRequest } from "../../shared/joseyai-service";

// POST /api/joseyai/chat - Send message to JoseyAI
export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const { message, projectId, context } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const request: JoseyRequest = {
      message,
      userId,
      projectId,
      context,
    };

    console.log("🤖 Processing JoseyAI request:", {
      userId,
      message: message.substring(0, 50),
    });

    const response = await joseyAI.processRequest(request);

    res.json(response);
  } catch (error) {
    console.error("Error processing JoseyAI request:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

// POST /api/joseyai/context - Update screen context
export const updateContext: RequestHandler = async (req, res) => {
  try {
    const { context } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    if (!context) {
      return res.status(400).json({ error: "Context is required" });
    }

    joseyAI.updateScreenContext(userId, context);

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating context:", error);
    res.status(500).json({ error: "Failed to update context" });
  }
};

// GET /api/joseyai/suggestions - Get proactive suggestions
export const getSuggestions: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    const context = joseyAI.getScreenContext(userId);

    if (!context) {
      return res.json({ suggestions: [] });
    }

    const suggestions = joseyAI.generateProactiveSuggestions(context);

    res.json({ suggestions });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
};

// POST /api/joseyai/checkpoint - Create checkpoint
export const createCheckpoint: RequestHandler = async (req, res) => {
  try {
    const { name, data } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Checkpoint name is required" });
    }

    const checkpoint = await joseyAI.createCheckpoint(name, {
      ...data,
      userId,
      timestamp: Date.now(),
    });

    res.json(checkpoint);
  } catch (error) {
    console.error("Error creating checkpoint:", error);
    res.status(500).json({ error: "Failed to create checkpoint" });
  }
};

// POST /api/joseyai/log - Log action
export const logAction: RequestHandler = async (req, res) => {
  try {
    const { action, details, success = true } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    if (!action) {
      return res.status(400).json({ error: "Action is required" });
    }

    const log = await joseyAI.logAction(action, details, success);

    res.json(log);
  } catch (error) {
    console.error("Error logging action:", error);
    res.status(500).json({ error: "Failed to log action" });
  }
};

// POST /api/joseyai/execute - Execute workflow step
export const executeWorkflowStep: RequestHandler = async (req, res) => {
  try {
    const { stepId, workflowId, action } = req.body;
    const userId = req.headers["x-user-id"] as string;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    console.log(`🚀 Executing workflow step: ${stepId} for user: ${userId}`);

    // Simulate step execution
    const result = {
      stepId,
      workflowId,
      status: "completed",
      output: `Successfully executed ${action?.type || "unknown"} action`,
      timestamp: new Date(),
    };

    // Log the execution
    await joseyAI.logAction(
      `execute_step_${stepId}`,
      `Executed workflow step: ${action?.description || "No description"}`,
      true,
    );

    res.json(result);
  } catch (error) {
    console.error("Error executing workflow step:", error);
    res.status(500).json({ error: "Failed to execute workflow step" });
  }
};

// GET /api/joseyai/status - Get JoseyAI system status
export const getStatus: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string;

    const status = {
      online: true,
      version: "1.0.0",
      capabilities: [
        "Code creation and editing",
        "Debugging and error fixing",
        "Server command execution",
        "Environment management",
        "Screen awareness",
        "Task tracking",
        "Auto-execution",
        "Checkpoint creation",
        "Proactive suggestions",
      ],
      currentUser: userId,
      screenContext: userId ? joseyAI.getScreenContext(userId) : null,
      timestamp: new Date(),
    };

    res.json(status);
  } catch (error) {
    console.error("Error getting status:", error);
    res.status(500).json({ error: "Failed to get status" });
  }
};
