---
guideline_version: "1.0.0"
priority: 2
applies_to: ["*"]
contexts: ["development", "bot-configuration", "automation", "workflow"]
extends: ["../../GUIDELINES.md", "core-workflow.md"]
last_updated: "2025-07-02"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "after_core"
  validation_required: true
  key_concepts: ["workflow registry", "centralized management"]
  related_guidelines: ["guidelines/bot-config/workflows.md", "guidelines/bot-config/core-workflow.md"]
  importance: "high"
---

# Workflow Registry

This document serves as a centralized registry of all supported workflows in the system. When new workflows are added or existing ones are modified, this registry must be updated.

## Active Workflows

| Workflow ID | Display Name | Priority | Location | Last Updated |
|-------------|--------------|----------|----------|-------------|
| REPO_GUIDANCE_REVIEW | Repository Guidance Review | 1 | workflows.md | 2025-07-02 |
| PRODUCT_CONFIG | Product Configuration | 2 | workflows.md | 2025-07-02 |

## Workflow Format Specification

All workflows must include:

1. **User Statements**: Standardized trigger phrases
2. **Agent Actions**: Sequenced, numbered steps
3. **Expected Response**: Template with exact formatting requirements
4. **Examples**: At least one complete interaction example

## Workflow Integration Requirements

Any new workflow must:

1. Be registered in this document
2. Include proper trigger pattern definitions
3. Specify exact response templates
4. Define all required validation rules

## System Priority Rules

When multiple workflows match a user input:

1. Higher priority workflows take precedence
2. More specific matches override general matches
3. Exact matches override pattern matches
4. In case of conflicts, request clarification from user

## Validation Process

All workflows undergo validation:

1. Trigger patterns must be unique and not conflict with other workflows
2. Response templates must be clear and consistent
3. Actions must be deterministic and sequenced
4. Integration points must be well-defined

Workflows failing validation will be flagged for review and not activated until issues are resolved.
