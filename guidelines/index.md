---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.md"]
contexts: ["development", "review", "documentation", "guidelines"]
extends: ["../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["guidelines", "index", "inheritance", "precedence chain"]
  related_guidelines: ["guidelines/bot-config/inheritence.md"]
  importance: "high"
  code_examples: false
---

# Curiosity Frontend Guidelines Index

This document serves as an index for all guidelines in the Curiosity Frontend project. Guidelines are organized by category and follow the inheritance structure defined in [Guideline File Inheritance and External References](bot-config/inheritence.md).

## Guideline Precedence Chain

Guidelines are merged with the following precedence (highest to lowest):

1. **Agent Specific Guidelines** - Priority 10
2. **Local Guidelines** (`GUIDELINES.local.md`) - Priority 5
3. **Local Directory Guidelines** (`./guidelines/*.local.md`) - Priority 4
4. **Directory Guidelines** (`./guidelines/*.md`) - Priority 3
5. **Base Guidelines** (`GUIDELINES.md`) - Priority 1

For more details on guideline inheritance and conflict resolution, see [Guideline File Inheritance and External References](bot-config/inheritence.md).

## Main Guidelines

- [**GUIDELINES.md**](../GUIDELINES.md) - Main guidelines document providing a concise guide to development practices for the Curiosity Frontend application.

## Bot Configuration

- [**Guideline File Inheritance and External References**](bot-config/inheritence.md) - Explains how different guideline files interact with each other and establishes the precedence chain for resolving conflicts.
- [**Workspace Configuration**](bot-config/workspace.md) - Guidelines for managing agent workspace and temporary files within the project.

## Code Style

- [**JavaScript/React Code Style Guidelines**](code-style/javascript-react.md) - Detailed guidelines for JavaScript and React code style, including functional components, import/export patterns, naming conventions, and more.

## Component Architecture

- [**Component Architecture Patterns**](component-architecture/component-patterns.md) - Guidelines for component architecture, including component structure, function dependency injection patterns, and context usage.

## File Organization

- [**Directory Structure**](file-organization/directory-structure.md) - Guidelines for file organization, including directory structure, file naming conventions, component file structure, and best practices.

## Project Workflows

- [**Adding OpenShift Hourly/On-Demand Products**](project-workflows/adding-openshift-product.md) - Step-by-step instructions for adding new OpenShift hourly or on-demand product configurations.
- [**Adding RHEL Annual Variants**](project-workflows/adding-rhel-annual-variant.md) - Step-by-step instructions for adding new RHEL annual product variants.

## State Management

- [**State Management Patterns**](state-management/redux-patterns.md) - Guidelines for state management, focusing on the project's custom Redux architecture, including internal hooks, advanced selector patterns, and generated promise action reducers.

## Testing

- [**Testing Practices**](testing/testing-practices.md) - Guidelines for testing, including unit testing, testing best practices, project-specific testing patterns, testing with dependency injection, and testing Redux.

## Local Guidelines

Local guidelines (*.local.md) are supplementary guidelines for local development that are not committed to git. They typically contain information about development practices that are specific to local environments, experimental features, or historical code references.

- **Note**: Local guidelines are unique to each developer and should never be directly linked or committed to git.
- **Important**: Local guidelines have higher priority than main guidelines in the inheritance chain.
