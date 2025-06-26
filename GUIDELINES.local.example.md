# Local Development Guidelines

## Extends: ./GUIDELINES.md

> **Note**: This file is an example of local guidelines that would be gitignored.
> Copy this to `GUIDELINES.local.md` and customize for your personal development preferences.

### Personal Development Preferences

#### IDE Configuration
- **Editor**: Cursor with specific extensions for React development
- **AI Assistant**: Enable GitHub Copilot with custom prompts for this project
- **Formatting**: 2-space indentation (override default 4-space from base guidelines)
- **Theme**: Dark mode with high contrast for accessibility
- **Font**: JetBrains Mono with ligatures enabled

#### Personal Workflow Overrides
- **Logging**: Enable verbose console logging in development mode
- **Debugging**: Enable all React DevTools extensions and profiling
- **Linting**: Allow `console.log` statements in development files
- **Testing**: Run tests in watch mode during development
- **Commits**: Use conventional commits with personal emoji preferences 🚀

### Team-Specific Patterns (if working in team)

#### Collaboration Requirements
- **Pair Programming**: Required for all Redux state management changes
- **Code Review**: Minimum 2 approvals for component architecture changes
- **Feature Flags**: Use feature flags for all new components during development
- **Performance**: Enable React profiling for all development builds

#### Team Communication
- **Slack Integration**: Post build status to #frontend-team channel
- **Documentation**: Update component documentation with each PR
- **Testing**: Screenshot testing required for visual component changes

### Environment-Specific Rules

#### MacOS Development Setup
```bash
# Package management
brew install node@18 yarn
brew install postgresql redis

# Development services
brew services start postgresql
brew services start redis

# IDE setup
code --install-extension ms-vscode.vscode-react-refactor
code --install-extension bradlc.vscode-tailwindcss
```

#### Windows Development Setup  
```bash
# Use chocolatey for package management
choco install nodejs yarn postgresql redis-64

# Use WSL2 for better Node.js compatibility
wsl --install
```

#### Docker Development
```yaml
# docker-compose.override.yml (also gitignored)
version: '3.8'
services:
  frontend:
    volumes:
      - ./src:/app/src:cached
      - ./.guidelines:/app/.guidelines:ro
      - ./node_modules:/app/node_modules:delegated
    environment:
      - DEBUG=*
      - GUIDELINES_LOCAL=true
      - REACT_APP_ENV=development
    ports:
      - "3000:3000"
      - "9229:9229"  # Node.js debugging port
```

### Personal Code Style Overrides

#### Allowed Deviations from Base Guidelines
- **Console Statements**: Allow `console.log`, `console.warn` in development files
- **Variable Naming**: Use shorter variable names in utility functions (`i`, `idx` vs `index`)
- **Import Organization**: Allow grouping utility imports differently for personal projects
- **Experimental Features**: Enable React 19 concurrent features for learning

#### Personal Preferences
```javascript
// Personal component structure preference
const MyComponent = ({ 
  // Group required props first
  title, 
  data,
  // Optional props with defaults
  isDisabled = false,
  theme = 'light',
  // Event handlers
  onSave,
  onCancel,
  // Spread props last
  ...otherProps 
}) => {
  // Personal hook organization preference
  const [localState, setLocalState] = useState();
  const [loading, setLoading] = useState(false);
  
  // Custom hooks
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Effects grouped by purpose
  useEffect(() => {
    // Initialization effects
  }, []);
  
  useEffect(() => {
    // Data fetching effects
  }, [data]);
  
  // Event handlers with verbose logging (personal preference)
  const handleSave = useCallback((event) => {
    console.log('💾 Saving data:', { data, user: user.id });
    if (typeof onSave === 'function') {
      onSave(event, data);
    }
  }, [onSave, data, user]);
  
  // Early returns for loading states
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="my-component" {...otherProps}>
      {/* Personal JSX organization preferences */}
    </div>
  );
};
```

### IDE-Specific Configuration

#### VS Code Settings (Personal)
```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.rules.customizations": [
    { "rule": "no-console", "severity": "off" }
  ],
  "guidelines.autoMerge": true,
  "guidelines.validateOnSave": true,
  "guidelines.showNotifications": true
}
```

#### Personal Git Configuration
```bash
# Personal git aliases for this project
git config alias.guidelines-check '!npm run guidelines:check'
git config alias.quick-commit '!f() { npm run guidelines:check && git add . && git commit -m "$1"; }; f'
git config alias.feature-start '!f() { git checkout -b feature/$1 && npm run guidelines:merge; }; f'
```

### Personal Testing Preferences

#### Test File Organization
```javascript
// Personal preference: group tests by component area
describe('MyComponent', () => {
  describe('Rendering', () => {
    // Visual rendering tests
  });
  
  describe('User Interactions', () => {
    // Event handling tests  
  });
  
  describe('Data Processing', () => {
    // Logic and data transformation tests
  });
  
  describe('Error States', () => {
    // Error handling and edge cases
  });
});
```

#### Debug Configuration
- **Verbose Test Output**: Show full test names and timing
- **Coverage Reports**: Generate detailed HTML coverage reports
- **Snapshot Debugging**: Show diff previews for snapshot failures
- **Watch Mode**: Auto-run tests for changed files only

### Personal Documentation Preferences

#### Component Documentation Template
```javascript
/**
 * @component MyComponent
 * @description [Personal description style: What it does, why it exists, how it fits]
 * @example
 * <MyComponent 
 *   title="Example" 
 *   onSave={(data) => console.log('Saved:', data)}
 * />
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - [Required] The component title
 * @param {Function} [props.onSave] - [Optional] Save callback (data) => void
 * @param {boolean} [props.isDisabled=false] - [Optional] Disable state
 * 
 * @since 1.2.0
 * @author Your Name
 * @lastmodified 2024-01-15
 */
```

---

## How to Use This File

1. **Copy this file**: `cp GUIDELINES.local.example.md GUIDELINES.local.md`
2. **Customize sections**: Modify the preferences to match your development style
3. **Merge guidelines**: Run `npm run guidelines:merge` to generate combined guidelines
4. **Validate setup**: Run `npm run guidelines:check` to ensure compliance
5. **Update as needed**: Modify `GUIDELINES.local.md` whenever your preferences change

## Integration with Development Workflow

```bash
# Daily workflow with local guidelines
npm run guidelines:merge    # Merge local preferences with base guidelines
npm run dev                 # Start development with merged guidelines
npm run guidelines:check    # Validate code against merged guidelines before committing
``` 