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
  key_concepts: ["inheritance", "precedence chain", "merge resolution", "conflict detection", "guideline structure"]
  related_guidelines: ["guidelines/index.md"]
  importance: "critical"
  code_examples: true
---

# Guideline File Inheritance and External References

This project supports multiple layers of guideline inheritance to accommodate different development environments and organizational standards.

## Guideline guidance
1. ONLY **Base Guidelines** (`GUIDELINES.md`) should be git committed. All other guidelines should be gitignored
2. **Local Guidelines** (`GUIDELINES.local.md`) may, or may not exist. It is not a required file.

## Precedence Chain
Guidelines are merged with the following precedence (highest to lowest):

1. **Bot Configuration Guidelines** (`guidelines/bot-config/*.md`) - Priority 11 (Always Active)
2. **Agent Specific Guidelines** - Priority 10
3. **Local Guidelines** (`GUIDELINES.local.md`) - Priority 5
4. **Local Directory Guidelines** (`./guidelines/*.local.md`) - Priority 4
5. **Directory Guidelines** (`./guidelines/*.md`) - Priority 3
6. **Base Guidelines** (`GUIDELINES.md`) - Priority 1

### Examples
**Guideline file structure example:**
```
Project
├── GUIDELINES.md
├── GUIDELINES.local.md
├── guidelines/
│   ├── `*.local.md`
│   └── Specific Guidelines
└── Agent Specific Guidelines
```

**Guideline inheritance and priority structure example:**

```
Project
└── GUIDELINES.md
    └── guidelines/Specific Guidelines
        └── GUIDELINES.local.md or Local Guidelines
            └── Agent Specific Guidelines
```

**Internal guideline inheritance and priority structure markdown example:**
```
GUIDELINES
    └── Guideline Heading
        ├── Link to external GUIDELINES.md
        └── *.local.md
            ├── Link to external GUIDELINES.md
            │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
            │   └── If guideline exists in parent priority order then append it to existing guidelines
            ├── Guideline Heading
            │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
            │   └── If guideline exists in parent priority order then append it to existing guidelines
            ├── Guideline Heading - Override
            │   └── "Override" keyword indicates guideline removes the conflicting guideline. It may provide opposing, or counter, guidenance
            └── Agent Specific Guidelines
                ├── Link to external GUIDELINES.md
                │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
                │   └── If guideline exists in parent priority order then append it to existing guidelines
                ├── Guideline Heading
                │   ├── If guideline indicates opposing, or counter, guidenance this guideline takes priority
                │   └── If guideline exists in parent priority order then append it to existing guidelines
                └── Guideline Heading - Override
                    └── "Override" keyword indicates guideline removes the conflicting guideline. It may provide opposing, or counter, guidenance
```

### Merge Resolution and Conflict Detection

#### Merge Resolution Markers

The following markers can be used in higher-priority guideline files to explicitly control how conflicting guidelines are resolved:

##### Override Example (Replaces conflicting guideline)
```override:react-component-structure
/**
 * Component Structure - Override
 * This completely replaces any base guidelines for React component structure
 */
const MyComponent = ({ prop1, prop2 = defaultValue }) => {
  // TypeScript-style component with explicit interfaces
  // This overrides the JSDoc approach in base guidelines
  return <div>{/* Component JSX */}</div>;
};
```

##### Extend Example (Adds to existing guideline)
```extend:import-patterns
/**
 * Import Organization - Extension
 * This adds to existing import organization rules from base guidelines
 */
// Additional rule: Always separate React imports from other libraries
import React, { useState, useEffect } from 'react';

import { Button } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons';
import _cloneDeep from 'lodash/cloneDeep';
```

##### Merge Example (Combines with existing guideline)
```merge:testing-practices
/**
 * Testing Practices - Merge
 * This merges with existing testing practices from base guidelines
 */
// Additional testing requirements beyond base guidelines:
// - Add performance testing for components with >100 props
// - Include accessibility testing for all interactive components
// - Test React Suspense boundaries where applicable
describe('MyComponent Performance', () => {
  it('should render within 16ms for 60fps', () => {
    // Performance test implementation
  });
});
```

