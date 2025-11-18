# Contributing Guide

Thank you for your interest in contributing to the Astronomy Discovery Game! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project standards and conventions

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m "Add feature: description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Workflow

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(annotations): add polygon annotation tool

Implement polygon drawing tool for more precise object marking.
Includes tests and documentation updates.

Closes #123
```

## Code Standards

### TypeScript

- Use strict TypeScript
- Define interfaces for all data structures
- Avoid `any` type
- Use meaningful variable names
- Add JSDoc comments for functions

### React

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for props
- Follow naming conventions (PascalCase for components)

### Backend

- Use async/await for asynchronous code
- Handle errors properly
- Validate all inputs
- Write secure code (no SQL injection, XSS, etc.)

### Code Formatting

- Use ESLint and Prettier
- Run `npm run lint` before committing
- Configure your editor to format on save

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Writing Tests

- Write tests for new features
- Maintain test coverage above 70%
- Test edge cases and error conditions
- Use descriptive test names

Example:
```typescript
describe('Annotation Service', () => {
  it('should create a point annotation', async () => {
    // Test implementation
  });

  it('should reject invalid coordinates', async () => {
    // Test implementation
  });
});
```

## Pull Request Process

1. **Update Documentation**: Update README.md, API.md, or other docs if needed
2. **Add Tests**: Include tests for new functionality
3. **Check Linting**: Ensure `npm run lint` passes
4. **Run Tests**: Ensure all tests pass
5. **Update Changelog**: Add entry to CHANGELOG.md
6. **Describe Changes**: Write clear PR description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings
```

## Feature Requests

1. Check existing issues first
2. Create new issue with `feature` label
3. Describe the feature and use case
4. Discuss with maintainers before implementing

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, versions)

## Development Setup

See [README.md](../README.md) for detailed setup instructions.

## Architecture Guidelines

### Frontend
- Components in `src/components/`
- Pages in `src/pages/`
- Services for API calls in `src/services/`
- State management with Zustand
- Styling with Tailwind CSS

### Backend
- Controllers for request handling
- Services for business logic
- Models for database schemas
- Middleware for cross-cutting concerns
- Utils for helper functions

## Security

- Never commit secrets or API keys
- Use environment variables
- Report security issues privately
- Follow OWASP guidelines

## Questions?

- Open an issue for discussion
- Check existing documentation
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
