# Guidelines Inheritance System - Usage Guide

This document explains how to use the guidelines inheritance system implemented in this project.

## 🎯 Overview

The guidelines inheritance system allows you to:
- **Maintain base guidelines** in `GUIDELINES.md` (committed to repo)
- **Create personal overrides** in `GUIDELINES.local.md` (gitignored)
- **Add team-specific rules** in `.guidelines/team.md`
- **Merge all sources** into a comprehensive guidelines document
- **Validate codebase** against merged guidelines

## 🚀 Quick Start

### 1. Initialize Local Guidelines
```bash
npm run guidelines:init
```
This creates a `GUIDELINES.local.md` template with personal customization examples.

### 2. Merge All Guidelines
```bash
npm run guidelines:merge
```
This combines base, team, and local guidelines into `.guidelines/merged.md`.

### 3. Validate Codebase
```bash
npm run guidelines:check
```
This checks your code against the merged guidelines and reports issues.

## 📋 Available Commands

| Command | Description | Output |
|---------|-------------|---------|
| `npm run guidelines:init` | Create GUIDELINES.local.md template | Local guidelines file |
| `npm run guidelines:merge` | Merge all guideline sources | `.guidelines/merged.md` |
| `npm run guidelines:check` | Validate code against guidelines | Compliance report |
| `npm run guidelines:help` | Show detailed help information | Help text |

## 📁 File Structure

```
project-root/
├── GUIDELINES.md                    # Base guidelines (committed)
├── GUIDELINES.local.md              # Personal overrides (gitignored)
├── .guidelines/
│   ├── team.md                      # Team-specific guidelines
│   ├── merged.md                    # Auto-generated merged guidelines
│   └── cache/
│       └── last-merge.hash          # Cache for validation
└── scripts/
    └── guidelines-manager.js        # Implementation script
```

## 🔧 Customization Examples

### Personal IDE Preferences
Add to `GUIDELINES.local.md`:
```markdown
<!-- override: Code Style and Conventions -->
## Personal Code Style Preferences

### IDE Configuration
- **Tab Size**: 2 spaces (override team default of 4)
- **Line Length**: 100 characters (override default 80)
- **Auto-format**: On save with Prettier

### Import Organization (Personal Override)
\`\`\`javascript
// Personal preference: React imports first
import React from 'react';
import { useState, useEffect } from 'react';

// External libraries
import { Button } from '@patternfly/react-core';

// Internal utilities
import { dateHelpers } from '../utils';
\`\`\`
```

### Team Environment Overrides
Create `.guidelines/team.md`:
```markdown
<!-- priority: 5 -->
# Team Development Guidelines

## Code Review Requirements
- **Minimum Reviewers**: 2 team members
- **Required Checks**: Accessibility, performance, security
- **Merge Strategy**: Squash commits for cleaner history

## Testing Standards
- **Coverage Threshold**: 90% (higher than base 80%)
- **E2E Tests**: Required for critical user paths
- **Performance Tests**: Required for data-heavy components
```

### Environment-Specific Rules
```markdown
## Development Environment Overrides

### MacOS Development
- Use `brew` for system dependencies
- Enable `fsevents` for faster file watching

### Windows Development  
- Use `chocolatey` for system dependencies
- Configure WSL2 for optimal performance

### Docker Development
- Mount node_modules as volume for performance
- Use bind mounts for source code hot reload
```

## 🎛️ Precedence Chain

Guidelines are merged with the following precedence (highest to lowest):

1. **Local Guidelines** (`GUIDELINES.local.md`) - Priority 10
2. **Team Guidelines** (`.guidelines/team.md`) - Priority 5  
3. **Base Guidelines** (`GUIDELINES.md`) - Priority 1

### Override Behavior
- **Complete Override**: Use `<!-- override: Section Name -->` to replace entire sections
- **Additive Merge**: Default behavior appends content to existing sections
- **Priority-Based**: Higher priority files override lower priority files

## 🔍 Validation Features

The validation system checks for:

### Import Organization
```javascript
// ✅ Correct order
import React from 'react';                    // React first
import { Button } from '@patternfly/react-core'; // External libraries
import { dateHelpers } from '../../utils';      // Internal utilities
import { MyComponent } from './MyComponent';    // Relative imports

// ❌ Incorrect order (will be flagged)
import { MyComponent } from './MyComponent';    // Relative first
import React from 'react';                     // React after relative
```

### Defensive Programming
```javascript
// ❌ Missing defensive check (will be flagged)
const handleCallback = (callback) => {
  callback(data); // Dangerous if callback is not a function
};

// ✅ Proper defensive programming
const handleCallback = (callback) => {
  if (typeof callback === 'function') {
    callback(data);
  }
};
```