#### Conflict Detection Annotations

##### Common Conflicts and Resolutions

**CONFLICT: Component Prop Documentation**
- Base Guidelines: Use JSDoc comments for prop documentation
- Local Guidelines: Use TypeScript interfaces for props
- Resolution: Higher priority guideline takes precedence
- Annotation: `<!-- CONFLICT_RESOLVED: prop-documentation -->`

**CONFLICT: Import Organization**
- Base Guidelines: Three-tier import organization (external, internal, relative)
- Local Guidelines: Four-tier with React separated
- Resolution: Merge both approaches - use four-tier when React is present
- Annotation: `<!-- CONFLICT_MERGED: import-organization -->`

**CONFLICT: Testing Strategy**
- Base Guidelines: Standard Jest + Testing Library
- Agent Guidelines: Add performance and accessibility tests
- Resolution: Extend base strategy with additional requirements
- Annotation: `<!-- CONFLICT_EXTENDED: testing-strategy -->`

### Backward Compatibility Notes

For agents that don't understand merge resolution markers:
1. All existing guidelines remain valid and functional
2. New markers appear as code blocks and can be ignored
3. Conflict annotations appear as HTML comments and don't affect functionality
4. Traditional inheritance still works: higher priority files override lower priority

### Agent Processing Instructions

1. **Load bot-config guidelines** - Always load these guidelines first regardless of context
2. **Parse YAML frontmatter** to determine file priority and context
3. **Look for merge markers** (`override:`, `extend:`, `merge:`) in higher-priority files
4. **Check conflict annotations** to understand resolution strategies
5. **Apply merge strategy**:
- `override`: Replace lower-priority guideline completely
- `extend`: Add to existing guideline while preserving original
- `merge`: Combine guidelines using logical union
6. **Fallback behavior**: If no markers present, use traditional "higher priority wins" approach
7. **Update last_updated field**: When modifying a guideline file, always update the `last_updated` field in the YAML frontmatter to the current local system date in the format "YYYY-MM-DD". Use the terminal command `$ date` to get the current date. If the terminal command for date is unavailable, fall back to agent defaults.

### Mandatory Bot Configuration Loading

Bot configuration guidelines must **always be processed first** regardless of the specific context or file patterns being reviewed. This ensures core initialization patterns are available in all scenarios.

#### Context-Independent Loading

```yaml
# Bot configuration should always be loaded
mandatory_guidelines:
  - "guidelines/bot-config/*.md"

# These are loaded regardless of file patterns or contexts
always_active:
  - "guidelines/bot-config/core-workflow.md"
  - "guidelines/bot-config/workspace.md"
  - "guidelines/bot-config/workflows.md"
  - "guidelines/bot-config/inheritence.md"
```

## Advanced Agent Processing Specification

### Context-Aware Guideline Activation

Agents should activate context-specific guidelines based on multiple factors:

#### File Pattern Activation
```yaml
# Example: Activate testing guidelines for test files
file_patterns:
  "*.test.js": ["guidelines/testing.md"]
  "*.test.jsx": ["guidelines/testing.md"] 
  "*.test.ts": ["guidelines/testing.md"]
  "deploy/*": ["guidelines/build.md", "guidelines/deployment.md"]
  "package.json": ["guidelines/build.md"]
```

#### Development Phase Activation
```yaml
# Example: Activate phase-specific guidelines
development_phases:
  development: ["guidelines/development.md"]
  testing: ["guidelines/testing.md", "guidelines/development.md"]
  build: ["guidelines/build.md"]
  deployment: ["guidelines/deployment.md", "guidelines/build.md"]
```

