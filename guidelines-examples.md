# Guideline Inheritance and External References Examples

This document demonstrates how to implement different types of guideline inheritance systems for development teams.

## 1. External GitHub Repository Guidelines

Reference and extend guidelines from external repositories with versioning support:

### Configuration File Approach
```yaml
# .guidelines-config.yml
extends:
  - github:organization/coding-standards@v2.1.0
  - github:redhat/frontend-guidelines@main
  - github:patternfly/react-guidelines@v4.x

# Override or extend specific sections
overrides:
  testing:
    minCoverage: 90  # Override org standard of 80%
  imports:
    preferredOrder: ["react", "external", "internal", "relative"]
```

### Implementation Script
```javascript
// scripts/guidelines-sync.js
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const yaml = require('js-yaml');

class ExternalGuidelinesManager {
  constructor(configPath = '.guidelines-config.yml') {
    this.config = yaml.load(fs.readFileSync(configPath, 'utf8'));
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }

  async syncExternalGuidelines() {
    for (const repo of this.config.extends) {
      const [owner, repoName, version] = this.parseGithubUrl(repo);
      
      try {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo: repoName,
          path: 'GUIDELINES.md',
          ref: version || 'main'
        });
        
        const externalGuidelines = Buffer.from(data.content, 'base64').toString();
        
        // Cache the guidelines
        fs.writeFileSync(
          `./cache/guidelines-${owner}-${repoName}-${version}.md`, 
          externalGuidelines
        );
        
        console.log(`✅ Synced guidelines from ${repo}`);
      } catch (error) {
        console.error(`❌ Failed to sync ${repo}:`, error.message);
      }
    }
  }

  parseGithubUrl(url) {
    // Parse "github:organization/repo@version" format
    const match = url.match(/github:([^/]+)\/([^@]+)(?:@(.+))?/);
    return match ? [match[1], match[2], match[3]] : null;
  }

  async generateMergedGuidelines() {
    let mergedContent = fs.readFileSync('GUIDELINES.md', 'utf8');
    
    // Apply external guidelines
    for (const repo of this.config.extends) {
      const cachedPath = this.getCachedPath(repo);
      if (fs.existsSync(cachedPath)) {
        const externalContent = fs.readFileSync(cachedPath, 'utf8');
        mergedContent = this.mergeMarkdownContent(mergedContent, externalContent);
      }
    }
    
    // Apply overrides
    mergedContent = this.applyOverrides(mergedContent, this.config.overrides);
    
    fs.writeFileSync('GUIDELINES.generated.md', mergedContent);
  }
}

// Usage
const manager = new ExternalGuidelinesManager();
manager.syncExternalGuidelines().then(() => {
  manager.generateMergedGuidelines();
});
```

### Package.json Integration
```json
{
  "scripts": {
    "guidelines:sync": "node scripts/guidelines-sync.js",
    "guidelines:check": "node scripts/validate-compliance.js",
    "prepare": "npm run guidelines:sync"
  },
  "devDependencies": {
    "@octokit/rest": "^19.0.0",
    "js-yaml": "^4.1.0"
  }
}
```

## 2. NPM-Based Guidelines (Package.json)

Install and configure guidelines as NPM packages, similar to ESLint configs:

### Package Structure
```
@company/coding-guidelines/
├── package.json
├── index.js                 // Main export
├── react/
│   ├── index.js            // React-specific guidelines
│   ├── component-patterns.md
│   ├── hooks-standards.md
│   └── testing.md
├── accessibility/
│   ├── index.js
│   ├── wcag-checklist.md
│   └── aria-patterns.md
├── configs/
│   ├── eslint.js
│   ├── prettier.js
│   └── jest.js
└── scripts/
    ├── validate.js
    └── generate-docs.js
```

