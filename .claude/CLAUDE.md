# Authentication Template - Integration Guide for Claude

This is a database-agnostic authentication template. When a user asks to integrate this template into a new project, follow these instructions EXACTLY.

## Overview

This template provides:
- **Complete authentication flow**: Registration, login, email verification, password reset
- **Database adapter pattern**: Supports PostgreSQL, MySQL, SQLite, MongoDB, Supabase, PlanetScale
- **Email service abstraction**: Resend, SendGrid, or console fallback
- **Internationalization**: next-intl with English and Portuguese
- **Dark/Light theme**: next-themes with HeroUI integration
- **Security**: Rate limiting, bcrypt hashing, JWT tokens

## STEP 1: ASK ALL QUESTIONS UPFRONT (REQUIRED)

Before copying any files, use AskUserQuestion to ask ALL of these questions at once:

### Question Set:

1. **Database**: Which database will you use?
   - PostgreSQL (Recommended)
   - MySQL
   - SQLite
   - MongoDB
   - Supabase
   - PlanetScale
   - None (demo mode with in-memory)

2. **Email Service**: Which email service will you use?
   - Resend (Recommended - easy setup, free tier)
   - SendGrid
   - None (console fallback - development only)

3. **Dark/Light Theme**: Do you want theme support?
   - Yes (Recommended)
   - No

4. **Internationalization**: Do you want i18n support?
   - Yes - specify languages needed
   - No

5. **Features**: Which features do you need?
   - Email verification (Recommended)
   - Password reset (Recommended)
   - Rate limiting (Recommended)

---

## STEP 2: DECISION MATRIX - WHAT TO COPY/SKIP

Based on user answers, follow this matrix:

### DATABASE SELECTION

| Choice | Action | Install |
|--------|--------|---------|
| Memory (default) | Already included | None |
| PostgreSQL | Create adapter file and update index.ts | `prisma @prisma/client` |
| MySQL | Create adapter file and update index.ts | `prisma @prisma/client` |
| SQLite | Create adapter file and update index.ts | `prisma @prisma/client` |
| MongoDB | Create adapter file and update index.ts | `mongodb` |
| Supabase | Create adapter file and update index.ts | `prisma @prisma/client` |
| PlanetScale | Create adapter file and update index.ts | `prisma @prisma/client` |

**To enable a database adapter:**
1. Install the required package
2. Create the adapter file (see Dashboard Setup Guide for code)
3. Uncomment the corresponding case in `lib/db/index.ts`

### EMAIL SERVICE SELECTION

| Choice | Action | Install |
|--------|--------|---------|
| Console (default) | Already included | None |
| Resend | Create adapter file and update index.ts | `resend` |
| SendGrid | Create adapter file and update index.ts | `@sendgrid/mail` |

**To enable an email adapter:**
1. Install the required package
2. Create the adapter file (see Dashboard Setup Guide for code)
3. Uncomment the corresponding case in `lib/email/index.ts`

**⚠️ WARNING if using Console mode in production:**
- Verification tokens will be logged to console only
- WARN THE USER: "Without a real email service, users cannot verify their email addresses or reset passwords via email."
- For production, they MUST configure a real email service

### DARK/LIGHT THEME SELECTION

| Choice | Copy These Files | Skip These | Install |
|--------|------------------|------------|---------|
| Yes | `components/theme/ThemeToggle.tsx` | Nothing | `next-themes` |
| No | Nothing | `components/theme/` folder | None |

**IF USER CHOOSES "No" (No Theme):**
1. DO NOT copy `components/theme/` folder
2. Remove ThemeToggle imports from all auth pages
3. Remove NextThemesProvider from Providers.tsx
4. DO NOT install `next-themes` package

### INTERNATIONALIZATION (i18n) SELECTION

| Choice | Copy These Files | Skip These | Install |
|--------|------------------|------------|---------|
| Yes | Entire `i18n/` folder | Nothing | `next-intl` |
| No | Nothing | Entire `i18n/` folder | None |

**IF USER CHOOSES "Yes":**
1. Ask for which languages they need
2. Copy ONLY those language folders from `i18n/locales/`
3. Update `i18n/config.ts` with only chosen locales

**IF USER CHOOSES "No":**
1. DO NOT copy `i18n/` folder
2. Remove all `useTranslations()` calls from components
3. Replace with hardcoded English strings
4. Simplify Providers.tsx (remove NextIntlProvider)

### FEATURE SELECTION

| Feature | If DISABLED | Actions Required |
|---------|-------------|------------------|
| Email Verification | User chose No | Remove `emailVerified` checks from auth.ts, remove verify-email routes/pages |
| Password Reset | User chose No | Remove forgot-password and reset-password routes/pages |
| Rate Limiting | User chose No | Remove `lib/rate-limiter.ts`, remove rate limit checks from API routes |

---

## STEP 3: FILES TO COPY

### Core Files (Always Required)

