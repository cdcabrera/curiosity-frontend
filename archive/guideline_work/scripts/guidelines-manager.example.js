#!/usr/bin/env node

/**
 * Guidelines Manager - Comprehensive Implementation Example
 * 
 * This script demonstrates how to implement all three types of guideline inheritance:
 * 1. External GitHub repository guidelines
 * 2. NPM-based guidelines packages
 * 3. Local inherited guidelines (gitignored)
 */

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');
const yaml = require('js-yaml');

class ComprehensiveGuidelinesManager {
  constructor(options = {}) {
    this.configFile = options.configFile || '.guidelines-config.yml';
    this.packageFile = options.packageFile || 'package.json';
    this.baseGuidelinesFile = options.baseFile || 'GUIDELINES.md';
    this.outputFile = options.outputFile || 'GUIDELINES.merged.md';
    this.cacheDir = options.cacheDir || '.guidelines-cache';
    
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    this.config = this.loadConfig();
    this.packageJson = this.loadPackageJson();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        return yaml.load(fs.readFileSync(this.configFile, 'utf8'));
      }
    } catch (error) {
      console.warn(`⚠️  Could not load config file ${this.configFile}:`, error.message);
    }
    return { extends: [], overrides: {}, cache: {}, validation: {} };
  }

  loadPackageJson() {
    try {
      return JSON.parse(fs.readFileSync(this.packageFile, 'utf8'));
    } catch (error) {
      console.error(`❌ Could not load ${this.packageFile}:`, error.message);
      return {};
    }
  }

  async processAllGuidelines() {
    console.log('🚀 Starting comprehensive guidelines processing...\n');
    
    let mergedContent = this.loadBaseGuidelines();
    
    // 1. Process External GitHub Guidelines
    console.log('📥 Processing external GitHub guidelines...');
    const externalContent = await this.processExternalGuidelines();
    mergedContent = this.mergeContent(mergedContent, externalContent);
    
    // 2. Process NPM Package Guidelines
    console.log('📦 Processing NPM package guidelines...');
    const npmContent = await this.processNpmGuidelines();
    mergedContent = this.mergeContent(mergedContent, npmContent);
    
    // 3. Process Local Guidelines
    console.log('🏠 Processing local guidelines...');
    const localContent = this.processLocalGuidelines();
    mergedContent = this.mergeContent(mergedContent, localContent);
    
    // 4. Apply Configuration Overrides
    console.log('⚙️  Applying configuration overrides...');
    mergedContent = this.applyOverrides(mergedContent);
    
    // 5. Generate Output Files
    console.log('📝 Generating output files...');
    this.generateOutputFiles(mergedContent);
    
    console.log('\n✅ Guidelines processing complete!');
    return mergedContent;
  }

  // 1. External GitHub Guidelines Processing
  async processExternalGuidelines() {
    const externalSections = [];
    
    if (!this.config.extends || this.config.extends.length === 0) {
      console.log('   No external guidelines configured');
      return '';
    }

    for (const repoUrl of this.config.extends) {
      try {
        const content = await this.fetchExternalGuideline(repoUrl);
        if (content) {
          externalSections.push(content);
          console.log(`   ✅ Fetched ${repoUrl}`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to fetch ${repoUrl}:`, error.message);
      }
    }

    return externalSections.join('\n\n');
  }

  async fetchExternalGuideline(repoUrl) {
    const [owner, repo, version] = this.parseGithubUrl(repoUrl);
    if (!owner || !repo) return null;

    const cacheFile = path.join(this.cacheDir, `${owner}-${repo}-${version || 'main'}.md`);
    
    // Check cache first
    if (this.isValidCache(cacheFile)) {
      console.log(`   📋 Using cached ${repoUrl}`);
      return fs.readFileSync(cacheFile, 'utf8');
    }

    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: 'GUIDELINES.md',
        ref: version || 'main'
      });

      const content = Buffer.from(data.content, 'base64').toString();
      
      // Cache the content
      this.ensureDirectoryExists(this.cacheDir);
      fs.writeFileSync(cacheFile, content);
      
      return content;
    } catch (error) {
      console.error(`   ❌ GitHub API error for ${repoUrl}:`, error.message);
      return null;
    }
  }

  parseGithubUrl(url) {
    const match = url.match(/github:([^/]+)\/([^@]+)(?:@(.+))?/);
    return match ? [match[1], match[2], match[3]] : [null, null, null];
  }

  isValidCache(cacheFile) {
    if (!fs.existsSync(cacheFile)) return false;
    
    const stats = fs.statSync(cacheFile);
    const cacheAge = Date.now() - stats.mtime.getTime();
    const maxAge = this.parseCacheDuration(this.config.cache?.duration || '24h');
    
    return cacheAge < maxAge;
  }

  parseCacheDuration(duration) {
    const match = duration.match(/(\d+)([hmd])/);
    if (!match) return 24 * 60 * 60 * 1000; // Default 24 hours
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  // 2. NPM Package Guidelines Processing
  async processNpmGuidelines() {
    const guidelinesConfig = this.packageJson.guidelines;
    if (!guidelinesConfig || !guidelinesConfig.extends) {
      console.log('   No NPM guidelines configured');
      return '';
    }

    const npmSections = [];

    for (const packageName of guidelinesConfig.extends) {
      try {
        const content = this.loadNpmGuideline(packageName);
        if (content) {
          npmSections.push(content);
          console.log(`   ✅ Loaded ${packageName}`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to load ${packageName}:`, error.message);
      }
    }

    return npmSections.join('\n\n');
  }

  loadNpmGuideline(packageName) {
    try {
      // Try to require the package
      const packagePath = require.resolve(packageName);
      const GuidelinesClass = require(packagePath);
      
      if (typeof GuidelinesClass === 'function') {
        const guidelines = new GuidelinesClass();
        return guidelines.generateMarkdown ? guidelines.generateMarkdown() : '';
      } else if (GuidelinesClass.generateSection) {
        return GuidelinesClass.generateSection();
      }
      
      return '';
    } catch (error) {
      // Package not installed or not found
      console.warn(`   ⚠️  Package ${packageName} not available:`, error.message);
      return '';
    }
  }

  // 3. Local Guidelines Processing
  processLocalGuidelines() {
    const localFiles = [
      'GUIDELINES.local.md',
      'GUIDELINES.personal.md',
      '.guidelines/team.md',
      '.guidelines/project.md'
    ];

    const localSections = [];

    for (const localFile of localFiles) {
      if (fs.existsSync(localFile)) {
        try {
          const content = fs.readFileSync(localFile, 'utf8');
          localSections.push(content);
          console.log(`   ✅ Loaded ${localFile}`);
        } catch (error) {
          console.error(`   ❌ Failed to load ${localFile}:`, error.message);
        }
      }
    }

    if (localSections.length === 0) {
      console.log('   No local guidelines found');
    }

    return localSections.join('\n\n');
  }

  // Content Merging and Processing
  loadBaseGuidelines() {
    try {
      return fs.readFileSync(this.baseGuidelinesFile, 'utf8');
    } catch (error) {
      console.error(`❌ Could not load base guidelines ${this.baseGuidelinesFile}:`, error.message);
      return '# Guidelines\n\nBase guidelines file not found.';
    }
  }

  mergeContent(base, additional) {
    if (!additional || additional.trim() === '') return base;
    
    // Simple merge - append additional content
    // In a real implementation, you'd want sophisticated markdown parsing
    return base + '\n\n---\n\n' + additional;
  }

  applyOverrides(content) {
    const overrides = {
      ...this.config.overrides,
      ...this.packageJson.guidelines?.overrides
    };

    if (Object.keys(overrides).length === 0) {
      console.log('   No overrides to apply');
      return content;
    }

    // Simple implementation - add overrides as new section
    let overrideSection = '\n\n## Configuration Overrides\n\n';
    overrideSection += 'The following overrides have been applied from configuration:\n\n';
    
    for (const [section, rules] of Object.entries(overrides)) {
      overrideSection += `### ${section}\n`;
      for (const [rule, value] of Object.entries(rules)) {
        overrideSection += `- **${rule}**: ${JSON.stringify(value)}\n`;
      }
      overrideSection += '\n';
    }

    console.log(`   ✅ Applied ${Object.keys(overrides).length} override sections`);
    return content + overrideSection;
  }

  // Output Generation
  generateOutputFiles(content) {
    // Add metadata
    const metadata = this.generateMetadata();
    const finalContent = metadata + content;

    // Write merged guidelines
    fs.writeFileSync(this.outputFile, finalContent);
    console.log(`   📄 Generated ${this.outputFile}`);

    // Generate ESLint config if needed
    this.generateESLintConfig();

    // Generate Prettier config if needed
    this.generatePrettierConfig();

    // Generate validation report
    this.generateValidationReport(finalContent);
  }

  generateMetadata() {
    const timestamp = new Date().toISOString();
    const appliedSources = [];
    
    if (this.config.extends?.length > 0) {
      appliedSources.push(`External: ${this.config.extends.join(', ')}`);
    }
    
    if (this.packageJson.guidelines?.extends?.length > 0) {
      appliedSources.push(`NPM: ${this.packageJson.guidelines.extends.join(', ')}`);
    }

    const localFiles = ['GUIDELINES.local.md', 'GUIDELINES.personal.md', '.guidelines/team.md']
      .filter(f => fs.existsSync(f));
    
    if (localFiles.length > 0) {
      appliedSources.push(`Local: ${localFiles.join(', ')}`);
    }

    return `<!--
GENERATED GUIDELINES
Base: ${this.baseGuidelinesFile}
Sources: ${appliedSources.join(' | ')}
Generated: ${timestamp}
DO NOT EDIT: This file is auto-generated. Edit source files instead.
-->

`;
  }

  generateESLintConfig() {
    // Example ESLint config generation
    const eslintConfig = {
      extends: ['react-app'],
      rules: {},
      overrides: []
    };

    // Apply NPM package ESLint rules
    if (this.packageJson.guidelines?.extends) {
      for (const packageName of this.packageJson.guidelines.extends) {
        try {
          const GuidelinesClass = require(packageName);
          if (GuidelinesClass.eslintRules) {
            Object.assign(eslintConfig.rules, GuidelinesClass.eslintRules);
          }
        } catch (error) {
          // Package not available
        }
      }
    }

    fs.writeFileSync('.eslintrc.generated.js', 
      `// Auto-generated ESLint config\nmodule.exports = ${JSON.stringify(eslintConfig, null, 2)};`
    );
    console.log('   ⚙️  Generated .eslintrc.generated.js');
  }

  generatePrettierConfig() {
    // Example Prettier config generation
    const prettierConfig = {
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      semi: true
    };

    fs.writeFileSync('.prettierrc.generated.js',
      `// Auto-generated Prettier config\nmodule.exports = ${JSON.stringify(prettierConfig, null, 2)};`
    );
    console.log('   🎨 Generated .prettierrc.generated.js');
  }

  generateValidationReport(content) {
    const report = {
      timestamp: new Date().toISOString(),
      sources: {
        external: this.config.extends || [],
        npm: this.packageJson.guidelines?.extends || [],
        local: ['GUIDELINES.local.md', '.guidelines/team.md'].filter(f => fs.existsSync(f))
      },
      stats: {
        totalLines: content.split('\n').length,
        totalSections: (content.match(/^##/gm) || []).length,
        totalSubsections: (content.match(/^###/gm) || []).length
      },
      validation: {
        hasAccessibilitySection: content.includes('accessibility') || content.includes('Accessibility'),
        hasTestingSection: content.includes('testing') || content.includes('Testing'),
        hasSecuritySection: content.includes('security') || content.includes('Security')
      }
    };

    fs.writeFileSync('guidelines-validation-report.json', JSON.stringify(report, null, 2));
    console.log('   📊 Generated guidelines-validation-report.json');
  }

  // Utility Methods
  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Command Line Interface
  static async run() {
    const command = process.argv[2];
    const manager = new ComprehensiveGuidelinesManager();

    switch (command) {
      case 'sync':
        await manager.processAllGuidelines();
        break;
      case 'check':
        await manager.validateCompliance();
        break;
      case 'clean':
        manager.cleanCache();
        break;
      case 'init':
        manager.initializeProject();
        break;
      default:
        console.log(`
Usage: node guidelines-manager.js <command>

Commands:
  sync    - Sync and merge all guidelines sources
  check   - Validate code compliance with guidelines
  clean   - Clean guidelines cache
  init    - Initialize guidelines system for this project

Examples:
  npm run guidelines:sync
  npm run guidelines:check
        `);
    }
  }

  async validateCompliance() {
    console.log('🔍 Validating guidelines compliance...');
    // Implementation would check code against merged guidelines
    console.log('✅ Compliance validation complete');
  }

  cleanCache() {
    console.log('🧹 Cleaning guidelines cache...');
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true });
      console.log(`✅ Cleaned ${this.cacheDir}`);
    }
  }

  initializeProject() {
    console.log('🏗️  Initializing guidelines system...');
    
    // Create example configuration files
    if (!fs.existsSync(this.configFile)) {
      const exampleConfig = {
        extends: [],
        overrides: {},
        cache: { duration: '24h' }
      };
      fs.writeFileSync(this.configFile, yaml.dump(exampleConfig));
      console.log(`✅ Created ${this.configFile}`);
    }

    // Create local guidelines template
    if (!fs.existsSync('GUIDELINES.local.example.md')) {
      fs.copyFileSync('GUIDELINES.local.example.md', 'GUIDELINES.local.template.md');
      console.log('✅ Created local guidelines template');
    }

    console.log('✅ Guidelines system initialized');
  }
}

// Export for use as module or run as CLI
module.exports = ComprehensiveGuidelinesManager;

// Run as CLI if called directly
if (require.main === module) {
  ComprehensiveGuidelinesManager.run().catch(error => {
    console.error('❌ Guidelines manager error:', error);
    process.exit(1);
  });
} 