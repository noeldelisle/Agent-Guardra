# Blast Radius Containment

Limit the scope of damage an agent can cause in a single action or session.

## Problem

An agent with unrestricted access can cause unbounded damage. A bug, hallucination, or attack can propagate across systems, data stores, or user accounts.

The question is not whether agents will fail. The question is how much damage they can do when they fail.

## Pattern

Constrain agent actions along multiple dimensions:

**Scope limits**:
- Restrict to specific resources (files, tables, accounts)
- Limit to specific environments (sandbox, staging)
- Bound to specific time windows

**Volume limits**:
- Cap number of actions per session
- Limit data volume per operation
- Throttle request rates

**Depth limits**:
- Prevent recursive or chained actions beyond a threshold
- Block actions that trigger other agents
- Limit call stack depth

Implement limits as hard boundaries, not warnings.

## When to use

- Agents with write access to shared resources
- Multi-tenant systems
- Agents that can trigger downstream effects
- Any system where worst-case failure is unacceptable

## When not to use

- Fully isolated sandbox environments
- Read-only agents
- Situations where artificial limits would break core functionality

## Failure modes

- **Limits too high**: provide no real protection
- **Limits too low**: break legitimate use cases
- **Limits not enforced**: exist in policy but not in code
- **Limit exhaustion attacks**: adversary triggers limits to deny service
- **Accumulation across sessions**: per-session limits allow sustained damage over time

## Notes

Blast radius is about worst-case thinking. Assume the agent will do the worst thing it can. Then make sure that thing is survivable.

Defense in depth applies. Multiple overlapping limits are better than one perfect limit.

Test your limits. Simulate failures and verify containment.

Limits should be observable. Alert when agents approach boundaries.
