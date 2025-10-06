# Contributing to STEM Hub

Thank you for your interest in contributing to STEM Hub! 🎉

This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. By participating in this project, you agree to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ and npm installed
- **Git** for version control
- A **GitHub account**
- A **Supabase account** (free tier is fine)
- A code editor (VS Code recommended)

### Areas We Need Help

See the [README.md](README.md#-contributing) for a comprehensive list of areas needing contribution. Priority areas include:

🔴 **High Priority**:
- Authentication bug fixes
- Testing (unit, integration, E2E)
- Core bug fixes

🟡 **Medium Priority**:
- API development
- UX improvements
- Performance optimization

🟢 **Low Priority**:
- New features
- Content creation
- Documentation

---

## Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stem-hub.git
   cd stem-hub
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/stem-hub.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials.

6. **Set up the database**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run `supabase/schema.sql`
   - Then run `supabase/schema_phase2.sql`

7. **Run the development server**:
   ```bash
   npm run dev
   ```

8. **Create an admin user** (manually in Supabase):
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

---

## Project Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **State Management**: React Context + Server State

### Key Directories

```
src/
├── app/              # Next.js app directory (pages and routes)
├── components/       # Reusable React components
├── lib/             # Utility functions and helpers
├── middleware/      # Custom middleware (auth, RBAC)
├── types/           # TypeScript type definitions
└── store/           # State management (if needed)
```

### Database Schema

We use Supabase (PostgreSQL) with 25+ tables including:

**Core Tables**:
- `users` - User accounts with roles
- `exam_boards` - Exam board data
- `subjects` - Subjects linked to exam boards
- `topics` - Topics linked to subjects

**Content Tables**:
- `notes` - Study notes
- `quizzes` - Quiz metadata
- `quiz_questions` - Individual questions
- `past_papers` - Past examination papers

**Profile Tables**:
- `student_profiles`
- `contributor_profiles`
- `admin_actions`

See `supabase/schema.sql` for the complete schema.

---

## How to Contribute

### 1. Find an Issue

- Browse [open issues](https://github.com/ORIGINAL_OWNER/stem-hub/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Or propose a new feature by creating an issue first

### 2. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update types if needed
- Test your changes locally

### 4. Commit Your Changes

```bash
git add .
git commit -m "Type: Brief description"
```

**Commit message format**:
```
Type: Brief description (max 50 chars)

Detailed explanation if needed (wrap at 72 chars).
Include motivation for the change and contrast with previous behavior.

Closes #123
```

**Types**:
- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Update existing feature
- `Remove:` - Remove feature
- `Refactor:` - Code refactoring
- `Docs:` - Documentation changes
- `Test:` - Adding tests
- `Style:` - Code style changes

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

- Go to your fork on GitHub
- Click "Compare & pull request"
- Fill out the PR template
- Link related issues
- Request review

---

## Pull Request Process

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (when testing is set up)
- [ ] New code has been tested locally
- [ ] Comments added for complex logic
- [ ] Types updated if needed
- [ ] No console.log statements left (use proper logging)
- [ ] Documentation updated if needed
- [ ] PR description clearly explains changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any other information
```

### Review Process

1. **Automated checks**: CI/CD will run (when set up)
2. **Code review**: Maintainers will review your code
3. **Changes requested**: Address feedback if needed
4. **Approval**: Once approved, your PR will be merged
5. **Cleanup**: Delete your feature branch after merge

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes
- Use type aliases for unions/complex types

```typescript
// Good
interface User {
  id: string;
  email: string;
  role: 'student' | 'contributor' | 'admin';
}

// Bad
const user: any = { ... };
```

### React Components

- Use functional components
- Use React Hooks (not class components)
- Keep components small and focused
- Extract reusable logic into custom hooks

```typescript
// Good
export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  const [state, setState] = useState();
  
  return <div>...</div>;
}

// Bad
export default class MyComponent extends React.Component { ... }
```

### File Naming

- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Pages**: lowercase (e.g., `dashboard/page.tsx`)
- **Types**: PascalCase (e.g., `User.ts`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use arrow functions
- Use template literals for string interpolation

```typescript
// Good
const greeting = `Hello, ${name}!`;
const add = (a: number, b: number) => a + b;

// Bad
const greeting = "Hello, " + name + "!";
function add(a, b) { return a + b; }
```

### Imports

- Group imports by type (external, internal, relative)
- Sort alphabetically within groups

```typescript
// External packages
import React from 'react';
import { useRouter } from 'next/navigation';

// Internal modules
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

// Relative imports
import { formatDate } from './utils';
```

---

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Use Jest and React Testing Library
- Aim for >80% code coverage

```typescript
describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate(new Date('2025-10-06'));
    expect(result).toBe('October 6, 2025');
  });
});
```

### Integration Tests

- Test API routes
- Test database interactions
- Mock external services

### E2E Tests

- Test critical user flows
- Use Playwright or Cypress
- Test on multiple browsers

---

## Documentation

### Code Comments

- Add comments for complex logic
- Explain "why" not "what"
- Use JSDoc for functions

```typescript
/**
 * Calculate the user's progress percentage for a subject
 * 
 * @param completedTopics - Number of topics completed
 * @param totalTopics - Total number of topics in subject
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(
  completedTopics: number, 
  totalTopics: number
): number {
  if (totalTopics === 0) return 0;
  return Math.round((completedTopics / totalTopics) * 100);
}
```

### README Updates

- Update README.md when adding features
- Add new sections if needed
- Keep it concise and clear

### API Documentation

- Document API endpoints
- Include request/response examples
- Document error codes

---

## Questions?

If you have questions:

1. Check existing [documentation](README.md)
2. Search [closed issues](https://github.com/ORIGINAL_OWNER/stem-hub/issues?q=is%3Aissue+is%3Aclosed)
3. Open a new issue with the `question` label
4. Reach out to maintainers

---

## Thank You! 🙏

Your contributions make STEM Hub better for students across Africa. We appreciate your time and effort!

---

*Last updated: October 6, 2025*
