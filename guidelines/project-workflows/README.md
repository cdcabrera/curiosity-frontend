---
guideline_version: "1.0.0"
priority: 3
applies_to: ["*.js", "*.jsx", "*.ts", "*.tsx", "*.json"]
contexts: ["development", "product-config"]
extends: ["../../GUIDELINES.md"]
last_updated: "2025-07-02"
compatibility:
  min_version: "1.0.0"
  max_version: "2.0.0"
agent_hints:
  processing_order: "top_down"
  validation_required: true
  key_concepts: ["product comparison", "openshift", "rhel", "product-config"]
  related_guidelines: ["guidelines/project-workflows/adding-openshift-product.md", "guidelines/project-workflows/adding-rhel-annual-variant.md"]
  importance: "medium"
  code_examples: true
---

# Product Configuration Comparison: OpenShift vs RHEL Annual Variants

> **NOTE:** This document is primarily intended for understanding the differences between product types. For implementation guidance, refer to the detailed workflow documents: `adding-openshift-product.md` and `adding-rhel-annual-variant.md` which contain complete step-by-step processes.

This document compares the configuration approaches for two different product types in the curiosity-frontend application:

1. **OpenShift Products** - Cloud services with usage-based metrics
2. **RHEL Annual Variants** - Traditional software with add-on support packages

## Key Differences

| Aspect | OpenShift Products | RHEL Annual Variants |
|--------|-------------------|----------------------|
| **Billing Model** | Usage-based (hourly/capacity) | Annual subscription |
| **Metrics Focus** | Resource consumption (cores, vCPUs, instance-hours) | System counts (sockets, cores) |
| **Product Group** | "openshift" | "rhel" |
| **Display Types** | HOURLY or CAPACITY | Standard |
| **API Identifiers** | Simple IDs ("rhacs", "rhods") | Complex patterns ("rhel-for-x86-els") |
| **Configuration** | Dedicated product files | Variant constants |
| **Chart Display** | Usage over time | Inventory counts |

## Implementation Approach

### OpenShift Products

1. **Full Product Files**: Each OpenShift product has a complete configuration file (`src/config/product.{productId}.js`)
2. **Chart Configuration**: Focused on usage metrics with daily/monthly aggregation
3. **Display Types**:
   - `DISPLAY_TYPES.HOURLY` - For pure usage-based billing
   - `DISPLAY_TYPES.CAPACITY` - For prepaid/on-demand hybrid models
4. **Metrics**: Track dynamic usage (cores, vCPUs, instance-hours)
5. **Inventory Display**: Show instances with usage metrics and billing data

### RHEL Annual Variants

1. **Constants-Only**: RHEL variants are added as constants and use shared base configurations
2. **Shared Configuration**: All variants use the same base RHEL configuration with minimal customization
3. **Display Type**: All use standard display (non-hourly, non-capacity)
4. **Metrics**: Focus on static inventory counts (sockets, cores)
5. **Inventory Display**: System information with hardware details

## Interactive Configuration Process

### OpenShift Product Questions

1. Product ID (e.g., "rhacs", "rhods", "rosa")
2. Product long/full name
3. Product short name
4. Product display type (hourly vs capacity)
5. Reference to existing product config template
6. Metrics to display (cores, vCPUs, instance-hours)
7. Custom metric display names

### RHEL Variant Questions

1. Product ID for the variant (e.g., "RHEL for x86", "rhel-for-x86-eus")
2. Product variant complete long/full name
3. Product variant short name

## Technical Implementation Details

### OpenShift Products

```javascript
// Example structure (simplified)
const config = {
  productGroup: 'openshift',
  productId: 'example-product',
  productDisplay: DISPLAY_TYPES.HOURLY, // or CAPACITY
  initialGraphFilters: [
    { metric: RHSM_API_PATH_METRIC_TYPES.CORES, /* chart config */ }
  ],
  // Full configuration with inventory, toolbar, etc.
};
```

### RHEL Annual Variants

```javascript
// Example structure (simplified)
const RHSM_API_PATH_PRODUCT_VARIANT_RHEL_TYPES = {
  RHEL_X86: 'RHEL for x86',
  RHEL_X86_ELS: 'rhel-for-x86-els',
  // Just constants, configuration lives elsewhere
};
```

## Localization Patterns

### OpenShift Products

```json
{
  "curiosity-view": {
    "title_example-product": "Red Hat OpenShift Example Product",
    "subtitle_example-product": "Example Product",
    "description_example-product": "Monitor your Example Product usage."
  }
}
```

### RHEL Annual Variants

```json
{
  "curiosity-toolbar": {
    "label_groupVariant_rhel-for-x86-els": "RHEL for x86 ELS Annual"
  },
  "curiosity-view": {
    "title_rhel-for-x86-els": "Red Hat Enterprise Linux for x86 Extended Life Support",
    "subtitle_rhel-for-x86-els": "$t(curiosity-view.subtitle_RHEL)",
    "description_rhel-for-x86-els": "$t(curiosity-view.description_RHEL)"
  }
}
```

## Implementation Steps Comparison

### OpenShift Products

1. Add product constant to `rhsmConstants.js`
2. Update JSDoc type annotations in multiple locations
3. Create complete product configuration file
4. Add localization entries
5. Update Jest snapshots
6. Run ESLint and fix formatting
7. Run tests to verify

### RHEL Annual Variants

1. Add variant constant to `rhsmConstants.js`
2. Update JSDoc type annotations in multiple locations 
3. Add localization entries
4. Update Jest snapshots
5. Run ESLint and fix formatting
6. Run tests to verify

## UI Representation

### OpenShift Products
- Displayed in OpenShift section of navigation
- Show usage graphs with daily/monthly aggregation
- Display instance inventory with usage metrics
- Often include billing provider information

### RHEL Annual Variants
- Displayed in RHEL section of navigation
- Show system counts by socket type
- Display system inventory with hardware details
- Often include subscription information

## Business Context

The different configuration approaches reflect the underlying business models:

- **OpenShift Products**: Cloud services with dynamic usage-based billing requiring detailed metrics and reporting
- **RHEL Annual Variants**: Traditional software with annual support subscriptions focusing on system counts

This comparison highlights how the application architecture adapts to represent different product types while maintaining a consistent user experience.
