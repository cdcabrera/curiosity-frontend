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

### OpenShift Product Configuration

**User Statements:**
- "openshift-[product-name]"
- "configure new openshift product [product-name]"
- "add new openshift product [product-name]"
- "create openshift [product-name] configuration"

**Agent Actions:**
1. MUST ask ALL of the following questions BEFORE proceeding with any implementation:
   - What is the product long/full name? (e.g., "OpenShift Container Platform", "OpenShift Dedicated")
   - What is the product short name? (e.g., "OpenShift Container", "OpenShift Dedicated")
   - What is the product group? MUST explain that for OpenShift products, the default is "openshift"
   - What aliases should be used for product discovery? 
   - Any specific chart metrics or display settings needed?
2. ONLY after gathering ALL required information, proceed with implementation
3. Create configuration file following the product configuration pattern

**Expected Response:**
- Series of information-gathering questions, each with examples
- Confirmation of gathered information before proceeding

**Examples of Product Groups:**
- `openshift` - Used for OpenShift Container, OpenShift Dedicated, OpenShift Metrics
- `rhel` - Used for RHEL and RHEL variants
- `ansible` - Used for Ansible Automation Platform

**Example Interaction:**
```
User: "openshift-awesome-platform"
Agent: "What is the product long, or full, name? For example: 'OpenShift Container Platform', 'OpenShift Dedicated'."
User: "OpenShift Awesome Platform"
Agent: "What is the product short name? For example: 'OpenShift Container', 'OpenShift Dedicated'."
User: "OpenShift Awesome"
Agent: "What is the product group that OpenShift Awesome should belong to? For OpenShift products, the default is 'openshift'."
User: "openshift"
Agent: "What aliases should be used for product discovery? These are alternative names users might search for."
User: "awesome, platform, openshift-awesome"
Agent: "Any specific chart metrics or display settings needed?"
User: "No, use default settings"
Agent: "Thank you. I'll now create the configuration for OpenShift Awesome Platform with the following details:\n- Full name: OpenShift Awesome Platform\n- Short name: OpenShift Awesome\n- Product group: openshift\n- Aliases: awesome, platform, openshift-awesome\n- Default chart metrics and display settings\n\nProceeding with implementation..."
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
