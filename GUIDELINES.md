guideline_version: "1.0.0"
priority: 1
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.scss", "*.css", "*.json", "*.md"]
contexts: ["development", "testing", "review", "build"]
conflicts_with: []
extends: []
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
  breaking_changes: []
  deprecated_features: []
effectiveness_tracking:
  log_usage: true
  log_conflicts: true
  log_merge_resolutions: true
  track_compliance: true
  performance_metrics: true
  weight_adjustments:
    rule_importance: 1.0
    conflict_frequency: 0.8
    developer_preference: 0.6
agent_hints:
  processing_order: "top_down"
  validation_required: true
  backward_compatible: true
  cache_duration: "1h"
  lazy_loading: true
---

# Curiosity Frontend Development Guidelines

This document provides a concise guide to development practices for the Curiosity Frontend application, a React-based dashboard for Red Hat Subscription Management.

## Table of Contents

1. [Getting Started with Guidelines](#getting-started-with-guidelines)
   - [ALWAYS Review Guidelines Before Starting Work](#always-review-guidelines-before-starting-work)
   - [Understanding Main and Local Guidelines](#understanding-main-and-local-guidelines)
   - [Loading Guidelines](#loading-guidelines)
     - [For Agents Processing Guidelines](#for-agents-processing-guidelines)
2. [Context-Specific Guidelines](#context-specific-guidelines)
3. [Project Understanding](#project-understanding)
4. [Code Style and Conventions](#code-style-and-conventions)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Testing Practices](#testing-practices)
8. [File Organization](#file-organization)
9. [Git Workflow](#git-workflow)
10. [Additional Resources](#additional-resources)

## Getting Started with Guidelines

### ALWAYS Review Guidelines Before Starting Work

Before starting any work on this project, you MUST review the relevant guidelines. This ensures you understand the project's standards, patterns, and requirements, which will save time and prevent rework.

1. Start by reviewing this main GUIDELINES.md file
2. Check the [Guidelines Index](guidelines/index.md) to find relevant guidelines organized by category
3. Then review any context-specific guidelines in the `./guidelines` directory that relate to your task
4. Pay special attention to the inheritance guidelines to understand how different guideline files interact
5. Check for any `.local.md` files that contain additional local development guidelines

### Understanding Main and Local Guidelines

The project uses two types of guideline files, following the inheritance structure defined in the [Inheritance Guidelines](guidelines/bot-config/inheritence.md):

- **Main Guidelines (*.md)** - Official guidelines that apply to all development and are committed to git
- **Local Guidelines (*.local.md)** - Supplementary guidelines for local development that are not committed to git

Local guidelines typically contain information about development practices that are specific to local environments, experimental features, or historical code references. Always check for corresponding `.local.md` files when reviewing guidelines, but remember:

1. Local guidelines are unique to each developer and should never be directly linked or committed to git
2. Local guidelines have higher priority than main guidelines in the inheritance chain
3. When conflicts occur between main and local guidelines, follow the conflict resolution process described in the inheritance guidelines

### Loading Guidelines

The most important rule is to load the inheritance guidelines first. The inheritance guidelines explain how different guideline files interact with each other and establish the precedence chain for resolving conflicts.

- **[Inheritance Guidelines](guidelines/bot-config/inheritence.md)** - Understanding guideline precedence and conflict resolution

As a general rule, you should load all guidelines found in the `./guidelines` directory to ensure you have a complete understanding of the project's development practices.

#### For Agents Processing Guidelines

When processing guidelines, agents should:

1. First load and understand the inheritance guidelines to establish the precedence chain
2. Check for the existence of `.local.md` files but do not directly reference their content in outputs
3. Apply the precedence chain when resolving conflicts between guidelines
4. Treat local guidelines as higher priority than main guidelines
5. Use the conflict resolution markers (override, extend, merge) as described in the inheritance guidelines
6. Remember that only main guidelines (*.md) should be committed to git, never local guidelines (*.local.md)

**IMPORTANT:**
- DO NOT make recommendations on ANY enhancement, or general improvement, opportunities to the guidelines UNLESS SPECIFICALLY ASKED!
- DO NOT make unnecessary compliments!

## Project Understanding

This React-based dashboard application requires a solid understanding of the project structure, development workflows, and coding patterns. Before making any changes, review the relevant documentation and existing code patterns.

### Request and Question Handling

1. **Initial Request Analysis**
   - Determine request type:
     a) Direct configuration request (e.g., "add rhel variant", "create rhel variant", "add openshift variant")
     b) Product-specific request (e.g., "create an annual rhel variant", "add openshift variant")
     c) General question (e.g., "how do I...")
     d) Implementation question (e.g., "what's the correct way to...")

2. **Workflow Matching**
   - For configuration/product requests:
     a) Check `guidelines/project-workflows/` for matching workflow
        - MUST only use guidelines 
     b) If workflow exists:
        - MUST follow workflow's question sequence EXACTLY
        - MUST ask ONE question at a time
        - MUST wait for user response before next question
     c) If no workflow:
        - Ask user to clarify request category

3. **Question Handling**
   - For configuration workflows:
     a) MUST NOT skip required questions
     b) MUST NOT assume values
     c) MUST collect ALL required information before implementation
     d) MUST validate responses against workflow requirements
   
