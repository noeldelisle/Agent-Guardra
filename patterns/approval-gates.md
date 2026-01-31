# Approval Gates

Require explicit approval before an agent executes high-risk or irreversible actions.

## Problem

Agents act autonomously. Without intervention points, a single bad decision propagates through the system before anyone notices.

High-risk actions—data deletion, external API calls, financial transactions—should not execute automatically.

## Pattern

Insert an approval gate between intent and execution.

When an agent requests a high-risk action:
1. The request is logged with full context
2. Execution is paused
3. An approver (human or automated policy) reviews the request
4. The action proceeds only if approved

Approval can be:
- synchronous (blocking until approved)
- asynchronous (queued for later review)
- conditional (auto-approved if criteria are met)

## When to use

- Actions with irreversible consequences
- Operations involving sensitive data
- External system modifications
- Financial or contractual commitments
- Any action where cost of failure exceeds cost of delay

## When not to use

- High-frequency, low-risk operations
- Read-only queries
- Actions within well-defined, low-impact boundaries
- Situations where latency is unacceptable and risk is minimal

## Failure modes

- **Approval fatigue**: too many requests degrade review quality
- **Stale context**: approver lacks information to make good decisions
- **Bypass paths**: agents find alternative routes that skip the gate
- **Single point of failure**: unavailable approvers block all progress
- **Rubber-stamping**: approvers approve without reviewing

## Notes

Approval gates are not security controls. They are decision checkpoints.

Design the approval interface to surface relevant context. Do not require approvers to reconstruct intent from raw logs.

Consider tiered approval: auto-approve low-risk, queue medium-risk, escalate high-risk.

Measure approval latency and rejection rates. Both indicate system health.
