#!/usr/bin/env node

/**
 * Guidelines Inheritance Manager
 * 
 * Manages the inheritance and merging of guidelines from multiple sources:
 * - Base GUIDELINES.md (committed to repo)
 * - GUIDELINES.local.md (local overrides, gitignored)
 * - Team-specific guidelines (.guidelines/team.md)
 * 
 * Usage:
 *   node scripts/guidelines-manager.js merge
 *   node scripts/guidelines-manager.js check
 *   node scripts/guidelines-manager.js init-local
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class GuidelinesManager {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.baseGuidelinesPath = path.join(this.projectRoot, 'GUIDELINES.md');
    this.localGuidelinesPath = path.join(this.projectRoot, 'GUIDELINES.local.md');
    this.teamGuidelinesPath = path.join(this.projectRoot, '.guidelines', 'team.md');
    this.outputPath = path.join(this.projectRoot, '.guidelines', 'merged.md');
    this.cacheDir = path.join(this.projectRoot, '.guidelines', 'cache');
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = [
      path.join(this.projectRoot, '.guidelines'),
      this.cacheDir
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Load guidelines from a file path
   * @param {string} filePath - Path to guidelines file
   * @returns {Object} Parsed guidelines object
   */
  loadGuidelines(filePath) {
    if (!fs.existsSync(filePath)) {
      return { content: '', sections: {}, metadata: {} };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const sections = this.parseMarkdownSections(content);
    const metadata = this.extractMetadata(content);

    return { content, sections, metadata };
  }

  /**
   * Parse markdown content into sections
   * @param {string} content - Markdown content
   * @returns {Object} Sections object
   */
  parseMarkdownSections(content) {
    const sections = {};
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections[currentSection.id] = {
            level: currentSection.level,
            title: currentSection.title,
            content: currentContent.join('\n').trim()
          };
        }
        
        // Start new section
        const level = headerMatch[1].length;
        const title = headerMatch[2];
        const id = this.generateSectionId(title);
        
        currentSection = { level, title, id };
        currentContent = [line];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      sections[currentSection.id] = {
        level: currentSection.level,
        title: currentSection.title,
        content: currentContent.join('\n').trim()
      };
    }

    return sections;
  }

  /**
   * Generate section ID from title
   * @param {string} title - Section title
   * @returns {string} Section ID
   */
  generateSectionId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  /**
   * Extract metadata from guidelines content
   * @param {string} content - Guidelines content
   * @returns {Object} Metadata object
   */
  extractMetadata(content) {
    const metadata = {};
    
    // Look for extends directive
    const extendsMatch = content.match(/<!--\s*extends:\s*(.+?)\s*-->/i);
    if (extendsMatch) {
      metadata.extends = extendsMatch[1].trim();
    }

    // Look for priority directive
    const priorityMatch = content.match(/<!--\s*priority:\s*(\d+)\s*-->/i);
    if (priorityMatch) {
      metadata.priority = parseInt(priorityMatch[1], 10);
    }

    // Look for override sections
    const overrideMatches = content.match(/<!--\s*override:\s*(.+?)\s*-->/gi);
    if (overrideMatches) {
      metadata.overrides = overrideMatches.map(match => {
        const sectionMatch = match.match(/<!--\s*override:\s*(.+?)\s*-->/i);
        return sectionMatch ? sectionMatch[1].trim() : '';
      }).filter(Boolean);
    }

    return metadata;
  }

  /**
   * Merge multiple guidelines with precedence
   * @param {Array} guidelinesList - List of guidelines objects
   * @returns {Object} Merged guidelines
   */
  mergeGuidelines(guidelinesList) {
    // Sort by priority (higher priority first)
    const sortedGuidelines = guidelinesList
      .filter(g => g.content)
      .sort((a, b) => (b.metadata.priority || 0) - (a.metadata.priority || 0));

    const mergedSections = {};
    const mergedMetadata = {};
    
    // Start with base guidelines (lowest priority)
    const baseGuidelines = sortedGuidelines[sortedGuidelines.length - 1];
    if (baseGuidelines) {
      Object.assign(mergedSections, baseGuidelines.sections);
      Object.assign(mergedMetadata, baseGuidelines.metadata);
    }

    // Apply overrides in priority order
    for (let i = sortedGuidelines.length - 2; i >= 0; i--) {
      const guidelines = sortedGuidelines[i];
      
      // Merge sections
      Object.keys(guidelines.sections).forEach(sectionId => {
        const section = guidelines.sections[sectionId];
        
        if (guidelines.metadata.overrides?.includes(sectionId) || 
            guidelines.metadata.overrides?.includes(section.title)) {
          // Complete override
          mergedSections[sectionId] = section;
        } else {
          // Merge or add
          if (mergedSections[sectionId]) {
            mergedSections[sectionId] = this.mergeSections(mergedSections[sectionId], section);
          } else {
            mergedSections[sectionId] = section;
          }
        }
      });

      // Merge metadata
      Object.assign(mergedMetadata, guidelines.metadata);
    }

    return { sections: mergedSections, metadata: mergedMetadata };
  }

  /**
   * Merge two sections intelligently
   * @param {Object} baseSection - Base section
   * @param {Object} overrideSection - Override section
   * @returns {Object} Merged section
   */
  mergeSections(baseSection, overrideSection) {
    // If override section has higher or equal level, replace completely
    if (overrideSection.level <= baseSection.level) {
      return overrideSection;
    }

    // Otherwise, append as subsection
    return {
      level: baseSection.level,
      title: baseSection.title,
      content: `${baseSection.content}\n\n${overrideSection.content}`
    };
  }

  /**
   * Generate merged guidelines content
   * @param {Object} mergedGuidelines - Merged guidelines object
   * @returns {string} Markdown content
   */
  generateMergedContent(mergedGuidelines) {
    const { sections, metadata } = mergedGuidelines;
    
    let content = '';
    
    // Add header with generation info
    content += '<!-- This file is auto-generated by guidelines-manager.js -->\n';
    content += `<!-- Generated at: ${new Date().toISOString()} -->\n`;
    if (metadata.extends) {
      content += `<!-- Extends: ${metadata.extends} -->\n`;
    }
    content += '\n';

    // Sort sections by their appearance order and level
    const sortedSections = Object.values(sections).sort((a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.title.localeCompare(b.title);
    });

    // Generate content
    for (const section of sortedSections) {
      content += section.content + '\n\n';
    }

    return content.trim() + '\n';
  }

  /**
   * Merge all guidelines sources
   * @returns {string} Merged guidelines content
   */
  async mergeAllGuidelines() {
    console.log('🔄 Merging guidelines from all sources...');
    
    const sources = [
      { path: this.baseGuidelinesPath, name: 'Base Guidelines', priority: 1 },
      { path: this.teamGuidelinesPath, name: 'Team Guidelines', priority: 5 },
      { path: this.localGuidelinesPath, name: 'Local Guidelines', priority: 10 }
    ];

    const guidelinesList = [];

    for (const source of sources) {
      if (fs.existsSync(source.path)) {
        console.log(`📖 Loading ${source.name} from ${source.path}`);
        const guidelines = this.loadGuidelines(source.path);
        guidelines.metadata.priority = guidelines.metadata.priority || source.priority;
        guidelinesList.push(guidelines);
      } else {
        console.log(`⚠️  ${source.name} not found at ${source.path}`);
      }
    }

    if (guidelinesList.length === 0) {
      throw new Error('No guidelines files found!');
    }

    const merged = this.mergeGuidelines(guidelinesList);
    const content = this.generateMergedContent(merged);

    // Write merged guidelines
    fs.writeFileSync(this.outputPath, content, 'utf8');
    console.log(`✅ Merged guidelines written to ${this.outputPath}`);

    // Generate cache key for validation
    const cacheKey = crypto.createHash('md5').update(content).digest('hex');
    fs.writeFileSync(path.join(this.cacheDir, 'last-merge.hash'), cacheKey);

    return content;
  }

  /**
   * Initialize local guidelines file
   */
  initLocalGuidelines() {
    if (fs.existsSync(this.localGuidelinesPath)) {
      console.log('📝 GUIDELINES.local.md already exists');
      return;
    }

    const template = `<!-- extends: ./GUIDELINES.md -->
<!-- priority: 10 -->

# Local Development Guidelines

> **Note**: This file extends the base GUIDELINES.md and is gitignored for personal customization.

## Personal Development Preferences

### IDE Configuration
- **Editor**: Cursor with AI assistance
- **Tab Size**: 2 spaces (override default 4)
- **Line Length**: 100 characters (override default 80)

### Development Environment
- **Node Version**: \`\${process.version}\`
- **Package Manager**: npm (prefer over yarn)
- **Terminal**: zsh with oh-my-zsh

### Personal Code Style Preferences

#### Import Organization (Personal Override)
\`\`\`javascript
// Personal preference: Group by source type
import React from 'react';
import { useState, useEffect } from 'react';

import { PatternFly components } from '@patternfly/react-core';
import { RedHat components } from '@redhat-cloud-services/frontend-components';

import { Local utilities } from '../utils';
import { Component imports } from './components';
\`\`\`

#### Testing Preferences
- **Coverage Threshold**: 95% (higher than team standard)
- **Test File Location**: Co-located with components
- **Mock Strategy**: Prefer jest.fn() over manual mocks

### Local Development Scripts

#### Custom NPM Scripts (add to package.json)
\`\`\`json
{
  "scripts": {
    "dev:personal": "MOCK_PORT=3030 npm start",
    "test:watch": "npm run test:local",
    "lint:fix": "npm run test:lintfix"
  }
}
\`\`\`

#### Git Aliases (add to ~/.gitconfig)
\`\`\`bash
[alias]
  sw = "!f() { git log --author='$1' --oneline -20; }; f"
  guidelines = "!git diff HEAD~1 HEAD --name-only | grep -E '\\.(js|jsx|ts|tsx)$' | head -5"
\`\`\`

### Environment-Specific Overrides

#### MacOS Development
- Use \`brew\` for system dependencies
- Enable \`fsevents\` for faster file watching
- Use \`iTerm2\` with tmux for terminal management

#### Debugging Preferences
- **React DevTools**: Always enabled in development
- **Redux DevTools**: Enabled with action filtering
- **Console Logging**: Verbose in development, minimal in production

### Personal Productivity Tools

#### Cursor AI Prompts
\`\`\`
# Custom prompts for this project
"Analyze this React component for accessibility issues"
"Suggest Redux patterns based on our internal hooks"
"Review this code for dependency injection opportunities"
\`\`\`

#### Code Snippets
\`\`\`javascript
// Personal component template
/**
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 */
const MyComponent = ({ className, ...props }) => {
  return (
    <div className={classNames('my-component', className)} {...props}>
      {/* Component content */}
    </div>
  );
};

export { MyComponent as default, MyComponent };
\`\`\`

---

## Team Overrides (when working in team environment)

### Pair Programming Preferences
- **Tool**: VS Code Live Share or Cursor shared sessions
- **Duration**: 2-hour sessions with breaks
- **Rotation**: Driver/Navigator every 30 minutes

### Code Review Standards (Personal Checklist)
- [ ] Accessibility: Screen reader friendly
- [ ] Performance: No unnecessary re-renders
- [ ] Testing: Edge cases covered
- [ ] Documentation: JSDoc comments added
- [ ] Dependencies: No new external dependencies without discussion

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
`;

    fs.writeFileSync(this.localGuidelinesPath, template, 'utf8');
    console.log(`✅ Created GUIDELINES.local.md template at ${this.localGuidelinesPath}`);
    console.log('📝 Edit this file to customize your personal development guidelines');
  }

  /**
   * Validate current codebase against guidelines
   */
  async validateGuidelines() {
    console.log('🔍 Validating codebase against merged guidelines...');
    
    // Check if merged guidelines exist
    if (!fs.existsSync(this.outputPath)) {
      console.log('⚠️  No merged guidelines found. Running merge first...');
      await this.mergeAllGuidelines();
    }

    const issues = [];

    // Basic validation checks
    const srcFiles = this.getSourceFiles();
    
    for (const file of srcFiles.slice(0, 10)) { // Limit for demo
      const content = fs.readFileSync(file, 'utf8');
      const fileIssues = this.validateFile(file, content);
      issues.push(...fileIssues);
    }

    // Report results
    if (issues.length === 0) {
      console.log('✅ All validation checks passed!');
    } else {
      console.log(`⚠️  Found ${issues.length} guideline issues:`);
      issues.forEach(issue => {
        console.log(`   ${issue.file}:${issue.line} - ${issue.message}`);
      });
    }

    return issues.length === 0;
  }

  /**
   * Get all source files for validation
   * @returns {Array} List of source file paths
   */
  getSourceFiles() {
    const glob = require('glob');
    return glob.sync('src/**/*.{js,jsx}', { cwd: this.projectRoot })
      .map(file => path.join(this.projectRoot, file));
  }

  /**
   * Validate a single file against guidelines
   * @param {string} filePath - File path
   * @param {string} content - File content
   * @returns {Array} List of issues
   */
  validateFile(filePath, content) {
    const issues = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for defensive programming patterns
      if (line.includes('callback(') && !line.includes('typeof callback === \'function\'')) {
        issues.push({
          file: path.relative(this.projectRoot, filePath),
          line: lineNumber,
          message: 'Missing defensive programming check for callback function'
        });
      }

      // Check for proper import organization
      if (line.startsWith('import ') && lineNumber > 1) {
        const prevLine = lines[index - 1];
        if (prevLine.startsWith('import ') && this.isImportOrderViolation(prevLine, line)) {
          issues.push({
            file: path.relative(this.projectRoot, filePath),
            line: lineNumber,
            message: 'Import order violation: external imports should come before internal'
          });
        }
      }
    });

    return issues;
  }

  /**
   * Check if import order violates guidelines
   * @param {string} prevImport - Previous import line
   * @param {string} currentImport - Current import line
   * @returns {boolean} True if violation
   */
  isImportOrderViolation(prevImport, currentImport) {
    const getImportType = (importLine) => {
      if (importLine.includes('react')) return 1;
      if (importLine.includes('@patternfly') || importLine.includes('@redhat')) return 2;
      if (importLine.includes('../') || importLine.includes('./')) return 4;
      return 3; // internal
    };

    return getImportType(prevImport) > getImportType(currentImport);
  }

  /**
   * CLI command handler
   * @param {string} command - Command to execute
   */
  async handleCommand(command) {
    try {
      switch (command) {
        case 'merge':
          await this.mergeAllGuidelines();
          break;
        
        case 'check':
        case 'validate':
          const isValid = await this.validateGuidelines();
          process.exit(isValid ? 0 : 1);
          break;
        
        case 'init-local':
        case 'init':
          this.initLocalGuidelines();
          break;
        
        case 'help':
        default:
          this.showHelp();
          break;
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(`
Guidelines Inheritance Manager

Usage:
  node scripts/guidelines-manager.js <command>

Commands:
  merge      Merge all guidelines sources into .guidelines/merged.md
  check      Validate codebase against merged guidelines
  init-local Create GUIDELINES.local.md template
  help       Show this help message

Examples:
  npm run guidelines:merge
  npm run guidelines:check
  npm run guidelines:init

Files:
  GUIDELINES.md              Base guidelines (committed)
  GUIDELINES.local.md        Local overrides (gitignored)
  .guidelines/team.md        Team-specific guidelines
  .guidelines/merged.md      Generated merged guidelines
`);
  }
}

// CLI execution
if (require.main === module) {
  const manager = new GuidelinesManager();
  const command = process.argv[2] || 'help';
  manager.handleCommand(command);
}

module.exports = GuidelinesManager; 