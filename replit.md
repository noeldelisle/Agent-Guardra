# Agent Guardrails Patterns

## Overview

A static, forkable reference repository documenting guardrail patterns for agentic AI systems. This is not an application—it is documentation, schemas, and example code intended for technical leaders, security teams, and AI operators.

## Repository Structure

```
/
├── README.md                 # Main documentation and usage guide
├── LICENSE                   # MIT License
├── patterns/                 # Control pattern documentation
│   ├── README.md            # Pattern index
│   ├── approval-gates.md    # Approval gate pattern
│   ├── tool-allowlists.md   # Tool allowlist pattern
│   ├── blast-radius.md      # Blast radius containment
│   ├── human-in-the-loop.md # Human checkpoint pattern
│   └── logging-and-audit.md # Logging and audit pattern
├── schemas/                  # JSON Schema definitions
│   ├── agent-risk.schema.json   # Agent risk classification schema
│   └── tool-policy.schema.json  # Tool policy schema
├── examples/                 # TypeScript examples
│   ├── simple-agent-guardrails.ts    # Basic guardrail implementation
│   ├── approval-gate-middleware.ts   # Approval gate middleware
│   └── logging-wrapper.ts            # Logging wrapper pattern
└── notes/                    # Design documentation
    ├── design-principles.md      # Core design principles
    └── common-failure-modes.md   # Common failure patterns
```

## Purpose

This repository provides:
- Guardrail patterns for constraining autonomous agents
- Design principles for limiting blast radius
- JSON schemas for policy and risk classification
- Lightweight TypeScript examples

## Usage

This is a reference repository. Fork it, adapt the patterns, and integrate them into your own architecture.

## Technical Notes

- No runtime dependencies required
- TypeScript examples are illustrative, not production-ready
- JSON schemas follow JSON Schema 2020-12 specification
- All documentation uses Markdown format

## Style Guide

Documentation follows these conventions:
- Direct, precise language
- No buzzwords or marketing language
- Short paragraphs, bullet-heavy format
- Declarative statements
- No compliance claims
