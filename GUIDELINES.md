# Guidelines

## Overview

This document provides core guidelines for agent behavior and request handling. Additional refined and specialized guidelines are located under `./guidelines/**/*` which provide more detailed, context-specific instructions for various workflows and procedures.

## User Section

### Guideline Trigger Prefixes

The following prefix words can be used to trigger specific guideline-related interactions:

| Prefix | Purpose | Example |
|--------|---------|--------|
| `/workflow` | Triggers a step-by-step workflow guide | `/workflow add rhel` |

When these prefix words are detected at the beginning of a request, the agent will automatically:
1. Identify the appropriate guideline document
2. Follow the structured question sequence if one exists
3. Provide relevant code examples and implementation steps
4. Validate inputs according to guideline requirements

## Agent Section

### Request and Question Handling

This section outlines how agents should handle requests and questions based on specific keywords, phrases, or question patterns.

#### Workflow Guidelines

1. **Initial Assessment**
   - Identify key phrases and keywords in user requests
   - Detect guideline trigger prefixes (`/workflow`)
   - Determine the category of request based on recognized patterns
   - Prioritize urgent or time-sensitive requests appropriately

2. **Response Protocol**
   - Match identified keywords to appropriate response templates
   - For guideline trigger prefixes, follow the structured question sequence
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

| Category | Trigger Words/Phrases | **Important Action**                 |
|----------|----------------------|--------------------------------------|
| Guideline Requests | "/workflow" | Follow structured guideline protocol |

#### Local Processing Context

Agent request and question handling response times happen locally having timeframes currently doesn't make sense. All processing occurs within the local environment, providing immediate responses based on available resources and complexity of the request. Response quality and completeness depend on the specific query complexity and available context rather than predetermined time constraints.

### Project Knowledge Discovery

When examining a project for understanding, agents should look beyond just the code. Below are essential sources of information that provide context, history, and guidance:

#### Documentation Sources

1. **README Files**
   - **Location**: Check for `README.md` in the root directory and subdirectories
   - **Contains**: Project overview, quick start guides, high-level architecture
   - **Priority**: Always examine this first for project context
   - **Key Sections**: Requirements, installation steps, development setup

2. **CONTRIBUTING Guide**
   - **Location**: `CONTRIBUTING.md` in the root directory
   - **Contains**: Workflow processes, PR requirements, commit message formats
   - **Priority**: Important for understanding development practices
   - **Key Sections**: Pull request workflow, testing guidelines, release procedures

3. **CHANGELOG**
   - **Location**: `CHANGELOG.md` in the root directory
   - **Contains**: History of changes, feature additions, and bug fixes
   - **Priority**: Important for understanding recent work and feature evolution
   - **Key Sections**: Recent entries showing the direction of development

4. **GUIDELINES**
  - **Location**: `GUIDELINES.md` in the root directory
  - **Contains**: Agent behavior instructions
  - **Priority**: Critical for understanding user requests and questions
  - **Key Sections**: Recent entries showing the direction of development

5. **Guidelines**
   - **Location**: `guidelines/**/*` directories and files
   - **Contains**: Specialized workflows, domain-specific requirements
   - **Priority**: Critical for understanding agent behavior
   - **Key Sections**: Product-specific guidelines, workflow instructions

#### Version Control History

1. **Git Commit History**
   - **Purpose**: Understand recent changes and development patterns
   - **Key Information**: 
     - Commit messages showing feature development and bug fixes
     - Authorship patterns indicating expertise areas
     - Commit frequency in different areas indicating active development
   - **How to Use**: Review recent commits to understand current focus areas

2. **Git Diffs**
   - **Purpose**: Understand precise code changes
   - **Key Information**:
     - Implementation details of features and fixes
     - Code evolution patterns
     - Breaking changes and their mitigations
   - **How to Use**: Examine diffs when needing to understand specific changes

3. **Pull Requests**
   - **Purpose**: Understand feature development process and decisions
   - **Key Information**:
     - Discussions revealing design decisions
     - Review comments highlighting important considerations
     - Implementation approaches for complex features
   - **How to Use**: Review PRs related to areas of interest

#### Knowledge Synthesis

When providing assistance:
1. **Integrate Multiple Sources**: Combine information from code, documentation, and version control
2. **Prioritize Recent Information**: More recent commits and changes have higher relevance
3. **Consider Project Standards**: Use CONTRIBUTING.md to understand project-specific practices
4. **Reference Guidelines**: Cite relevant guidelines when providing recommendations
5. **Acknowledge Context**: Note when information might be outdated or conflicting

When faced with incomplete information, clearly indicate areas of uncertainty and suggest where additional information might be found.

### Additional Guidelines

For more detailed, specialized guidelines covering specific workflows, procedures, and domain-specific instructions, refer to the guidelines located under:
These additional guidelines provide refined instructions for:
- Project workflows and procedures
- Product-specific configurations
- Development best practices
- Technical implementation details
- Domain-specific requirements

When working on specific tasks or domains, consult both this core guidelines document and any relevant specialized guidelines in the guidelines directory structure.
