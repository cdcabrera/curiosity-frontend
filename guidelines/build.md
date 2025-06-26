---
guideline_version: "1.0.0"
priority: 3
applies_to: ["package.json", "*.config.js", "*.yml", "*.yaml", "deploy/*"]
contexts: ["build", "ci", "deployment"]
conflicts_with: []
extends: ["../GUIDELINES.md"]
last_updated: "2024-06-26"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  backward_compatible: true
  context_activation: "build_phase"
---

# Build Context Guidelines

## Extends: ../GUIDELINES.md

This document provides build and deployment-specific guidelines.

## Build-Specific Rules

### Build Script Standards
```extend:build-scripts
/**
 * Build Scripts - Extension
 * Additional build script requirements
 */
// Standard build commands:
// npm run build (production build)
// npm run build:ephemeral (ephemeral environment build)
// npm run build:docs (documentation generation)
// npm run build:deps (dependency updates)
```

### Performance Optimization
```merge:build-optimization
/**
 * Build Optimization - Merge
 * Build-time performance considerations
 */
// Bundle analysis and optimization:
// - Monitor bundle size during builds
// - Use tree shaking for unused code elimination
// - Implement code splitting for large features
// - Optimize images and static assets
// - Use production-optimized React builds
```

### Environment Configuration
- Use environment variables for build-time configuration
- Validate required environment variables during build
- Separate development, staging, and production configurations
- Never commit sensitive configuration to version control

### CI/CD Integration
```extend:ci-cd-pipeline
/**
 * CI/CD Pipeline - Extension  
 * Build pipeline requirements
 */
// Build pipeline steps:
// 1. Install dependencies (npm ci)
// 2. Run linting (npm run test:lint)
// 3. Run unit tests (npm test)
// 4. Run integration tests (npm run test:integration)
// 5. Build application (npm run build)
// 6. Deploy to target environment
```

### Deployment Validation
- Ensure all tests pass before deployment
- Validate build artifacts before deployment
- Use health checks to verify successful deployment
- Implement rollback strategies for failed deployments

### Documentation Updates
```merge:build-documentation
/**
 * Build Documentation - Merge
 * Documentation requirements during build process
 */
// Update documentation during build:
// - Generate API documentation (npm run build:docs)
// - Update README files with current package versions
// - Generate dependency graphs and architecture diagrams
// - Update changelog with recent changes
```

<!-- CONTEXT_ACTIVE: build,ci,deployment -->
<!-- CONFLICT_EXTENDED: ci-cd-pipeline -->
<!-- CONFLICT_MERGED: build-optimization --> 