# Contributing to N8N Clone

Thank you for contributing to the N8N Clone project! This guide will help you maintain consistency and quality across all contributions.

## 📚 Chapter-Based Development

This project follows a **chapter-based development approach**, where each major feature or milestone is completed as a chapter. Each chapter should:

1. Have clear objectives documented in README.md
2. Be developed in a separate branch (`chapter-X-feature-name`)
3. Include comprehensive documentation
4. Have a detailed summary document (`CHAPTER_X_SUMMARY.md`)

## 🌿 Branch Naming Convention

```
chapter-X-feature-name
├── chapter-1-project-setup
├── chapter-2-database-orm
├── chapter-3-authentication
└── chapter-4-workflow-engine
```

For bug fixes or small improvements:
```
fix/description
hotfix/critical-issue
docs/update-readme
refactor/component-name
```

## 💬 Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```bash
# Feature
git commit -m "feat(auth): add bcrypt password hashing"

# Bug fix
git commit -m "fix(prisma): resolve connection pool timeout"

# Documentation
git commit -m "docs: update Chapter 2 security section"

# Refactor
git commit -m "refactor(db): extract auth helpers to separate file"

# Multiple changes
git commit -m "feat(auth): implement user authentication

- Add password hashing with bcrypt
- Create auth helper functions
- Add test utilities for user creation
- Update security documentation"
```

## 🔄 Pull Request Process

### 1. Create Feature Branch

```bash
git checkout -b chapter-X-feature-name
```

### 2. Make Changes

- Write clean, documented code
- Follow TypeScript best practices
- Add comments for complex logic
- Update relevant documentation

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Format code
npm run format

# Test build
npm run build

# Test Prisma (if database changes)
npx prisma generate
npx prisma db push
```

### 4. Commit Changes

```bash
git add .
git commit -m "type(scope): description"
```

### 5. Update Documentation

**Always update:**
- [ ] `README.md` - Mark chapter tasks as complete
- [ ] Create/update `CHAPTER_X_SUMMARY.md` with detailed summary
- [ ] Update inline code comments
- [ ] Add JSDoc comments to functions

### 6. Push and Create PR

```bash
git push -u origin chapter-X-feature-name
```

Then create PR on GitHub with:
- Descriptive title following chapter naming
- Fill out the PR template completely
- Link related issues
- Add appropriate labels

### 7. CodeRabbit Review

CodeRabbit will automatically:
- ✅ Review your code
- 📊 Generate diagrams and visualizations
- 📝 Create comprehensive summaries
- 🔍 Identify security issues
- 💡 Suggest improvements

**Respond to CodeRabbit:**
- Address security concerns immediately
- Consider performance suggestions
- Fix typing issues
- Reply to questions with context

### 8. Human Review

Wait for team review:
- Address all comments
- Make requested changes
- Re-request review after updates

### 9. Merge

Once approved:
- Use "**Create a merge commit**" to preserve chapter history
- Delete branch after merge
- Pull latest main locally

## 📋 PR Template Checklist

When creating a PR, ensure you complete:

- [ ] Description of changes
- [ ] Chapter/feature identification
- [ ] List of changes made
- [ ] Technical details (stack, config, database)
- [ ] Testing instructions
- [ ] Documentation updates
- [ ] Security checklist passed
- [ ] No sensitive data in commits

## 🔐 Security Guidelines

**Never commit:**
- `.env` files with real credentials
- API keys or secrets
- Database passwords
- Private keys

**Always:**
- Use environment variables for secrets
- Hash passwords with bcrypt (never store plaintext)
- Validate user inputs
- Use Prisma's parameterized queries
- Exclude password fields from API responses

## 🎨 Code Style

### TypeScript

```typescript
// ✅ Good
export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const hashedPassword = await hashPassword(password);
  // ...
}

// ❌ Bad
export async function createUser(e: any, n: any, p: any) {
  // ...
}
```

### File Organization

```
src/
├── app/              # Next.js pages and API routes
├── components/       # React components
│   └── ui/          # Shadcn UI components
├── lib/             # Utilities, helpers, clients
│   ├── db.ts        # Prisma client
│   ├── auth.ts      # Auth helpers
│   ├── password.ts  # Password utilities
│   └── utils.ts     # General utilities
└── hooks/           # Custom React hooks
```

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase.tsx`
- **Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

## 🧪 Testing

Currently manual testing. Future chapters will add:
- Unit tests (Jest/Vitest)
- Integration tests (Playwright)
- E2E tests

For now, ensure:
- All features work locally
- Database operations complete successfully
- No TypeScript errors
- No console errors in browser

## 📚 Documentation Standards

### Code Comments

```typescript
/**
 * Hash a plaintext password using bcrypt
 * @param password - The plaintext password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
```

### Chapter Summaries

Each chapter summary should include:
1. Overview and objectives
2. Key technical changes
3. Code examples
4. Testing checklist
5. Issues resolved
6. Metrics (files changed, lines added/removed)
7. Security considerations
8. Next steps

## 🚀 Deployment

(To be defined in future chapters)

## 📞 Getting Help

- Check existing chapter summaries
- Review PR comments from CodeRabbit
- Ask questions in PR comments
- Reference the README for project overview

## 🎯 Quality Standards

Before marking a chapter complete:

- [ ] All objectives from README checklist met
- [ ] Code is properly typed (no `any` types)
- [ ] Functions have JSDoc comments
- [ ] Security best practices followed
- [ ] Documentation is comprehensive
- [ ] Chapter summary created
- [ ] PR template filled completely
- [ ] All tests passing
- [ ] CodeRabbit review addressed
- [ ] Human review approved

---

Thank you for contributing! Your attention to detail and documentation helps make this project maintainable and educational. 🙌
