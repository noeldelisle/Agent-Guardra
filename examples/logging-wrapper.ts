/**
 * Logging Wrapper
 * 
 * Demonstrates wrapping tool calls with structured logging
 * for audit and observability.
 * This is illustrative code, not production-ready.
 */

interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  eventType: "tool_invocation" | "tool_success" | "tool_failure" | "tool_blocked";
  agentId: string;
  sessionId: string;
  toolName: string;
  params?: Record<string, unknown>;
  result?: unknown;
  error?: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

interface LoggingConfig {
  logParams: boolean;
  logResults: boolean;
  sensitiveFields: string[];
  sink: (entry: LogEntry) => void;
}

/**
 * Redact sensitive fields from an object
 */
function redactSensitiveFields(
  obj: Record<string, unknown>,
  sensitiveFields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key)) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = redactSensitiveFields(
        value as Record<string, unknown>,
        sensitiveFields
      );
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Create a logging wrapper for tool execution
 */
function createLoggingWrapper(config: LoggingConfig) {
  function log(entry: Omit<LogEntry, "timestamp">) {
    const fullEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    config.sink(fullEntry);
  }

  /**
   * Wrap a tool execution with logging
   */
  async function wrap<T>(
    toolName: string,
    params: Record<string, unknown>,
    agentId: string,
    sessionId: string,
    execute: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const startTime = Date.now();
    
    const safeParams = config.logParams
      ? redactSensitiveFields(params, config.sensitiveFields)
      : undefined;

    // Log invocation
    log({
      level: "info",
      eventType: "tool_invocation",
      agentId,
      sessionId,
      toolName,
      params: safeParams,
      metadata
    });

    try {
      const result = await execute();
      const durationMs = Date.now() - startTime;

      // Log success
      log({
        level: "info",
        eventType: "tool_success",
        agentId,
        sessionId,
        toolName,
        result: config.logResults ? result : undefined,
        durationMs,
        metadata
      });

      return result;
    } catch (err) {
      const durationMs = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Log failure
      log({
        level: "error",
        eventType: "tool_failure",
        agentId,
        sessionId,
        toolName,
        error: errorMessage,
        durationMs,
        metadata
      });

      throw err;
    }
  }

  /**
   * Log a blocked tool invocation
   */
  function logBlocked(
    toolName: string,
    params: Record<string, unknown>,
    agentId: string,
    sessionId: string,
    reason: string,
    metadata?: Record<string, unknown>
  ) {
    const safeParams = config.logParams
      ? redactSensitiveFields(params, config.sensitiveFields)
      : undefined;

    log({
      level: "warn",
      eventType: "tool_blocked",
      agentId,
      sessionId,
      toolName,
      params: safeParams,
      error: reason,
      metadata
    });
  }

  return { wrap, logBlocked };
}

// Example: Console sink for development
function consoleSink(entry: LogEntry): void {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.eventType}]`;
  console.log(`${prefix} agent=${entry.agentId} tool=${entry.toolName}`);
  
  if (entry.params) {
    console.log("  params:", JSON.stringify(entry.params));
  }
  if (entry.result) {
    console.log("  result:", JSON.stringify(entry.result));
  }
  if (entry.error) {
    console.log("  error:", entry.error);
  }
  if (entry.durationMs !== undefined) {
    console.log("  duration:", entry.durationMs, "ms");
  }
}

// Example: Structured JSON sink for production
function jsonSink(entry: LogEntry): void {
  // In production, this would write to a log aggregation service
  console.log(JSON.stringify(entry));
}

// Example usage
const logger = createLoggingWrapper({
  logParams: true,
  logResults: true,
  sensitiveFields: ["password", "apiKey", "token", "secret"],
  sink: consoleSink
});

async function exampleUsage() {
  // Successful execution
  await logger.wrap(
    "read_file",
    { path: "/data/config.json" },
    "agent-001",
    "session-abc",
    async () => {
      return { content: '{"setting": "value"}' };
    }
  );

  // Execution with sensitive fields redacted
  await logger.wrap(
    "authenticate",
    { username: "user@example.com", password: "secret123", apiKey: "sk-xxx" },
    "agent-001",
    "session-abc",
    async () => {
      return { authenticated: true };
    }
  );

  // Blocked execution
  logger.logBlocked(
    "delete_database",
    { database: "production" },
    "agent-001",
    "session-abc",
    "Tool not on allowlist"
  );

  // Failed execution
  try {
    await logger.wrap(
      "external_api",
      { endpoint: "/api/data" },
      "agent-001",
      "session-abc",
      async () => {
        throw new Error("Connection timeout");
      }
    );
  } catch {
    // Error already logged
  }
}

exampleUsage();