### NPM Package Implementation
```javascript
// @company/coding-guidelines/index.js
const fs = require('fs');
const path = require('path');

class CodingGuidelines {
  constructor(options = {}) {
    this.basePath = __dirname;
    this.options = options;
    this.guidelines = new Map();
  }

  extend(configName) {
    const configPath = path.join(this.basePath, configName, 'index.js');
    if (fs.existsSync(configPath)) {
      const config = require(configPath);
      this.guidelines.set(configName, config);
    }
    return this;
  }

  generateSection(sectionName) {
    const sectionPath = path.join(this.basePath, sectionName);
    if (fs.existsSync(sectionPath)) {
      const markdownFiles = fs.readdirSync(sectionPath)
        .filter(file => file.endsWith('.md'))
        .map(file => fs.readFileSync(path.join(sectionPath, file), 'utf8'));
      
      return markdownFiles.join('\n\n');
    }
    return '';
  }

  getESLintConfig() {
    return require('./configs/eslint.js');
  }

  getPrettierConfig() {
    return require('./configs/prettier.js');
  }

  validate(projectPath) {
    const validator = require('./scripts/validate.js');
    return validator.checkCompliance(projectPath, this.guidelines);
  }
}

module.exports = CodingGuidelines;
```

### React-Specific Guidelines Package
```javascript
// @company/coding-guidelines/react/index.js
module.exports = {
  name: 'React Development Guidelines',
  version: '2.1.0',
  
  rules: {
    components: {
      preferFunctional: true,
      useTypeScript: true,
      defaultProps: 'parameters', // Use default parameters instead of defaultProps
      propTypes: 'jsdoc'         // Use JSDoc instead of PropTypes
    },
    
    hooks: {
      customHooksPrefix: 'use',
      dependencyInjection: true,
      aliasPattern: 'useAlias{HookName}'
    },
    
    testing: {
      testFilePattern: '**/*.test.{js,jsx,ts,tsx}',
      minCoverage: 85,
      snapshotTesting: true
    }
  },

  patterns: {
    componentStructure: `
/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Required prop
 * @param {Function} [props.onAction] - Optional callback
 * @param {boolean} [props.isDisabled=false] - Optional with default
 */
const MyComponent = ({ 
  title, 
  onAction, 
  isDisabled = false,
  ...otherProps 
}) => {
  // Hooks first
  const [state, setState] = useState();
  
  // Event handlers
  const handleAction = useCallback(() => {
    if (typeof onAction === 'function') {
      onAction();
    }
  }, [onAction]);
  
  // Render
  return <div {...otherProps}>{title}</div>;
};

export { MyComponent as default, MyComponent };
`
  },

  eslintRules: require('../configs/eslint.js'),
  prettierConfig: require('../configs/prettier.js')
};
```

### Project Integration
```json
{
  "name": "curiosity-frontend",
  "devDependencies": {
    "@company/coding-guidelines": "^2.1.0",
    "@redhat/frontend-standards": "^1.3.0"
  },
  "guidelines": {
    "extends": [
      "@company/coding-guidelines/react",
      "@redhat/frontend-standards/accessibility"
    ],
    "overrides": {
      "testing": {
        "minCoverage": 90
      }
    }
  },
  "scripts": {
    "guidelines:install": "node scripts/install-guidelines.js",
    "guidelines:validate": "node scripts/validate-guidelines.js",
    "guidelines:docs": "node scripts/generate-docs.js"
  }
}
```

### Usage Script
```javascript
// scripts/install-guidelines.js
const CodingGuidelines = require('@company/coding-guidelines');
const fs = require('fs');

async function installGuidelines() {
  const guidelines = new CodingGuidelines();
  
  // Load packages from package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const guidelinesConfig = packageJson.guidelines || {};
  
  // Extend with specified packages
  for (const config of guidelinesConfig.extends || []) {
    guidelines.extend(config);
  }
  
  // Generate documentation sections
  const reactSection = guidelines.generateSection('react');
  const a11ySection = guidelines.generateSection('accessibility');
  
  // Merge with existing GUIDELINES.md
  let existingGuidelines = fs.readFileSync('GUIDELINES.md', 'utf8');
  
  // Append or update sections
  existingGuidelines += '\n\n## React Guidelines (from NPM package)\n' + reactSection;
  existingGuidelines += '\n\n## Accessibility Guidelines (from NPM package)\n' + a11ySection;
  
  fs.writeFileSync('GUIDELINES.generated.md', existingGuidelines);
  
  // Update ESLint/Prettier configs
  const eslintConfig = guidelines.getESLintConfig();
  fs.writeFileSync('.eslintrc.generated.js', `module.exports = ${JSON.stringify(eslintConfig, null, 2)}`);
}

installGuidelines();
```

