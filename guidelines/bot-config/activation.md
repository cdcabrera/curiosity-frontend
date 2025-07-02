---
guideline_version: "1.0.0"
priority: 11
applies_to: ["*"]
contexts: ["all", "development", "review", "documentation", "bot-config", "guidelines"]
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
  key_concepts: ["activation", "initialization", "core-workflow", "bootstrap"]
  related_guidelines: ["guidelines/bot-config/inheritence.md"]
  importance: "critical"
  code_examples: true
---

# Guideline Activation Rules

This document defines the rules for activating guidelines in the system, with special focus on ensuring core bot configuration guidelines are always loaded.

## Core Activation Principles

1. **Bot Configuration Priority**
   - Bot configuration guidelines (in `guidelines/bot-config/*`) MUST be loaded first
   - They have priority 11, higher than any other guideline type
   - These guidelines initialize the agent's processing capabilities

2. **Universal Application**
   - Bot configuration guidelines apply to ALL file types (`*`)
   - They are active in ALL contexts
   - No file pattern or context restriction should prevent their loading

3. **Initialization Sequence**
   - The agent MUST load bot configuration guidelines in this order:
     1. `guidelines/bot-config/activation.md` (this file)
     2. `guidelines/bot-config/inheritence.md`
     3. `guidelines/bot-config/core-workflow.md`
     4. Other bot-config guidelines

## Agent Startup Process

```javascript
// Pseudo-code for agent initialization
function initializeAgent() {
  // 1. Load core activation guidelines first
  const coreGuidelines = loadGuidelines('guidelines/bot-config/*.md');

  // 2. Verify critical guidelines are loaded
  if (!areCriticalGuidelinesLoaded(coreGuidelines)) {
    logWarning('Missing critical guidelines, using fallback initialization');
    loadFallbackGuidelines();
  }

  // 3. Process remaining guidelines according to precedence chain
  const remainingGuidelines = loadGuidelines('**/*.md', { excludeAlreadyLoaded: true });
  const sortedGuidelines = sortByPrecedence(remainingGuidelines);

  // 4. Apply merge resolution for any conflicts
  const mergedGuidelines = applyMergeResolution(sortedGuidelines);

  // 5. Initialize agent with processed guidelines
  return configureAgent(mergedGuidelines);
}
```

## Startup Validation

```javascript
// Validate bot-config guidelines are loaded
function validateBotConfigGuidelines() {
  // Critical files that must be loaded at startup
  const criticalFiles = [
    'guidelines/bot-config/activation.md',
    'guidelines/bot-config/inheritence.md',
    'guidelines/bot-config/core-workflow.md',
    'guidelines/bot-config/workflows.md',
    'guidelines/bot-config/workspace.md',
    'guidelines/bot-config/workflow-registry.md'
  ];

  // Check if all critical files are loaded
  const missingFiles = criticalFiles.filter(file => !isGuidelineLoaded(file));

  if (missingFiles.length > 0) {
    // Log warning about missing files
    logWarning(`Missing critical bot-config guidelines: ${missingFiles.join(', ')}`);

    // Attempt recovery by loading embedded fallback guidelines
    activateFallbackGuidelines();

    // Return false to indicate validation failure
    return false;
  }

  // All critical files are loaded
  return true;
}

// Always run this validation before processing any user request
validateBotConfigGuidelines();
```

This validation must be performed at the start of each session and whenever context changes to ensure bot-config guidelines are always active regardless of the current file being processed.

## Activation Guarantees

1. **Mandatory Guidelines**
   - These guidelines MUST always be loaded:
     ```yaml
     mandatory_guidelines:
       - "guidelines/bot-config/activation.md"
       - "guidelines/bot-config/inheritence.md"
       - "guidelines/bot-config/core-workflow.md"
       - "guidelines/bot-config/workflows.md"
     ```

2. **Guideline Availability Check**
   - Before processing any request, verify availability of mandatory guidelines
   - If any are missing, use embedded fallback behaviors

3. **Context Override**
   - Bot configuration guidelines override all context-specific restrictions
   - They remain active regardless of the file being processed

## Troubleshooting

If initialization fails:

1. Check the availability of bot-config files in the repository
2. Verify that the agent has proper permissions to access these files
3. Ensure the agent implementation respects the priority 11 and `always_load: true` flags
4. Check for any custom configurations that might override the mandatory loading behavior
5. Consult the fallback guidelines in base GUIDELINES.md for minimal functionality

## Implementation Flags

The following YAML frontmatter flags MUST be recognized and honored by all agents:

```yaml
priority: 11              # Highest possible priority
applies_to: ["*"]        # Applies to all file types
contexts: ["all"]        # Active in all contexts
agent_hints:
  mandatory: true         # Must be loaded
  always_load: true       # Load for every request
  processing_order: "first" # Process before other guidelines
```

Any agent implementation that does not respect these flags is considered non-compliant with the guideline system.
