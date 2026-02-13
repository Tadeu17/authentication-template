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

---

## DEMO MODE: Testing Without External Services

### Full Demo Mode (Memory DB + Console Email)

When using **both** `DATABASE_ADAPTER=memory` and `EMAIL_ADAPTER=console` (the defaults):

- **Email verification is SKIPPED** - accounts are auto-verified on registration
- **You can log in immediately** after registering
- This is the easiest way to test the authentication flow

### Partial Demo Mode (Real DB + Console Email)

When using a real database but `EMAIL_ADAPTER=console`:

- Email verification is still required
- Verification URLs are logged to the terminal instead of being sent
- You need to copy the URL from the terminal to verify

### How to Test Email Verification (Partial Demo Mode)

1. **Register a new account** at `/register`
2. **Check your terminal** where `pnpm dev` is running
3. You'll see output like:
   ```
   ============================================================
   📧 VERIFICATION EMAIL (Console Mode)
   ============================================================
   To: user@example.com
   Subject: Verify your email
   Locale: en
   ------------------------------------------------------------
   Verification URL: http://localhost:3000/api/auth/verify-email?token=abc-123-xyz
   Token: abc-123-xyz
   ============================================================
   ```
4. **Copy the Verification URL** and paste it in your browser
5. Your email will be verified and you can now log in

### How to Test Password Reset in Demo Mode

1. **Click "Forgot password?"** on the login page
2. **Enter your email** and submit
3. **Check your terminal** for the reset URL
4. **Copy the Reset URL** and paste it in your browser
5. Set your new password

### Important Notes for Demo Mode

- **Data is lost on server restart** when using `DATABASE_ADAPTER=memory`
- **Full demo mode auto-verifies emails** for frictionless testing
- For production, configure a real email service (Resend or SendGrid)
- For persistent data, configure a real database adapter

---

## CLEANUP: Removing Demo Code and Unused Features

After the user selects their preferred database, email service, and features, **Claude MUST perform cleanup** to remove all demo-related code and unused adapters. This ensures the final codebase is clean and production-ready.

### STEP 1: Remove Demo Mode Code (When NOT using memory DB + console email)

If user chooses a real database OR real email service, remove demo mode code:

#### In `app/api/auth/register/route.ts`:

**Remove these imports:**
```typescript
// REMOVE: isDemoMode import if not using memory DB
import { getAdapter, isDemoMode } from "@/lib/db";
// CHANGE TO:
import { getAdapter } from "@/lib/db";

// REMOVE: isConsoleMode import if not using console email
import { sendVerificationEmail, isConsoleMode } from "@/lib/email";
// CHANGE TO:
import { sendVerificationEmail } from "@/lib/email";
```

**Remove the auto-verify block (lines ~70-95):**
```typescript
// REMOVE THIS ENTIRE BLOCK:
const isFullDemoMode = isDemoMode() && isConsoleMode();

// ... and the if (isFullDemoMode) block that auto-verifies
```

#### In `app/(auth)/register/page.tsx`:

**Remove demo mode state and UI:**
```typescript
// REMOVE:
const [isDemoAutoVerified, setIsDemoAutoVerified] = useState(false);

// REMOVE from onSubmit:
setIsDemoAutoVerified(result.message === "DEMO_MODE_AUTO_VERIFIED");

// REMOVE the entire isDemoAutoVerified conditional rendering block
// REMOVE the demo mode notice div
```

#### In `app/(auth)/login/page.tsx`:

**Remove demo mode notice:**
```typescript
// REMOVE this line from the emailNotVerified section:
<p className="text-xs opacity-80 border-t border-warning/20 pt-2 mt-2">
  {tVerification("demoModeNotice")}
</p>
```

#### In `lib/db/index.ts`:

**If NOT using memory adapter, remove:**
```typescript
// REMOVE the isDemoMode function
export function isDemoMode(): boolean {
  return getAdapterType() === 'memory'
}

// REMOVE the memory case from switch (keep only chosen adapter)
case 'memory': {
  const { memoryAdapter } = await import('./adapters/memory')
  adapterInstance = memoryAdapter
  break
}
```

#### In `lib/email/index.ts`:

**If NOT using console adapter, remove:**
```typescript
// REMOVE the isConsoleMode function
export function isConsoleMode(): boolean {
  return getEmailAdapterType() === 'console'
}

// REMOVE the console case from switch (keep only chosen adapter)
case 'console': {
  const { consoleEmailAdapter } = await import('./adapters/console')
  adapterInstance = consoleEmailAdapter
  break
}
```

### STEP 2: Remove Unused Database Adapters

Delete adapter files that won't be used:

