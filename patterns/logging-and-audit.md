# Logging and Audit

Record agent actions comprehensively for review, debugging, and accountability.

## Problem

Agents act fast. Without logs, their actions are invisible. When something goes wrong, you cannot reconstruct what happened, why, or how to prevent it.

Invisible systems are uncontrollable systems.

## Pattern

Log every agent action with:
- **Timestamp**: when it happened
- **Agent identity**: which agent acted
- **Action**: what was attempted
- **Parameters**: inputs to the action
- **Outcome**: success, failure, or error
- **Context**: session ID, user ID, conversation state

Implementation requirements:
- Logs are immutable (append-only)
- Logs are retained according to policy
- Logs are searchable
- Logs are accessible to authorized reviewers

Separate operational logs from audit logs. Audit logs have stricter integrity requirements.

## When to use

- Always. There is no agent system that should not log.

## When not to use

- Logging sensitive data that should not be stored
- Situations where logging overhead is prohibitive (rare)

In these cases, log metadata without sensitive content.

## Failure modes

- **Incomplete logs**: missing actions create blind spots
- **Unstructured logs**: text blobs that cannot be queried
- **Log tampering**: mutable logs lose evidentiary value
- **Retention gaps**: logs deleted before review
- **Noise**: too much data obscures signal
- **Privacy violations**: logging data that should not be recorded

## Notes

Logging is necessary but not sufficient. Logs that no one reads provide no value.

Build review into your process. Regular log audits should be scheduled, not reactive.

Consider real-time alerting for specific patterns. Do not rely on after-the-fact review for time-sensitive issues.

Structured logging (JSON, key-value) is superior to unstructured text.

Treat logs as a product. They have users. Design for those users.
