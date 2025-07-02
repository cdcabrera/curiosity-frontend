---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.md"]
contexts: ["development", "bot-configuration", "automation", "workflow"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-07-02"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["workflows", "agent responses", "interactive patterns", "guidance review"]
  related_guidelines: ["guidelines/bot-config/workspace.md"]
  importance: "high"
  code_examples: true
---

# Bot Interaction Workflows

This document defines standard workflows for bot interactions within the project. These workflows establish consistent patterns for handling specific user requests and commands.

## Overview

Workflows consist of:
- **User Statements**: Variations of how users might initiate the workflow
- **Agent Actions**: The specific sequence of steps the agent should follow
- **Expected Responses**: The format and content of the agent's response

## Standard Workflows

### Repository Guidance Review

**User Statements:**
- "review repo guidelines"
- "review"
- "look at guidelines"
- "look at"
- "review guidance"

**Agent Actions:**
1. Reset any previously loaded guidance
2. Silently review repository-level guidance
3. IF, AND ONLY IF, there are optimization recommendations:
   - Update the ".agent" directory with a concise list of recommendations (limited to 3 ONLY)
   - Store in ".agent/recommendations.md" for potential recreation
4. Confirm the review has been completed

**Expected Response:**
- "Guidance reviewed. [N] recommendations added. Ready to work."
- Where [N] is the number of recommendations created (0-3)

**Example:**
```
User: "review repo guidelines"
Agent: "Guidance reviewed. 2 recommendations added. Ready to work."
```

## Adding New Workflows

When adding new workflows to this document, follow this structure:

```markdown
### [Workflow Name]

**User Statements:**
- "[statement variation 1]"
- "[statement variation 2]"

**Agent Actions:**
1. [First action step]
2. [Second action step]

**Expected Response:**
- "[Template for expected response]"

**Example:**
```
User: "[example user statement]"
Agent: "[example agent response]"
```
```

## Implementation Notes

- Workflow patterns should be consistent and predictable
- User statements should account for natural language variations
- Agent responses should be concise and informative
- Actions should be clearly defined and sequenced
- Examples should illustrate the complete interaction flow
