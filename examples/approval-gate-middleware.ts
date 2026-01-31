/**
 * Approval Gate Middleware
 * 
 * Demonstrates a middleware pattern for inserting approval gates
 * between agent intent and tool execution.
 * This is illustrative code, not production-ready.
 */

interface ApprovalRequest {
  requestId: string;
  toolName: string;
  params: Record<string, unknown>;
  agentId: string;
  sessionId: string;
  timestamp: Date;
  context: string;
}

interface ApprovalDecision {
  requestId: string;
  approved: boolean;
  approver: string;
  reason?: string;
  timestamp: Date;
}

type ApprovalHandler = (request: ApprovalRequest) => Promise<ApprovalDecision>;

interface ApprovalGateConfig {
  toolsRequiringApproval: string[];
  timeoutMs: number;
  timeoutBehavior: "deny" | "escalate";
  approvalHandler: ApprovalHandler;
}

/**
 * Creates an approval gate middleware
 */
function createApprovalGate(config: ApprovalGateConfig) {
  const pendingRequests = new Map<string, ApprovalRequest>();

  function generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  async function requestApproval(
    toolName: string,
    params: Record<string, unknown>,
    agentId: string,
    sessionId: string,
    context: string
  ): Promise<ApprovalDecision> {
    const request: ApprovalRequest = {
      requestId: generateRequestId(),
      toolName,
      params,
      agentId,
      sessionId,
      timestamp: new Date(),
      context
    };

    pendingRequests.set(request.requestId, request);

    try {
      const decision = await Promise.race([
        config.approvalHandler(request),
        createTimeout(config.timeoutMs)
      ]);

      return decision;
    } finally {
      pendingRequests.delete(request.requestId);
    }
  }

  function createTimeout(ms: number): Promise<ApprovalDecision> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isEscalate = config.timeoutBehavior === "escalate";
        resolve({
          requestId: "timeout",
          approved: false,
          approver: isEscalate ? "escalation-required" : "system",
          reason: isEscalate 
            ? `Approval timed out after ${ms}ms - escalation required`
            : `Approval timed out after ${ms}ms - denied by timeout policy`,
          timestamp: new Date()
        });
      }, ms);
    });
  }

  function requiresApproval(toolName: string): boolean {
    return config.toolsRequiringApproval.includes(toolName);
  }

  /**
   * Middleware function to wrap tool execution
   */
  async function middleware<T>(
    toolName: string,
    params: Record<string, unknown>,
    agentId: string,
    sessionId: string,
    context: string,
    execute: () => Promise<T>
  ): Promise<{ approved: boolean; result?: T; decision?: ApprovalDecision }> {
    
    if (!requiresApproval(toolName)) {
      const result = await execute();
      return { approved: true, result };
    }

    const decision = await requestApproval(toolName, params, agentId, sessionId, context);

    if (!decision.approved) {
      return { approved: false, decision };
    }

    const result = await execute();
    return { approved: true, result, decision };
  }

  return {
    middleware,
    requiresApproval,
    getPendingRequests: () => Array.from(pendingRequests.values())
  };
}

// Example: Synchronous human approval handler
async function humanApprovalHandler(request: ApprovalRequest): Promise<ApprovalDecision> {
  console.log("\n=== APPROVAL REQUIRED ===");
  console.log(`Tool: ${request.toolName}`);
  console.log(`Agent: ${request.agentId}`);
  console.log(`Context: ${request.context}`);
  console.log(`Params:`, JSON.stringify(request.params, null, 2));
  console.log("=========================\n");

  // In production, this would wait for human input
  // For demonstration, auto-approve after delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    requestId: request.requestId,
    approved: true,
    approver: "human-operator",
    timestamp: new Date()
  };
}

// Example: Policy-based automatic approval handler
async function policyApprovalHandler(request: ApprovalRequest): Promise<ApprovalDecision> {
  // Example policy: auto-approve read operations, deny write to sensitive paths
  const params = request.params;
  
  if (request.toolName === "write_file") {
    const path = params.path as string;
    if (path?.includes("/sensitive/") || path?.includes("/config/")) {
      return {
        requestId: request.requestId,
        approved: false,
        approver: "policy-engine",
        reason: "Write to sensitive path denied by policy",
        timestamp: new Date()
      };
    }
  }

  return {
    requestId: request.requestId,
    approved: true,
    approver: "policy-engine",
    timestamp: new Date()
  };
}

// Example usage
const gate = createApprovalGate({
  toolsRequiringApproval: ["write_file", "delete_file", "send_email", "execute_command"],
  timeoutMs: 30000,
  timeoutBehavior: "deny",
  approvalHandler: policyApprovalHandler
});

// Using the middleware
async function exampleUsage() {
  const result = await gate.middleware(
    "write_file",
    { path: "/data/output.txt", content: "Hello" },
    "agent-001",
    "session-abc",
    "User requested file write",
    async () => {
      return { written: true, bytes: 5 };
    }
  );

  console.log("Execution result:", result);
}

exampleUsage();