### Additional Checks
- JSDoc documentation presence
- Component naming conventions
- Test file co-location
- Accessibility attributes

## 🔄 Workflow Integration

### Git Hooks (Optional)
Add to `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run guidelines:check",
      "post-checkout": "npm run guidelines:merge"
    }
  }
}
```

### CI/CD Integration
Add to `.github/workflows/guidelines.yml`:
```yaml
name: Guidelines Compliance
on: [push, pull_request]

jobs:
  guidelines:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Merge guidelines
        run: npm run guidelines:merge
      - name: Check compliance
        run: npm run guidelines:check
```

### IDE Integration
Configure your IDE to:
1. **Auto-merge** guidelines on project open
2. **Validate** on file save
3. **Show** compliance status in status bar

## 🎨 Advanced Customization

### Custom Validation Rules
Extend `scripts/guidelines-manager.js`:
```javascript
validateFile(filePath, content) {
  const issues = [];
  
  // Add custom validation
  if (content.includes('console.log') && !content.includes('// TODO: remove')) {
    issues.push({
      file: filePath,
      line: this.findLineNumber(content, 'console.log'),
      message: 'Remove console.log statements before commit'
    });
  }
  
  return issues;
}
```

### Section-Specific Overrides
```markdown
<!-- override: Testing Practices -->
## Personal Testing Preferences

### Coverage Requirements
- **Unit Tests**: 95% coverage (higher than team 90%)
- **Integration Tests**: 85% coverage
- **E2E Tests**: Critical paths only

### Testing Tools
- **Preferred**: Jest + React Testing Library
- **Mocking**: Prefer jest.fn() over manual mocks
- **Snapshots**: Use sparingly, prefer explicit assertions
```

### Metadata-Driven Behavior
```markdown
<!-- priority: 15 -->
<!-- override: Code Style and Conventions -->
<!-- override: Testing Practices -->
<!-- extends: ./GUIDELINES.md -->

# High-Priority Local Guidelines
This will override multiple sections with high priority.
```

## 🚨 Troubleshooting

### Common Issues

#### Guidelines Not Merging
```bash
# Check file permissions
ls -la GUIDELINES*.md

# Verify file exists
npm run guidelines:help

# Force re-merge
rm .guidelines/merged.md
npm run guidelines:merge
```

#### Validation Failing
```bash
# Check specific validation errors
npm run guidelines:check 2>&1 | head -20

# Validate single file (manual)
node -e "
const GuidelinesManager = require('./scripts/guidelines-manager.js');
const manager = new GuidelinesManager();
console.log(manager.validateFile('src/app.js', require('fs').readFileSync('src/app.js', 'utf8')));
"
```

#### Local Guidelines Not Applied
1. Check `.gitignore` includes `GUIDELINES.local.md`
2. Verify priority settings in file metadata
3. Ensure proper markdown syntax in override sections

### Debug Mode
```bash
# Enable debug logging
DEBUG=guidelines npm run guidelines:merge

# Verbose validation
VERBOSE=1 npm run guidelines:check
```

## 📚 Examples

### Complete Local Override Example
```markdown
<!-- extends: ./GUIDELINES.md -->
<!-- priority: 10 -->
<!-- override: Personal Development Preferences -->

# My Personal Development Guidelines

## IDE Setup
- **Editor**: Cursor with GitHub Copilot
- **Theme**: Dark mode with high contrast
- **Font**: JetBrains Mono, 14px

## Keyboard Shortcuts (Cursor)
- `Cmd+K`: AI command palette  
- `Cmd+L`: AI chat
- `Cmd+I`: AI inline edit

## Development Workflow
1. **Morning**: Review guidelines with `npm run guidelines:merge`
2. **Coding**: Use AI assistance for complex patterns
3. **Testing**: Run `npm run guidelines:check` before commits
4. **Evening**: Update local guidelines if needed

## Project-Specific Patterns
- Always use dependency injection for hooks
- Prefer internal Redux patterns over external libraries
- Use defensive programming for all callbacks
- Document all components with JSDoc

---
*Personal guidelines for ccabrera - Updated: ${new Date().toISOString().split('T')[0]}*
```

This creates a completely personalized development environment while maintaining team consistency.

## 🔗 Related Documentation

- [Base Guidelines](./GUIDELINES.md) - Complete development guidelines
- [Process Log](./archive/guideline_work/PROCESS_LOG.md) - How this system was built
- [Implementation Examples](./archive/guideline_work/guidelines-examples.md) - Advanced usage patterns

---

**Need Help?** Run `npm run guidelines:help` for detailed command information. 