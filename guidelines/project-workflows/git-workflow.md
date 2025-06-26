---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.md", "*.json"]
contexts: ["development", "git", "workflow"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-06-27"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["git", "commit messages", "branch naming", "pull requests"]
  related_guidelines: []
  importance: "high"
  code_examples: true
---

# Git Workflow Guidelines

## Commit Messages

Follow conventional commit format with issue tracking:
```
<type>(<scope>): <issue number><description>

feat(auth): sw-123 add login functionality
fix(table): sw-456 resolve pagination bug
refactor(components): sw-789 migrate to pf composable table
chore(build): npm updates
```

**Project Git Workflow Patterns:**
- Always include issue numbers in format `sw-####` for JIRA tracking
- Use descriptive scopes that match the affected component/area
- Group related changes in single commits when logically connected
- Use "refactor" type for component migrations and architectural changes
- Use "build(deps)" for dependency updates
- Use specific component names in scope (e.g., "graphCardHelpers", "toolbarField")

## Branch Naming

```
feature/description-of-feature
bugfix/description-of-bug
hotfix/critical-issue-name
```

## Pull Request Guidelines

1. **Small, focused changes** - One feature or fix per PR
2. **Clear descriptions** - Explain what and why, not just how
3. **Test coverage** - Ensure new code has appropriate tests
4. **Update documentation** - Keep docs in sync with code changes