## 3. Local Inherited Guidelines (Gitignored)

Support personal/team-specific guidelines that extend committed ones without affecting the repository:

### Gitignore Setup
```bash
# Add to .gitignore
GUIDELINES.local.md
GUIDELINES.personal.md
.guidelines/
*.guidelines.local.*
.guidelines-cache/
```

### Local Override Structure
```markdown
<!-- GUIDELINES.local.md -->
# Local Development Guidelines

## Extends: ./GUIDELINES.md

### Personal Development Preferences

#### IDE Configuration
- **Editor**: Cursor with specific extensions
- **AI**: Enable Copilot with custom prompts for this project
- **Formatting**: 2 spaces (override default 4)
- **Theme**: Dark mode with high contrast

#### Personal Workflow Overrides
- Use verbose logging in development mode
- Enable all debugging features
- Skip certain linting rules for experimental code
- Use different commit message format for personal branches

### Team-Specific Patterns (if working in team)
- Require pair programming for Redux state changes
- Use feature flags for all new components
- Enable performance profiling for all builds
- Specific testing requirements beyond base guidelines

### Environment-Specific Rules

#### MacOS Development
```bash
# Use brew for dependency management
brew install node yarn
brew services start postgresql
```

#### Windows Development  
```bash
# Use chocolatey
choco install nodejs yarn
# Use WSL2 for better compatibility
```

#### Docker Development
```yaml
# docker-compose.override.yml (also gitignored)
services:
  frontend:
    volumes:
      - ./src:/app/src:cached
      - ./.guidelines:/app/.guidelines:ro
    environment:
      - DEBUG=*
      - GUIDELINES_LOCAL=true
```

### Personal Code Style Overrides
- Allow console.log in development (override guideline rule)
- Use different naming convention for temporary variables
- Enable experimental React features
- Use different import organization for utility files
```

### Implementation Scripts
```javascript
// scripts/merge-local-guidelines.js
const fs = require('fs');
const path = require('path');

class LocalGuidelinesManager {
  constructor() {
    this.baseFile = 'GUIDELINES.md';
    this.localFiles = [
      'GUIDELINES.local.md',
      'GUIDELINES.personal.md',
      '.guidelines/team.md',
      '.guidelines/project.md'
    ];
    this.outputFile = 'GUIDELINES.merged.md';
  }

  mergeGuidelines() {
    let content = this.readBaseGuidelines();
    
    // Apply local files in order of precedence
    for (const localFile of this.localFiles) {
      if (fs.existsSync(localFile)) {
        const localContent = fs.readFileSync(localFile, 'utf8');
        content = this.mergeMarkdownContent(content, localContent);
        console.log(`✅ Merged ${localFile}`);
      }
    }
    
    // Add metadata about merge
    content = this.addMergeMetadata(content);
    
    fs.writeFileSync(this.outputFile, content);
    console.log(`📝 Generated ${this.outputFile}`);
  }

  readBaseGuidelines() {
    return fs.readFileSync(this.baseFile, 'utf8');
  }

  mergeMarkdownContent(base, override) {
    // Simple implementation - in practice, you'd want sophisticated markdown parsing
    const overrideSections = this.extractSections(override);
    let result = base;
    
    for (const [sectionName, sectionContent] of overrideSections) {
      if (sectionName.startsWith('### Personal') || sectionName.startsWith('### Team')) {
        // Append personal/team sections
        result += '\n\n' + sectionContent;
      } else {
        // Replace existing sections
        result = this.replaceSectionContent(result, sectionName, sectionContent);
      }
    }
    
    return result;
  }

  extractSections(content) {
    // Extract markdown sections - simplified implementation
    const sections = new Map();
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];
    
    for (const line of lines) {
      if (line.startsWith('###') || line.startsWith('##')) {
        if (currentSection) {
          sections.set(currentSection, currentContent.join('\n'));
        }
        currentSection = line;
        currentContent = [line];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }
    
    if (currentSection) {
      sections.set(currentSection, currentContent.join('\n'));
    }
    
    return sections;
  }

  addMergeMetadata(content) {
    const timestamp = new Date().toISOString();
    const appliedFiles = this.localFiles.filter(f => fs.existsSync(f));
    
    const metadata = `
