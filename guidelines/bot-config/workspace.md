---
guideline_version: "1.0.0"
priority: 11
applies_to: ["*"]
contexts: ["all", "development", "bot-configuration", "automation", "workflow"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-07-02"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "first"
  validation_required: true
  mandatory: true
  always_load: true
  key_concepts: ["workspace", "agent directory", "temporary files", "state persistence"]
  related_guidelines: ["guidelines/bot-config/inheritence.md"]
  importance: "critical"
  code_examples: true
---

# Workspace Configuration

## Overview

This document outlines the guidelines for managing agent workspace and temporary files within the project.

## Agent Workspace Directory

```
.agent/
└── logs/           # Agent execution logs
└── temp/           # Temporary files created during agent execution
└── state/          # Persistent state information
└── sessions/       # Saved session data for resuming work
```

## Guidelines for Agent Workspace

1. **Designated Directory**
   - All agent-related temporary files must be stored in the `./.agent` directory
   - This directory is already configured in `.gitignore` to avoid committing temporary files

2. **Agent Temporary Files**
   - Any file created by an AI agent during its operation must be stored in the `.agent/temp` directory
   - This includes intermediate processing files, generated code snippets, and temporary data transformations
   - Examples of agent-created temporary files include:
     - Code analysis results
     - Generated documentation drafts
     - Intermediate data processing outputs
     - Test data fixtures
     - Temporary configuration files
   - AI agents should never create temporary files outside the designated `.agent` directory
   - All agent-created temporary files should be cleaned up after the agent completes its task when possible
   - Use consistent naming patterns for temporary files: `{agent_id}_{purpose}_{timestamp}.{extension}`

3. **Logging**
   - Agents can log execution information in the `.agent/logs` directory
   - Agent-specific log files should follow a consistent naming convention: `{agent_name}_{timestamp}.log`
   - Log content should include:
     - Agent operation ID
     - Timestamp for each operation
     - Input parameters (excluding sensitive data)
     - Operation results or error messages
     - Performance metrics when relevant

4. **State Persistence**
   - Agents can store state information in the `.agent/state` directory
   - State files should be used to resume interrupted tasks or maintain context between runs
   - State files should be JSON formatted when possible for easier parsing

5. **Session Management**
   - For longer running tasks, agents can save session data in the `.agent/sessions` directory
   - Session files should contain enough information to fully restore the agent's context

## Security Considerations

1. **Sensitive Information**
   - Never store credentials, tokens, or other sensitive information in the agent workspace
   - If temporary credentials are needed, use environment variables instead

2. **Data Validation**
   - Always validate data read from workspace files before using it
   - Treat workspace files as untrusted input

## Best Practices

1. **File Organization**
   - Keep the workspace directory organized with appropriate subdirectories
   - Use descriptive filenames that include the agent name and purpose

2. **Resource Management**
   - Implement cleanup routines to remove unnecessary files
   - Monitor disk usage if generating large temporary files

3. **Error Handling**
   - Implement robust error handling when reading from or writing to workspace files
   - Gracefully handle missing or corrupt workspace files

4. **Versioning**
   - Include version information in state files to handle format changes
   - Implement migration logic if state file formats change
