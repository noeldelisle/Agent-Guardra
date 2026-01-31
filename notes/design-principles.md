# Design Principles

Core principles for designing guardrails in agentic systems.

---

## Separation of Intent and Execution

The agent expresses intent. The system decides whether and how to execute.

- Intent is a request, not a command
- Execution is mediated by policy
- The gap between intent and execution is where control lives

Do not let agents execute directly. Insert a layer that interprets, validates, and constrains.

---

## Explicit Boundaries

Every agent operates within defined boundaries. Those boundaries must be:

- **Declared**: written in configuration, not assumed
- **Enforced**: checked at runtime, not just documented
- **Visible**: observable by operators

Implicit boundaries fail. If it is not written down and checked, it does not exist.

Common boundaries:
- Which tools can be invoked
- What data can be accessed
- How many actions can occur
- What environments are reachable

---

## Default Deny

Start with no permissions. Add them deliberately.

- New tools are blocked until explicitly allowed
- New actions require approval until proven safe
- New environments are unreachable until configured

Default deny forces intentionality. Every permission is a decision.

The alternative—default allow with explicit denies—fails because you cannot anticipate every dangerous action.

---

## Observability Before Autonomy

You cannot control what you cannot see.

Before granting autonomy:
1. Ensure all actions are logged
2. Ensure logs are structured and searchable
3. Ensure alerts exist for anomalies
4. Ensure humans can reconstruct what happened

Autonomy is earned. Observability is the prerequisite.

Agents without logging are not autonomous. They are unaccountable.

---

## Least Privilege

Grant the minimum permissions required for the task.

- If an agent only reads, do not grant write access
- If an agent only needs one table, do not grant database-wide access
- If an agent operates in staging, do not grant production access

Excess privilege accumulates risk without adding value.

Review permissions regularly. Needs change. Permissions should change with them.

---

## Defense in Depth

No single control is sufficient. Layer them.

- Allowlists AND rate limits
- Approval gates AND logging
- Sandboxing AND blast radius limits

Each layer catches what the previous layer missed.

Assume every layer will fail. Design so that failure of one layer does not mean failure of the system.

---

## Fail Closed

When uncertain, deny. When broken, stop.

- If policy cannot be evaluated, deny the action
- If approval times out, deny the action
- If logging fails, halt execution

Fail-open systems degrade silently into unsafe states.

Fail-closed systems are inconvenient. That inconvenience is the point.

---

## Human Judgment as a Resource

Humans are part of the system. Use them wisely.

- Reserve human attention for decisions that matter
- Provide enough context for informed decisions
- Respect cognitive limits

Human-in-the-loop is not a checkbox. It is a design constraint.

Too many requests degrade judgment. Too few requests create false confidence.
