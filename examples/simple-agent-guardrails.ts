/**
 * Simple Agent Guardrails
 * 
 * Demonstrates basic guardrail patterns for constraining agent tool access.
 * This is illustrative code, not production-ready.
 */

interface Tool {
  name: string;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

interface ToolPolicy {
  allowedTools: string[];
  maxActionsPerSession: number;
  requireApprovalFor: string[];
}

interface AgentContext {
  sessionId: string;
  actionCount: number;
  policy: ToolPolicy;
}

/**
 * Check if a tool is on the allowlist
 */
function isToolAllowed(toolName: string, policy: ToolPolicy): boolean {
  return policy.allowedTools.includes(toolName);
}

/**
 * Check if action count is within limits
 */
function isWithinRateLimit(context: AgentContext): boolean {
  return context.actionCount < context.policy.maxActionsPerSession;
}

/**
 * Check if tool requires approval
 */
function requiresApproval(toolName: string, policy: ToolPolicy): boolean {
  return policy.requireApprovalFor.includes(toolName);
}

/**
 * Execute a tool with guardrails applied
 */
async function executeWithGuardrails(
  tool: Tool,
  params: Record<string, unknown>,
  context: AgentContext,
  getApproval: (toolName: string, params: Record<string, unknown>) => Promise<boolean>
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  
  // Check allowlist
  if (!isToolAllowed(tool.name, context.policy)) {
    return {
      success: false,
      error: `Tool "${tool.name}" is not on the allowlist`
    };
  }

  // Check rate limits
  if (!isWithinRateLimit(context)) {
    return {
      success: false,
      error: `Session action limit (${context.policy.maxActionsPerSession}) exceeded`
    };
  }

  // Check approval requirements
  if (requiresApproval(tool.name, context.policy)) {
    const approved = await getApproval(tool.name, params);
    if (!approved) {
      return {
        success: false,
        error: `Approval denied for tool "${tool.name}"`
      };
    }
  }

  // Execute the tool
  try {
    context.actionCount++;
    const result = await tool.execute(params);
    return { success: true, result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

// Example usage
const examplePolicy: ToolPolicy = {
  allowedTools: ["read_file", "search", "calculate"],
  maxActionsPerSession: 50,
  requireApprovalFor: ["write_file", "send_email"]
};

const exampleContext: AgentContext = {
  sessionId: "session-001",
  actionCount: 0,
  policy: examplePolicy
};

// Mock tool
const readFileTool: Tool = {
  name: "read_file",
  execute: async (params) => {
    return { content: `Contents of ${params.path}` };
  }
};

// Mock approval function
async function mockGetApproval(toolName: string, params: Record<string, unknown>): Promise<boolean> {
  console.log(`Approval requested for ${toolName} with params:`, params);
  return true;
}

// Execute with guardrails
executeWithGuardrails(readFileTool, { path: "/example.txt" }, exampleContext, mockGetApproval)
  .then(result => console.log("Result:", result));