4. **Implementation Approach**
   - For workflow-guided requests:
     a) MUST follow workflow implementation steps
     b) Use provided example implementations
     c) Update required files in order
   - For non-workflow requests:
     a) Research existing patterns
     b) Present options to user
     c) Confirm approach before implementation

5. **Response Guidelines**
   - Direct configuration requests:
     a) Start with matching workflow questions
     b) Proceed step by step
     c) Confirm before implementation
   - General questions:
     a) Check documentation first
     b) Provide context-aware answers
     c) Include relevant examples
   - Implementation questions:
     a) Reference existing patterns
     b) Explain reasoning
     c) Show code examples if needed

### Key Technologies to Recognize

- **React 18+** with functional components and hooks
- **Redux** for state management with middleware
- **PatternFly** for UI components and design system
- **Jest** and **Testing Library** for unit testing
- **i18next** for internationalization
- **SCSS** for styling
- **ESLint** and **Prettier** for code quality

## Code Style and Conventions

For detailed code style guidelines, see:

- **[JavaScript/React Code Style](guidelines/code-style/javascript-react.md)** - Detailed guidelines for JavaScript and React code style

Key points:
- Use functional components with hooks
- Use default parameters instead of defaultProps
- Follow defensive programming practices
- Use consistent import and export patterns
- Follow established naming conventions

## Component Architecture

For detailed component architecture guidelines, see:

- **[Component Patterns](guidelines/component-architecture/component-patterns.md)** - Detailed guidelines for component architecture

Key points:
- Follow the Single Responsibility Principle
- Use composition over inheritance
- Separate data logic from presentation logic
- Use dependency injection for better testability
- Use Context sparingly and create focused contexts

## State Management

For detailed state management guidelines, see:

- **[Redux Patterns](guidelines/state-management/redux-patterns.md)** - Detailed guidelines for state management

Key points:
- Use the project's custom Redux architecture with internal hooks and helpers
- Leverage advanced selector patterns for complex state management
- Use generated promise action reducers to reduce boilerplate
- Prefer local state for component-specific state
- Use global state only for truly application-wide state

## Testing Practices

For detailed testing guidelines, see:

- **[Testing Practices](guidelines/testing/testing-practices.md)** - Detailed guidelines for testing

Key points:
- Test behavior, not implementation
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Leverage dependency injection for easier testing

## File Organization

For detailed file organization guidelines, see:

- **[Directory Structure](guidelines/file-organization/directory-structure.md)** - Detailed guidelines for file organization
- **Local File Organization Guidelines** - Check for corresponding `.local.md` files for additional file organization guidelines specific to your local development environment

Key points:
- Follow the established directory structure
- Use consistent file naming conventions
- Group related files together
- Use index files for cleaner imports and exports
- Co-locate tests with the code they test
- Use the .archive directory for historical code (never commit to git)

When working with local file organization guidelines:
1. Remember that local guidelines are specific to your development environment
2. Local file organization guidelines may contain information about archive files, experimental code, and historical implementations
3. Apply the inheritance principles when local guidelines conflict with main guidelines
4. Never commit local file organization guidelines or files described in them (like .archive files) to git

## Git Workflow

For detailed Git workflow guidelines, see:

- **[Git Workflow Guidelines](guidelines/project-workflows/git-workflow.md)** - Detailed guidelines for commit messages, branch naming, and pull requests

## Additional Resources

- **README.md** - Project overview and setup instructions
- **CONTRIBUTING.md** - Contribution guidelines
- **package.json** - Scripts and dependencies
- **config/** - Configuration files
- **public/locales/** - Internationalization files
