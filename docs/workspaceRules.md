# TasteMatch Workspace Rules & Guidelines

## Overview

This document defines the coding standards, workflows, and collaboration guidelines for the TasteMatch development team. Following these rules ensures consistency, quality, and efficient collaboration.

## Naming Conventions

### File and Directory Naming

#### Files
- **Components**: `PascalCase.tsx` (e.g., `SearchBar.tsx`, `DishCard.tsx`)
- **Hooks**: `camelCase.ts` with `use` prefix (e.g., `useSearch.ts`, `useAuth.ts`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`, `validateEmail.ts`)
- **Types**: `camelCase.ts` (e.g., `dishTypes.ts`, `apiTypes.ts`)
- **Constants**: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`, `FLAVOR_TAGS.ts`)
- **Test files**: `ComponentName.test.tsx` or `fileName.test.ts`
- **Story files**: `ComponentName.stories.tsx`

#### Directories
- **Components**: `kebab-case` (e.g., `search-components`, `shared-ui`)
- **Pages**: `kebab-case` (e.g., `search-page`, `profile-page`)
- **Utils**: `kebab-case` (e.g., `api-utils`, `format-helpers`)

### Code Naming

#### Variables and Functions
```typescript
// Use camelCase for variables and functions
const userFavorites = [];
const getDishById = (id: string) => { ... };
const isSpicyFood = true;
```

#### Constants
```typescript
// Use UPPER_SNAKE_CASE for constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_BASE_URL = 'https://api.tastematch.com';
const DEFAULT_SPICE_LEVEL = 0;
```

#### Classes and Interfaces
```typescript
// Use PascalCase for classes and interfaces
class DishService { ... }
interface UserProfile { ... }
type FlavorProfile = { ... };
```

#### Enums
```typescript
// Use PascalCase for enums
enum SpiceLevel {
  None = 0,
  Mild = 1,
  Medium = 2,
  Hot = 3,
  VeryHot = 4,
  Extreme = 5
}
```

#### Database Naming
```sql
-- Tables: snake_case plural
CREATE TABLE user_favorites (...);
CREATE TABLE dish_reviews (...);

-- Columns: snake_case
user_id, created_at, spice_level, flavor_profile;

-- Indexes: descriptive naming
idx_dishes_restaurant_id
idx_favorites_user_id
```

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use functional components and hooks (React)
- Avoid default exports unless necessary

### React Components
```typescript
// Component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

export const ComponentName: React.FC<ComponentProps> = ({
  title,
  onAction,
  isLoading = false
}) => {
  // Hooks at the top
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = useCallback(() => {
    onAction();
  }, [onAction]);
  
  // Render
  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};
```

### CSS/Tailwind
- Use Tailwind utility classes
- Create custom components for repeated patterns
- Follow mobile-first responsive design
- Use semantic HTML elements

## Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without functional changes
- `test`: Adding or updating tests
- `chore`: Build process, dependency updates, etc.

### Examples
```
feat(search): implement spice level filter

Add visual spice meter component with 0-5 scale
and integrate with search API. Users can now filter
dishes by desired heat level.

Closes #123

---

feat(auth): add user profile management

Implement profile CRUD operations with form validation
and avatar upload functionality.

Closes #145

---

fix(api): resolve CORS issues in production

Update CORS configuration to allow production
frontend URL and proper credentials handling.

Fixes #167
```

### Subject Line Rules
- Use present tense ("add" not "added")
- Use lower case
- No period at end
- Keep under 50 characters

### Body Rules
- Wrap at 72 characters
- Explain what and why, not how
- Use bullet points for multiple changes

## Branching Strategy

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features
- **staging**: Pre-production testing branch

### Feature Branches
```
feat/<feature-name>
feat/spice-meter-filter
feat/photo-upload-system
feat/community-forums
```

### Bug Fix Branches
```
fix/<bug-description>
fix/cors-issues
fix/search-performance
fix/mobile-layout-bug
```

### Hotfix Branches
```
hotfix/<urgent-fix>
hotfix/security-patch
hotfix/critical-bug-fix
```

### Release Branches
```
release/v1.2.0
release/v2.0.0
```

### Branch Protection Rules
- **main**: Requires PR approval and CI/CD pass
- **develop**: Requires PR approval and CI/CD pass
- **staging**: Requires manual approval for deployment

### Workflow
1. Create feature branch from `develop`
2. Develop and test locally
3. Push to remote feature branch
4. Create PR to `develop`
5. Code review and required approvals
6. Merge to `develop`
7. Deploy to staging for testing
8. Create release branch from `develop`
9. Deploy release to production
10. Merge release to `main` and `develop`

