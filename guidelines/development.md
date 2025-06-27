---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.scss", "*.css"]
contexts: ["development"]
conflicts_with: []
extends: ["../GUIDELINES.md"]
last_updated: "2024-06-26"
compatibility:
  base_guidelines: ">=1.0.0 <2.0.0"
  react_version: ">=18.0.0"
  node_version: ">=16.0.0"
effectiveness_tracking:
  log_dev_server_usage: true
  log_debug_configurations: true
  track_hot_reload_effectiveness: true
  measure_development_velocity: true
  development_weights:
    hot_reload_usage: 1.4
    debug_tool_adoption: 1.1
    eslint_adherence: 1.2
    dev_server_optimization: 1.0
agent_hints:
  processing_order: "top_down"
  validation_required: true
  backward_compatible: true
  context_activation: "development"
  cache_duration: "45m"
  lazy_loading: true
---

# Development Context Guidelines

## Extends: ../GUIDELINES.md

This document provides development-specific guidelines that apply when working in development contexts.

## Development-Specific Rules

### Hot Reloading and Development Server
```extend:development-server
/**
 * Development Server - Extension
 * Additional rules for development server usage
 */
// Always use npm start for local development with mock API
// Use npm run start:proxy when testing with real API endpoints
// Enable React Fast Refresh for optimal development experience
```

### Debug Configuration
```merge:debug-settings
/**
 * Debug Settings - Merge
 * Development-specific debug configurations
 */
// Required .env.local settings for development:
// REACT_APP_DEBUG_MIDDLEWARE=true
// REACT_APP_DEBUG_ORG_ADMIN=true
// REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
```

### Code Quality During Development
- Use ESLint warnings (not errors) for faster development iteration
- Run `npm run test:dev` in watch mode during active development
- Commit frequently with descriptive messages
- Use conventional commit format even for WIP commits

### Performance Considerations
- Prefer `console.warn` over `console.log` for development debugging
- Use React DevTools Profiler for performance analysis
- Monitor bundle size during development (`npm run build` occasionally)

<!-- CONTEXT_ACTIVE: development -->
<!-- CONFLICT_EXTENDED: debug-configuration -->
<!-- CONFLICT_MERGED: development-server-setup --> 