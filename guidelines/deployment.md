---
guideline_version: "1.0.0"
priority: 3
applies_to: ["deploy/*", "*.yaml", "*.yml", "docker/*", ".tekton/*"]
contexts: ["deployment", "production", "staging"]
conflicts_with: []
extends: ["../GUIDELINES.md"]
last_updated: "2024-06-26"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  backward_compatible: true
  context_activation: "deployment_phase"
---

# Deployment Context Guidelines

## Extends: ../GUIDELINES.md

This document provides deployment-specific guidelines for production and staging environments.

## Deployment-Specific Rules

### Production Readiness
```override:production-requirements
/**
 * Production Requirements - Override
 * Strict production deployment requirements
 */
// Production deployment checklist:
// - All tests must pass (unit, integration, e2e)
// - Security scan results must be clean
// - Performance benchmarks must meet thresholds
// - Documentation must be up to date
// - Change logs must be updated
```

### Environment Management
```extend:environment-configuration
/**
 * Environment Configuration - Extension
 * Deployment environment management
 */
// Environment-specific configurations:
// - Production: Optimized builds, error reporting, monitoring
// - Staging: Production-like with additional debugging
// - Ephemeral: Feature branch deployments for testing
```

### Security Considerations
- Never expose debug information in production
- Use secure headers and CSP policies
- Implement proper authentication and authorization
- Regular security dependency updates
- Monitor for security vulnerabilities

### Monitoring and Observability
```merge:monitoring-setup
/**
 * Monitoring Setup - Merge
 * Production monitoring requirements
 */
// Monitoring and alerting:
// - Application performance monitoring (APM)
// - Error tracking and logging
// - User experience monitoring
// - Infrastructure monitoring
// - Business metrics tracking
```

### Rollback Strategy
```extend:rollback-procedures
/**
 * Rollback Procedures - Extension
 * Deployment rollback guidelines
 */
// Rollback procedures:
// 1. Identify deployment issues quickly
// 2. Have automated rollback mechanisms
// 3. Preserve user data during rollbacks
// 4. Communicate rollback status to stakeholders
// 5. Conduct post-rollback analysis
```

### Compliance and Governance
- Follow organizational deployment policies
- Maintain audit trails for all deployments
- Implement change approval processes
- Document deployment procedures
- Regular compliance reviews

<!-- CONTEXT_ACTIVE: deployment,production,staging -->
<!-- CONFLICT_OVERRIDE: production-requirements -->
<!-- CONFLICT_EXTENDED: rollback-procedures --> 