| If User Chose | DELETE These Files |
|---------------|-------------------|
| PostgreSQL | `lib/db/adapters/memory.ts`, all other adapters except `prisma-postgres.ts` |
| MySQL | `lib/db/adapters/memory.ts`, all other adapters except `prisma-mysql.ts` |
| SQLite | `lib/db/adapters/memory.ts`, all other adapters except `prisma-sqlite.ts` |
| MongoDB | `lib/db/adapters/memory.ts`, all other adapters except `mongodb.ts` |
| Supabase | `lib/db/adapters/memory.ts`, all other adapters except `supabase.ts` |
| PlanetScale | `lib/db/adapters/memory.ts`, all other adapters except `planetscale.ts` |
| Memory (demo) | Keep only `memory.ts` |

**Also update `lib/db/index.ts`:**
- Remove commented-out cases for unused adapters
- Remove the default fallback to memory adapter
- Simplify to only include the chosen adapter

### STEP 3: Remove Unused Email Adapters

Delete adapter files that won't be used:

| If User Chose | DELETE These Files |
|---------------|-------------------|
| Resend | `lib/email/adapters/console.ts`, `lib/email/adapters/sendgrid.ts` |
| SendGrid | `lib/email/adapters/console.ts`, `lib/email/adapters/resend.ts` |
| Console (demo) | Keep only `console.ts` |

**Also update `lib/email/index.ts`:**
- Remove commented-out cases for unused adapters
- Remove the default fallback to console adapter
- Simplify to only include the chosen adapter

### STEP 4: Remove Unused Translation Keys

If demo mode code was removed, also remove these translation keys from `i18n/locales/*/auth.json`:

```json
// REMOVE from verification section:
"demoModeNotice": "...",
"demoModeTitle": "...",
"demoModeDescription": "...",
"demoAutoVerifiedTitle": "...",
"demoAutoVerifiedDescription": "...",
"demoAutoVerifiedNote": "..."
```

### STEP 5: Remove Unused Features

#### If Email Verification DISABLED:

**Delete:**
- `app/api/auth/verify-email/route.ts`
- `app/(auth)/verify-email/` folder
- `lib/email/templates/verification.ts`

**Modify:**
- `lib/auth.ts`: Remove `emailVerified` check in authorize callback
- `app/api/auth/register/route.ts`: Remove verification token generation and email sending
- `lib/db/types.ts`: Remove `emailVerificationToken` and `emailVerificationTokenExpiresAt` fields
- `lib/db/adapter.ts`: Remove `setVerificationToken`, `getVerificationToken`, `clearVerificationToken` methods

#### If Password Reset DISABLED:

**Delete:**
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `lib/email/templates/password-reset.ts`

**Modify:**
- `app/(auth)/login/page.tsx`: Remove "Forgot password?" link
- `lib/db/types.ts`: Remove `passwordResetToken` and `passwordResetTokenExpiresAt` fields
- `lib/db/adapter.ts`: Remove `setPasswordResetToken`, `getPasswordResetToken`, `clearPasswordResetToken` methods

#### If Rate Limiting DISABLED:

**Delete:**
- `lib/rate-limiter.ts`
- `lib/ip-hash.ts`

**Modify:**
- `app/api/auth/register/route.ts`: Remove rate limiting imports and logic
- `app/api/auth/forgot-password/route.ts`: Remove rate limiting imports and logic (if file exists)

#### If Theme DISABLED:

**Delete:**
- `components/theme/` folder

**Modify:**
- `app/(auth)/login/page.tsx`: Remove ThemeToggle import and component
- `app/(auth)/register/page.tsx`: Remove ThemeToggle import and component
- `app/(auth)/forgot-password/page.tsx`: Remove ThemeToggle import and component
- `app/(auth)/reset-password/page.tsx`: Remove ThemeToggle import and component
- `components/providers/Providers.tsx`: Remove NextThemesProvider

**Uninstall:**
```bash
pnpm remove next-themes
```

#### If i18n DISABLED:

**Delete:**
- `i18n/` folder entirely

**Modify all pages to:**
- Remove `useTranslations()` imports and calls
- Replace translation keys with hardcoded English strings
- Remove `NextIntlClientProvider` from `components/providers/Providers.tsx`
- Remove `next-intl` from `middleware.ts`

**Uninstall:**
```bash
pnpm remove next-intl
```

### STEP 6: Final Cleanup Checklist

After all removals, verify:

- [ ] No unused imports remain
- [ ] No references to deleted files
- [ ] `pnpm build` completes without errors
- [ ] `pnpm lint` passes
- [ ] All features work as expected
- [ ] Environment variables match chosen adapters
