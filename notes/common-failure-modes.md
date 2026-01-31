# Common Failure Modes

Recurring patterns of failure in agentic systems. Most are preventable.

---

## Over-Broad Permissions

**What happens**: Agent is granted more access than needed. When it misbehaves, the blast radius is larger than necessary.

**Why it happens**:
- Convenience during development
- Unclear requirements
- Copy-pasted configurations
- Fear of breaking functionality

**How to prevent**:
- Start with zero permissions
- Add permissions one at a time, with justification
- Review permissions regularly
- Audit actual usage against granted permissions

---

## Silent Tool Escalation

**What happens**: A tool gains new capabilities over time. The agent's effective permissions grow without policy updates.

**Why it happens**:
- Tools are updated independently of policies
- New features are added without security review
- Policy references tool by name, not by capability

**How to prevent**:
- Version tool policies alongside tool code
- Review tool changes for capability expansion
- Define policies in terms of actions, not just tool names
- Alert when tools are updated

---

## Missing Audit Trails

**What happens**: Something goes wrong, but no one can reconstruct what the agent did or why.

**Why it happens**:
- Logging was not implemented
- Logs were too sparse
- Logs were unstructured
- Logs were deleted

**How to prevent**:
- Log every action with context
- Use structured logging
- Retain logs according to policy
- Test log completeness regularly

---

## Human Override Ambiguity

**What happens**: A human intervenes, but it is unclear whether the intervention was authorized, what it permitted, or how long it lasts.

**Why it happens**:
- Override mechanisms are informal
- No logging of human decisions
- Scope of override is not defined
- Expiration is not enforced

**How to prevent**:
- Require explicit scope for every override
- Log all human decisions with rationale
- Enforce time limits on overrides
- Audit override usage

---

## Approval Fatigue

**What happens**: Too many approval requests degrade human attention. Approvers rubber-stamp without reviewing.

**Why it happens**:
- Every action requires approval
- Requests lack context
- No tiering by risk level
- Approval UI is inconvenient

**How to prevent**:
- Tier approvals by risk
- Auto-approve low-risk actions
- Provide sufficient context in requests
- Measure approval latency and rejection rates

---

## Cascading Agent Actions

**What happens**: One agent triggers another, which triggers another. A small mistake amplifies across the system.

**Why it happens**:
- Agents can spawn or invoke other agents
- No depth limits on chains
- No circuit breakers

**How to prevent**:
- Limit cascade depth
- Require approval for agent-to-agent invocation
- Implement circuit breakers
- Monitor chain length

---

## Stale Context

**What happens**: Agent acts on outdated information. The action was correct when planned but wrong when executed.

**Why it happens**:
- Delay between planning and execution
- No freshness checks
- External state changed

**How to prevent**:
- Validate preconditions before execution
- Shorten planning-execution gap
- Fail if context is stale

---

## Implicit Trust in Model Output

**What happens**: System treats model output as authoritative. Hallucinations or errors propagate into actions.

**Why it happens**:
- Model confidence is mistaken for correctness
- No validation layer
- Outputs are passed directly to tools

**How to prevent**:
- Validate model outputs against schema
- Check outputs for plausibility
- Insert human review for high-stakes actions
- Treat model output as untrusted input

---

## Insufficient Testing of Guardrails

**What happens**: Guardrails exist on paper but fail when triggered.

**Why it happens**:
- Guardrails were implemented but not tested
- Edge cases were not considered
- Guardrails were disabled for testing and not re-enabled

**How to prevent**:
- Test guardrails explicitly
- Include adversarial test cases
- Verify guardrails in production configuration
- Monitor guardrail activation rates
