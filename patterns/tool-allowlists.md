# Tool Allowlists

Restrict which tools an agent can invoke based on explicit policy.

## Problem

Agents with broad tool access can take actions outside their intended scope. A coding assistant that can also send emails is one prompt injection away from spamming your customers.

Default-allow tool access is a design flaw.

## Pattern

Maintain an explicit list of permitted tools for each agent or agent class.

Implementation:
1. Define a tool registry with all available tools
2. Assign each agent a policy specifying allowed tools
3. Intercept all tool invocations at runtime
4. Reject any invocation not on the allowlist
5. Log rejected attempts

The allowlist should be:
- declarative (defined in configuration, not code)
- versioned (changes are tracked)
- environment-aware (different permissions for dev/prod)

## When to use

- Multi-tool agents
- Agents operating in shared environments
- Systems where tool capabilities vary in risk
- Any agent that could plausibly attempt unauthorized actions

## When not to use

- Single-purpose agents with one tool
- Fully sandboxed environments where all actions are safe
- Prototyping phases where rapid iteration matters more than control

## Failure modes

- **Overly broad allowlists**: defeats the purpose
- **Stale allowlists**: new tools added without policy updates
- **Inconsistent enforcement**: some code paths bypass the check
- **Tool aliasing**: same capability exposed under different names
- **Capability creep**: tools gain new features that exceed original risk profile

## Notes

Allowlists are necessary but not sufficient. A tool on the allowlist can still be misused.

Combine with parameter validation. Allowing a tool does not mean allowing all inputs to that tool.

Review allowlists regularly. Tools evolve. Permissions should too.

Consider deny-lists for specific high-risk tools as a secondary control, but do not rely on them as primary defense.