## Pull Request Process

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123, #456

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing passed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional context for reviewers.
```

### Review Requirements
- **Minimum 1 reviewer** for small changes
- **Minimum 2 reviewers** for major features
- **Tech lead approval** for breaking changes
- **All CI checks must pass**
- **Code coverage > 80%** for new code

### Review Process
1. **Automated Checks**: Linting, tests, build
2. **Self-Review**: Author reviews own changes
3. **Peer Review**: Team member reviews code
4. **Tech Review**: Tech lead reviews architecture
5. **QA Review**: QA team tests functionality

### Review Guidelines
- Focus on logic, not style (automated tools handle style)
- Provide specific, actionable feedback
- Ask questions instead of making demands
- Suggest improvements, don't just point out problems
- Consider performance and security implications

## Code Review Best Practices

### For Authors
- Keep PRs focused and reasonably sized
- Write clear commit messages
- Update documentation
- Include tests for new functionality
- Address feedback promptly

### For Reviewers
- Review within 24 hours
- Be constructive and respectful
- Explain reasoning behind suggestions
- Check for edge cases and error handling
- Verify tests cover new code

## Development Workflow

### Setup
1. Fork repository
2. Clone fork locally
3. Add upstream remote
4. Create feature branch
5. Set up development environment

### Daily Workflow
1. Pull latest changes from upstream
2. Create/switch to feature branch
3. Write code following guidelines
4. Run tests and linting
5. Commit with proper message
6. Push to remote branch
7. Create/update PR

### Before Commit
```bash
# Run all checks
npm run lint
npm run test
npm run type-check
npm run build

# Format code
npm run format

# Stage and commit
git add .
git commit -m "feat(component): add new feature"
```

## Testing Guidelines

### Unit Tests
- Test all public functions and methods
- Mock external dependencies
- Use descriptive test names
- Test edge cases and error conditions

### Integration Tests
- Test API endpoints
- Test database operations
- Test component interactions
- Test user workflows

### E2E Tests
- Test critical user journeys
- Test cross-browser compatibility
- Test mobile responsiveness
- Test performance under load

### Test Structure
```typescript
describe('ComponentName', () => {
  describe('when user interacts', () => {
    it('should perform expected behavior', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Documentation Standards

### Code Documentation
- Document public APIs
- Explain complex algorithms
- Document configuration options
- Include usage examples

### README Updates
- Update feature list
- Update setup instructions
- Update environment variables
- Update deployment instructions

### API Documentation
- Keep OpenAPI spec current
- Document all endpoints
- Include request/response examples
- Document error responses

## Security Guidelines

### Code Security
- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines

### Review Security
- Check for SQL injection risks
- Verify input sanitization
- Review authentication logic
- Check data exposure risks
- Validate permissions

## Performance Guidelines

### Frontend Performance
- Optimize images and assets
- Implement lazy loading
- Use code splitting
- Monitor bundle size
- Optimize render performance

### Backend Performance
- Optimize database queries
- Implement caching
- Use connection pooling
- Monitor response times
- Implement rate limiting

## Release Process

### Versioning
- Use semantic versioning (SemVer)
- Update version in package.json
- Create git tag for release
- Update changelog

### Deployment Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Performance tests pass
- [ ] Security scan completed
- [ ] Rollback plan ready

## Tools and Configuration

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- VS Code (recommended)

### VS Code Extensions
- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense
- GitLens

### Git Hooks
- Pre-commit: lint and format
- Pre-push: run tests
- Commit-msg: validate format

### CI/CD Pipeline
- Automated testing
- Code quality checks
- Security scanning
- Performance monitoring
- Automated deployment

## Troubleshooting

### Common Issues
- **Linting errors**: Run `npm run lint -- --fix`
- **Type errors**: Check TypeScript configuration
- **Test failures**: Check test setup and mocks
- **Build failures**: Check dependencies and environment

### Getting Help
- Check documentation first
- Ask in team channels
- Create issue with detailed description
- Include error logs and steps to reproduce

## Enforcement

### Automated Enforcement
- ESLint rules
- TypeScript strict mode
- Pre-commit hooks
- CI/CD checks

### Manual Enforcement
- Code reviews
- Team lead approval
- Regular audits
- Training sessions

### Consequences
- PR blocked for non-compliance
- Required rework for style violations
- Additional review for repeat offenders
- Team training for persistent issues

---

**Note**: These guidelines are living documents. They will be updated as the project evolves and team needs change. All team members should review these guidelines regularly and suggest improvements.
