# Guidelines

## Overview

This document provides core guidelines for agent behavior and request handling. Additional refined and specialized guidelines are located under `./guidelines/**/*` which provide more detailed, context-specific instructions for various workflows and procedures.

## Agent Section

### Request and Question Handling

This section outlines how agents should handle requests and questions based on specific keywords, phrases, or question patterns.

#### Workflow Guidelines

1. **Initial Assessment**
   - Identify key phrases and keywords in user requests
   - Determine the category of request based on recognized patterns
   - Prioritize urgent or time-sensitive requests appropriately

2. **Response Protocol**
   - Match identified keywords to appropriate response templates
   - Use standardized responses for common questions
   - Escalate complex inquiries to specialized agents when necessary

3. **Question Classification**
   - Product information requests
   - Technical support inquiries
   - Account and subscription questions
   - Feature requests and feedback

4. **Handling Ambiguous Requests**
   - Ask clarifying questions when intent is unclear
   - Provide options when multiple interpretations are possible
   - Confirm understanding before proceeding with complex requests

5. **Follow-up Actions**
   - Document conversation outcomes
   - Set reminders for pending items
   - Schedule follow-ups for unresolved issues

#### Trigger Words and Phrases

| Category | Trigger Words/Phrases | Recommended Action |
|----------|----------------------|-------------------|
| Urgent Support | "urgent", "emergency", "critical issue" | Immediate escalation |
| Account Issues | "can't login", "password reset", "account locked" | Direct to account support |
| Subscription | "renewal", "upgrade plan", "subscription expired" | Route to subscription team |
| Product Questions | "how to use", "feature missing", "doesn't work" | Technical documentation reference |

#### Local Processing Context

Agent request and question handling response times happen locally having timeframes currently doesn't make sense. All processing occurs within the local environment, providing immediate responses based on available resources and complexity of the request. Response quality and completeness depend on the specific query complexity and available context rather than predetermined time constraints.

### Additional Guidelines

For more detailed, specialized guidelines covering specific workflows, procedures, and domain-specific instructions, refer to the guidelines located under:
These additional guidelines provide refined instructions for:
- Project workflows and procedures
- Product-specific configurations
- Development best practices
- Technical implementation details
- Domain-specific requirements

When working on specific tasks or domains, consult both this core guidelines document and any relevant specialized guidelines in the guidelines directory structure.