```
lib/
├── auth.ts                    # NextAuth configuration
├── constants.ts               # Error codes
├── validations/
│   └── auth.ts               # Zod validation schemas
├── db/
│   ├── adapter.ts            # Database adapter interface
│   ├── types.ts              # Shared types
│   ├── index.ts              # Adapter factory (update to use chosen adapter)
│   └── adapters/
│       └── [chosen-adapter].ts
└── email/
    ├── adapter.ts            # Email adapter interface
    ├── index.ts              # Email factory (update to use chosen adapter)
    ├── templates/
    │   ├── verification.ts
    │   └── password-reset.ts
    └── adapters/
        └── [chosen-adapter].ts

app/
├── api/auth/
│   ├── [...nextauth]/route.ts
│   ├── register/route.ts
│   ├── verify-email/route.ts    # If email verification enabled
│   ├── forgot-password/route.ts # If password reset enabled
│   └── reset-password/route.ts  # If password reset enabled
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx # If password reset enabled
│   ├── reset-password/page.tsx  # If password reset enabled
│   └── verify-email/
│       └── success/page.tsx     # If email verification enabled
├── (protected)/
│   ├── layout.tsx
│   └── dashboard/page.tsx       # Can be customized or replaced
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── providers/
│   └── Providers.tsx
└── theme/                       # If theme enabled
    └── ThemeToggle.tsx

middleware.ts
types/
└── next-auth.d.ts
```

### Conditional Files

```
# If i18n enabled:
i18n/
├── config.ts
├── request.ts
└── locales/
    └── [chosen-languages]/

# If rate limiting enabled:
lib/
├── rate-limiter.ts
└── ip-hash.ts
```

---

## STEP 4: ENVIRONMENT VARIABLES

Generate and provide these based on choices:

```bash
# Always required
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Database (format varies by choice)
DATABASE_ADAPTER=prisma-postgres  # Or: prisma-mysql, prisma-sqlite, mongodb, supabase, planetscale, memory
DATABASE_URL=                     # Connection string for chosen database

# Email (if not console)
EMAIL_ADAPTER=resend              # Or: sendgrid, console
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=                   # If using Resend
SENDGRID_API_KEY=                 # If using SendGrid

# i18n (if enabled)
DEFAULT_LOCALE=en
```

---

## STEP 5: POST-INTEGRATION STEPS

After copying files:

1. **Install dependencies:**
   ```bash
   pnpm install next-auth bcrypt @types/bcrypt zod uuid @types/uuid
   pnpm install @heroui/react @heroui/theme framer-motion
   # Plus database/email specific packages
   ```

2. **For Prisma databases:**
   ```bash
   npx prisma init
   # Add schema from lib/db/adapters/[adapter].ts comments
   npx prisma migrate dev
   ```

3. **Update imports:** Remove imports for deleted modules

4. **Update Providers.tsx:** Only include providers for enabled features

5. **Verify the setup:**
   ```bash
   pnpm dev
   # Visit http://localhost:3000
   # Test registration and login
   ```

---

## STEP 6: VERIFICATION CHECKLIST

After integration, verify:

- [ ] `pnpm dev` starts without errors
- [ ] Registration form renders at `/register`
- [ ] Login form renders at `/login`
- [ ] Protected routes redirect to login when not authenticated
- [ ] Registration creates user (check console for demo mode)
- [ ] Login works with registered user
- [ ] (If theme enabled) Theme toggle works
- [ ] (If i18n enabled) Translations display correctly

---

## QUICK REFERENCE: DEPENDENCIES BY FEATURE

| Feature | Dependencies |
|---------|--------------|
| Core Auth | `next-auth bcrypt @types/bcrypt zod uuid @types/uuid` |
| HeroUI | `@heroui/react @heroui/theme framer-motion lucide-react` |
| Prisma DBs | `prisma @prisma/client` |
| MongoDB | `mongodb` |
| Resend | `resend` |
| SendGrid | `@sendgrid/mail` |
| Theme | `next-themes` |
| i18n | `next-intl` |

---

## EXAMPLE: Minimal Setup (PostgreSQL, Resend, Theme, i18n)

```bash
# Dependencies
pnpm install next-auth bcrypt @types/bcrypt zod uuid @types/uuid
pnpm install @heroui/react @heroui/theme framer-motion lucide-react
pnpm install prisma @prisma/client
pnpm install resend
pnpm install next-themes
pnpm install next-intl

# Environment
DATABASE_ADAPTER=prisma-postgres
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
EMAIL_ADAPTER=resend
RESEND_API_KEY=re_xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
```

---

## EXAMPLE: Minimal Setup (Demo Mode - No External Services)

```bash
# Dependencies (minimal)
pnpm install next-auth bcrypt @types/bcrypt zod uuid @types/uuid
pnpm install @heroui/react @heroui/theme framer-motion lucide-react
pnpm install next-themes
pnpm install next-intl

# Environment
DATABASE_ADAPTER=memory
EMAIL_ADAPTER=console
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
```