<!-- Generated Guidelines -->
<!-- Base: ${this.baseFile} -->
<!-- Applied: ${appliedFiles.join(', ')} -->
<!-- Generated: ${timestamp} -->
<!-- DO NOT EDIT: This file is auto-generated -->

`;
    return metadata + content;
  }

  validateCompliance(filePath) {
    // Check if code follows the merged guidelines
    const validator = require('./validate-compliance.js');
    return validator.checkFile(filePath, this.outputFile);
  }
}

module.exports = LocalGuidelinesManager;
```

### Package.json Integration
```json
{
  "scripts": {
    "guidelines:merge": "node scripts/merge-local-guidelines.js",
    "guidelines:check": "npm run guidelines:merge && node scripts/validate-compliance.js",
    "guidelines:personal": "cp GUIDELINES.md GUIDELINES.personal.md && echo 'Edit GUIDELINES.personal.md with your preferences'",
    "guidelines:team": "mkdir -p .guidelines && touch .guidelines/team.md",
    "dev": "npm run guidelines:merge && npm start",
    "build": "npm run guidelines:check && npm run build:production"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run guidelines:check",
      "post-checkout": "npm run guidelines:merge"
    }
  }
}
```

### Developer Workflow
```bash
# Initial setup for new developer
npm run guidelines:personal    # Create personal overrides file
npm run guidelines:team       # Create team-specific file (if needed)

# Daily workflow
npm run dev                   # Auto-merges guidelines before starting
git commit -m "feat: add new component"  # Pre-commit hook validates

# Team member joins
echo "Welcome! Run 'npm run guidelines:personal' to create your local overrides"
```

### VS Code Integration
```json
// .vscode/settings.json (gitignored for personal settings)
{
  "guidelines.localFile": "GUIDELINES.personal.md",
  "guidelines.autoMerge": true,
  "guidelines.validateOnSave": true,
  "guidelines.showMergedFile": "GUIDELINES.merged.md"
}
```

## 4. Complete Integration Example

Combining all three approaches in a single project:

### Master Configuration
```javascript
// guidelines.config.js
module.exports = {
  // 1. External repositories
  external: {
    repositories: [
      {
        url: 'github:redhat/frontend-guidelines@v2.1.0',
        sections: ['accessibility', 'security'],
        cache: '24h'
      },
      {
        url: 'github:patternfly/react-guidelines@latest',
        sections: ['components', 'theming'],
        cache: '1h'
      }
    ]
  },
  
  // 2. NPM packages
  packages: [
    '@company/eslint-config@^3.0.0',
    '@company/coding-guidelines/react@latest',
    '@redhat/frontend-standards@^2.0.0'
  ],
  
  // 3. Local inheritance chain
  local: {
    files: [
      'GUIDELINES.md',              // Base (committed)
      '.guidelines/team.md',        // Team overrides (committed)
      'GUIDELINES.local.md',        // Personal overrides (gitignored)
      'GUIDELINES.personal.md'      // Alternative personal file (gitignored)
    ],
    precedence: 'personal > local > team > base > packages > external'
  },
  
  // Output configuration
  output: {
    merged: 'GUIDELINES.merged.md',
    docs: 'docs/guidelines/',
    configs: {
      eslint: '.eslintrc.generated.js',
      prettier: '.prettierrc.generated.js'
    }
  }
};
```

This comprehensive system allows for maximum flexibility while maintaining consistency across teams and projects. 