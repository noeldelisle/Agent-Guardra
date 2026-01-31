# Human-in-the-Loop

Insert human decision points into agent workflows at critical junctures.

## Problem

Autonomous agents lack judgment. They optimize for their objective function, not for context they cannot perceive.

Humans provide judgment, accountability, and the ability to recognize when something feels wrong.

## Pattern

Identify decision points where human judgment adds value. At those points:

1. Pause agent execution
2. Present the agent's proposed action with context
3. Collect human input (approve, reject, modify)
4. Resume execution based on human decision

Design considerations:
- **Clarity**: the human must understand what they are approving
- **Context**: provide enough information for informed decisions
- **Escape hatches**: allow humans to abort, modify, or escalate
- **Timeouts**: define behavior when humans do not respond

## When to use

- Decisions with significant consequences
- Novel situations outside training distribution
- Actions affecting other humans
- Regulatory or policy-sensitive operations
- Any point where you would want a human to sign off

## When not to use

- High-frequency, low-stakes decisions
- Situations requiring sub-second response times
- Well-understood, repeatedly validated operations
- When human availability cannot be guaranteed

## Failure modes

- **Checkbox syndrome**: humans approve without reviewing
- **Bottleneck creation**: human becomes single point of failure
- **Context collapse**: too much or too little information
- **Alert fatigue**: too many requests degrade attention
- **Expertise mismatch**: human lacks knowledge to evaluate action

## Notes

Human-in-the-loop is not a magic solution. Humans make mistakes too.

The goal is to insert judgment where judgment matters. Not to insert humans everywhere.

Design for the human. They are part of the system. Their cognitive limits are system constraints.

Consider async patterns. Not every decision needs to block.

Measure human decision quality. Track overrides, reversals, and regrets.
