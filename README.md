# Authentication Template

A **database-agnostic** authentication template for Next.js applications. Includes email verification, password reset, rate limiting, and i18n support.

## Features

- **Database Agnostic**: Adapter pattern supports PostgreSQL, MySQL, SQLite, MongoDB, Supabase, and PlanetScale
- **Demo Mode**: Works out-of-the-box with in-memory storage (no database required)
- **Email Service Abstraction**: Supports Resend, SendGrid, or console output (demo mode)
- **Internationalization**: Full i18n support with next-intl (English and Portuguese included)
- **Dark/Light Theme**: Built-in theme support with next-themes
- **Modern UI**: Uses HeroUI component library
- **Security Features**: Rate limiting, bcrypt password hashing, JWT tokens

## Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd authentication-template
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Generate a NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

   Add it to your `.env.local`:
   ```
   NEXTAUTH_SECRET=your_generated_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

## Demo Mode

By default, the template runs in **demo mode** with:
- **In-memory database**: No database setup required
- **Console emails**: Verification tokens logged to console
- **Auto-verified emails**: When using both memory DB and console email, accounts are automatically verified on registration

This allows you to test the full authentication flow immediately - just register and log in!

> **Note**: In demo mode, all data is lost when the server restarts.

## Production Setup

### Database Configuration

Set the `DATABASE_ADAPTER` environment variable to your chosen database:

| Database | Adapter Value | Required Packages |
|----------|---------------|-------------------|
| PostgreSQL | `prisma-postgres` | `prisma @prisma/client` |
| MySQL | `prisma-mysql` | `prisma @prisma/client` |
| SQLite | `prisma-sqlite` | `prisma @prisma/client` |
| MongoDB | `mongodb` | `mongodb` |
| Supabase | `supabase` | `prisma @prisma/client` |
| PlanetScale | `planetscale` | `prisma @prisma/client` |

See the **Dashboard Setup Guide** after login for detailed instructions.

### Email Configuration

Set the `EMAIL_ADAPTER` environment variable:

| Service | Adapter Value | Required Packages |
|---------|---------------|-------------------|
| Resend | `resend` | `resend` |
| SendGrid | `sendgrid` | `@sendgrid/mail` |
| Console (demo) | `console` | None |

## Project Structure

```
authentication-template/
├── app/
│   ├── api/auth/           # API routes (register, verify, reset)
│   ├── (auth)/             # Auth pages (login, register, etc.)
│   └── (protected)/        # Protected pages (dashboard)
├── components/
│   ├── providers/          # HeroUI, NextAuth, Theme providers
│   └── theme/              # Theme toggle components
├── lib/
│   ├── db/                 # Database adapter layer
│   │   ├── adapter.ts      # Adapter interface
│   │   └── adapters/       # Database implementations
│   ├── email/              # Email adapter layer
│   │   └── adapters/       # Email implementations
│   ├── auth.ts             # NextAuth configuration
│   ├── validations/        # Zod validation schemas
│   └── rate-limiter.ts     # Rate limiting
├── i18n/
│   ├── config.ts           # i18n configuration
│   └── locales/            # Translation files
└── middleware.ts           # Route protection
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing |
| `NEXTAUTH_URL` | Yes | Your app's URL |
| `DATABASE_ADAPTER` | No | Database adapter (default: `memory`) |
| `DATABASE_URL` | For Prisma | Database connection string |
| `MONGODB_URI` | For MongoDB | MongoDB connection string |
| `EMAIL_ADAPTER` | No | Email adapter (default: `console`) |
| `EMAIL_FROM` | For email | Sender email address |
| `RESEND_API_KEY` | For Resend | Resend API key |
| `SENDGRID_API_KEY` | For SendGrid | SendGrid API key |
| `DEFAULT_LOCALE` | No | Default locale (default: `en`) |

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## License

MIT
