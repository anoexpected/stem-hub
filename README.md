# 🚀 STEM Hub

> **Empowering Africa's Next Generation of Innovators**

A comprehensive AI-ready EdTech platform focused exclusively on STEM education (Mathematics, Physics, Chemistry, Biology, and Computer Science) for African students at O & A levels.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red)]()

---

## 📋 Table of Contents

- [About](#-about)
- [Current Status](#-current-status)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Known Issues](#-known-issues)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🎯 About

STEM Hub is inspired by **Strive Masiyiwa's call for proactive innovation in education**. Our mission is to:

- ✅ Democratize access to **syllabus-aligned STEM resources**
- ✅ Foster **peer-to-peer learning and community support**
- ✅ Enable **AI-driven personalized learning** grounded in local curricula
- ✅ Close the innovation gap by preparing Africa's next generation of problem-solvers

### Supported Exam Boards

We currently support **11 major African and international exam boards**:
- ZIMSEC (Zimbabwe)
- WAEC (West African Examinations Council)
- IGCSE/Cambridge (International)
- KCSE (Kenya)
- NECTA (Tanzania)
- UNEB (Uganda)
- ESLCE (Ethiopia)
- And more...

---

## 📊 Current Status

**Phase:** MVP Development (October 2025)  
**Version:** 0.1.0 (Pre-release)

| Component | Status | Progress |
|-----------|--------|----------|
| **Student Platform** | ✅ Complete | 100% |
| **Contributor Platform** | ✅ Complete | 100% |
| **Admin Dashboard** | ✅ Complete | 100% |
| **Authentication** | ⚠️ Functional (needs refinement) | 85% |
| **Database Schema** | ✅ Complete | 100% |
| **File Storage** | ✅ Complete | 100% |
| **API Endpoints** | ⚠️ Core complete (needs expansion) | 70% |
| **Testing** | ❌ Not started | 0% |
| **Documentation** | ⚠️ Internal only | 40% |

**Overall Platform Status:** 🟡 **MVP READY** (requires testing & bug fixes before production)

---

## ✨ Features

### For Students
- 📚 **Study Notes**: Rich-text notes with LaTeX math equations and images
- 📝 **Interactive Quizzes**: MCQ-based quizzes with instant feedback
- 📄 **Past Papers**: Download and practice with past examination papers
- 🎯 **Personalized Dashboard**: Track progress by subject and topic
- 🏆 **Gamification**: XP points, badges, and achievement system
- 👥 **Study Groups**: Create and join collaborative study groups
- 💬 **Forums**: Ask questions and help fellow students
- 🤖 **AI Tutor** (Coming Soon): Get instant help with homework

### For Contributors
- ✍️ **Rich Text Editor**: Create notes with TipTap editor (LaTeX, images, formatting)
- 🧪 **Quiz Creator**: Build quizzes with multiple-choice questions
- 📤 **Content Upload**: Submit past papers and study materials
- 📊 **Analytics Dashboard**: Track views, likes, and impact of your content
- 📝 **Draft Management**: Save and manage content before submission
- ✅ **Submission Tracking**: Monitor review status of submitted content

### For Admins
- 🔍 **Review Queue**: Approve or reject submitted content
- 👥 **User Management**: Manage users and assign roles
- 📊 **Analytics**: Platform-wide statistics and insights
- 🏫 **Exam Board Management**: Configure exam boards, subjects, and topics
- 📋 **Content Moderation**: Ensure quality and syllabus alignment
- 🔒 **Role-Based Access Control**: Secure admin functions

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript 5.0+
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4
- **Components**: Custom + Shadcn UI patterns
- **Rich Text**: TipTap (Prosemirror-based)
- **Math Rendering**: KaTeX + react-katex
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Notifications**: React Hot Toast

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (OAuth + Email/Password)
- **Storage**: Supabase Storage (images, PDFs)
- **API**: Next.js API Routes (Server Actions)
- **ORM**: Supabase Client SDK

### DevOps & Tools
- **Hosting**: Vercel (planned)
- **Database Hosting**: Supabase Cloud
- **Version Control**: Git + GitHub (private)
- **Package Manager**: npm
- **Code Quality**: ESLint + TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stem-hub.git
   cd stem-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Run the schema in your Supabase SQL editor:
   ```bash
   # Navigate to Supabase Dashboard > SQL Editor
   # Copy and execute: supabase/schema.sql
   # Then execute: supabase/schema_phase2.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### First-Time Setup

After running the app:

1. **Create an admin user**: Sign up with any email
2. **Manually set role to admin** in Supabase:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. **Access admin dashboard**: Navigate to `/admin`

---

## 📁 Project Structure

```
stem-hub/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── admin/               # Admin dashboard pages
│   │   ├── auth/                # Authentication pages
│   │   ├── contribute/          # Contributor platform
│   │   ├── dashboard/           # Student dashboard
│   │   ├── learn/               # Learning pages
│   │   ├── notes/               # Notes pages
│   │   ├── quizzes/             # Quiz pages
│   │   ├── past-papers/         # Past papers pages
│   │   ├── api/                 # API routes
│   │   └── ...                  # Other pages
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # UI components
│   │   ├── features/            # Feature-specific components
│   │   └── AuthErrorHandler.tsx
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── supabase/           # Supabase client and utilities
│   │   ├── storage.ts          # File storage utilities
│   │   └── permissions.ts      # Permission helpers
│   │
│   ├── middleware/              # Custom middleware
│   │   └── requireRole.ts      # Role-based access control
│   │
│   ├── store/                   # State management
│   └── types/                   # TypeScript types
│
├── supabase/                    # Database schemas and migrations
│   ├── schema.sql              # Main database schema
│   ├── schema_phase2.sql       # Phase 2 enhancements
│   └── migrations/             # Database migrations
│
├── public/                      # Static assets
├── scripts/                     # Deployment and utility scripts
└── docs/                        # Additional documentation

```

---

## 🤝 Contributing

**⚠️ This project is currently in active development and is not yet stable.**

We welcome contributions! However, please note that the codebase is evolving rapidly and there are known issues (see below).

### Areas Needing Contribution

#### 🔴 High Priority

1. **Authentication & Authorization**
   - [ ] Fix OAuth callback errors (Google, GitHub)
   - [ ] Implement proper session management
   - [ ] Fix role-based routing inconsistencies
   - [ ] Add password reset functionality
   - [ ] Add email verification flow
   - [ ] Fix infinite recursion in RLS policies

2. **Testing**
   - [ ] Set up testing framework (Jest, React Testing Library)
   - [ ] Write unit tests for core functions
   - [ ] Write integration tests for API routes
   - [ ] Write E2E tests for critical user flows
   - [ ] Set up CI/CD pipeline

3. **Bug Fixes**
   - [ ] Fix TipTap editor hydration issues (partially resolved)
   - [ ] Fix contributor invitation system
   - [ ] Fix student onboarding flow
   - [ ] Fix quiz submission and grading
   - [ ] Fix file upload error handling

#### 🟡 Medium Priority

4. **API Development**
   - [ ] Standardize API response format
   - [ ] Add proper error handling to all endpoints
   - [ ] Implement rate limiting
   - [ ] Add API documentation (Swagger/OpenAPI)
   - [ ] Add pagination to list endpoints
   - [ ] Add search and filtering capabilities

5. **User Experience**
   - [ ] Improve error messages and user feedback
   - [ ] Add loading states throughout the app
   - [ ] Implement proper form validation
   - [ ] Add accessibility features (ARIA labels, keyboard navigation)
   - [ ] Improve mobile responsiveness
   - [ ] Add dark mode support

6. **Performance**
   - [ ] Optimize database queries (add indexes)
   - [ ] Implement caching strategy (Redis/Vercel KV)
   - [ ] Optimize image loading (next/image)
   - [ ] Implement code splitting
   - [ ] Add performance monitoring (Vercel Analytics)

#### 🟢 Low Priority (Future)

7. **Features**
   - [ ] Implement AI tutor (Google Gemini integration)
   - [ ] Add real-time collaboration (study groups)
   - [ ] Add video content support
   - [ ] Add mobile app (React Native)
   - [ ] Add offline mode
   - [ ] Add internationalization (i18n)

8. **Content**
   - [ ] Seed database with more sample content
   - [ ] Create contributor onboarding guides
   - [ ] Create student onboarding guides
   - [ ] Add more exam boards
   - [ ] Add more subjects and topics

### How to Contribute

1. **Check existing issues** or create a new one
2. **Fork the repository**
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** and commit: `git commit -m "Add: your feature description"`
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Open a Pull Request** with a clear description

### Contribution Guidelines

- Follow existing code style (TypeScript, functional components)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation if needed
- Test your changes thoroughly before submitting
- Keep PRs focused on a single feature or fix

---

## ⚠️ Known Issues

### Critical Issues

1. **Authentication**
   - OAuth callback sometimes redirects to wrong page
   - Role assignment during signup is inconsistent
   - Session persistence issues on page refresh
   - RLS policies have infinite recursion risk

2. **Database**
   - Some queries are not optimized (N+1 problem)
   - Missing indexes on frequently queried columns
   - Foreign key relationships need cleanup

3. **User Flows**
   - Contributor invitation system incomplete
   - Student onboarding skippable without completing
   - Admin user creation requires manual database update

### Minor Issues

4. **UI/UX**
   - Some pages not mobile-responsive
   - Error messages not user-friendly
   - Loading states missing in places
   - Inconsistent styling across pages

5. **Content Creation**
   - Image upload validation weak
   - LaTeX preview sometimes lags
   - Quiz question ordering not saveable
   - Past paper metadata incomplete

### Technical Debt

6. **Code Quality**
   - Many TODO comments in codebase
   - Duplicate code in API routes
   - Type definitions scattered across files
   - Missing error boundaries
   - Inconsistent naming conventions

7. **Documentation**
   - Many internal MD files (being removed from Git)
   - API endpoints not documented
   - Component props not documented
   - Database schema needs visual diagram

---

## 🗺️ Roadmap

### Phase 1: MVP (Current - Q4 2025)
- ✅ Core platform features
- ⚠️ Authentication & authorization (in progress)
- ❌ Testing & bug fixes
- ❌ Production deployment

### Phase 2: Growth (Q1 2026)
- [ ] Mobile app (React Native)
- [ ] Enhanced analytics
- [ ] Social features (friends, messaging)
- [ ] Content recommendation engine
- [ ] Email notifications
- [ ] Push notifications

### Phase 3: AI Integration (Q2 2026)
- [ ] AI tutor (Google Gemini)
- [ ] Personalized learning paths
- [ ] Automated content tagging
- [ ] Plagiarism detection
- [ ] Auto-grading for essays

### Phase 4: Premium Features (Q3 2026)
- [ ] Video courses
- [ ] Live tutoring sessions
- [ ] Premium content
- [ ] Certification programs
- [ ] Institutional licensing

---

## 📄 License

This project is **private** and not licensed for public use or redistribution.

© 2025 STEM Hub. All rights reserved.

---

## 🙏 Acknowledgments

- Inspired by **Strive Masiyiwa's vision** for educational innovation in Africa
- Built with ❤️ for African students
- Powered by open-source technologies

---

## 📞 Contact

For inquiries or collaboration:
- **Email**: [your-email@example.com]
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/stem-hub/issues)

---

**⚡ Built with Next.js, React, TypeScript, and Supabase**

*Last updated: October 6, 2025*