#### Context Priority Processing
When multiple contexts apply, use this priority order:
1. **Bot Configuration Guidelines** (Priority 11)
2. **Agent Specific Guidelines** (Priority 10)
3. **Local Guidelines** (`GUIDELINES.local.md`) (Priority 5)
4. **Context Guidelines** (`guidelines/*.md`) (Priority 3)
5. **Base Guidelines** (`GUIDELINES.md`) (Priority 1)

#### Activation Guarantees

To ensure proper initialization, agents MUST implement these activation guarantees:

1. **Always Load Bot Configuration**
   - Bot configuration guidelines (`guidelines/bot-config/*.md`) must be loaded for EVERY request
   - These guidelines are active regardless of file context or patterns
   - No user setting should be able to disable core bot-config loading

2. **Core Workflow Bootstrapping**
   - Core workflow guidelines initialize the agent's processing capabilities
   - They must be loaded before any other guideline processing begins
   - The agent should verify core guidelines are loaded before proceeding

3. **Fallback Mechanisms**
   - If a specific bot-config guideline cannot be loaded, log a warning
   - Attempt to load an alternative version from the same directory
   - If all bot-config guidelines fail, use base GUIDELINES.md as fallback

#### Embedded Fallback System

To prevent initialization failures, agents must implement an embedded fallback system:

```javascript
// Embedded fallback system
const embeddedBotConfigGuidelines = {
  'activation': {
    priority: 11,
    applies_to: ['*'],
    contexts: ['all'],
    agent_hints: {
      mandatory: true,
      always_load: true
    }
  },
  'inheritence': {
    priority: 11,
    applies_to: ['*'],
    contexts: ['all'],
    agent_hints: {
      mandatory: true,
      always_load: true
    }
  },
  'core-workflow': {
    priority: 11,
    applies_to: ['*'],
    contexts: ['all'],
    agent_hints: {
      mandatory: true,
      always_load: true
    }
  }
};

function activateFallbackGuidelines() {
  // When external guidelines fail, use embedded fallbacks
  Object.entries(embeddedBotConfigGuidelines).forEach(([name, config]) => {
    registerGuideline(`bot-config/${name}`, config);
  });

  logWarning('Using embedded fallback guidelines for bot-config');
}
```

This fallback system ensures that even if the external guideline files are missing or inaccessible, the agent will still have the critical configuration needed to function properly.


### Validation Examples

#### Valid Guideline Structure
```yaml
---
guideline_version: "1.0.0"    # ✅ Required: Version for compatibility
priority: 3                   # ✅ Required: Integer 1-10
applies_to: ["*.js"]          # ✅ Required: Array of file patterns
contexts: ["development"]     # ✅ Required: Array of contexts
extends: ["../GUIDELINES.md"] # ✅ Optional: Parent guidelines
agent_hints:                  # ✅ Optional: Agent processing hints
  validation_required: true
---
```

#### Invalid Guideline Structure
```yaml
---
priority: "high"              # ❌ Invalid: Must be integer 1-10
applies_to: "*.js"            # ❌ Invalid: Must be array
contexts: development         # ❌ Invalid: Must be array
extends: "../GUIDELINES.md"   # ❌ Invalid: Must be array
agent_hints: "strict"         # ❌ Invalid: Must be object
---
```

#### Valid Merge Markers
```javascript
// ✅ Valid: Specific marker with context
```override:react-component-structure
// Component implementation
```

// ✅ Valid: Extension marker with clear purpose
```extend:import-patterns
// Additional import rules
```

// ❌ Invalid: Generic marker without context
```override:component
// Unclear what is being overridden
```
```

#### Valid Conflict Annotations
```html
<!-- ✅ Valid: Specific conflict with resolution -->
<!-- CONFLICT_RESOLVED: prop-documentation -->

<!-- ✅ Valid: Multiple contexts -->
<!-- CONTEXT_ACTIVE: testing,development -->

<!-- ❌ Invalid: Generic annotation -->
<!-- CONFLICT: something -->
```
