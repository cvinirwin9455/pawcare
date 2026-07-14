# PawTenderCare - Pet Health Management Platform

A comprehensive platform for managing your pet's medications, appointments, and health records. Built for pet parents with older or special-needs pets.

**Domain:** [PawTenderCare.com](https://pawtendercare.com)

## Features

- **Pet Profiles** — Track multiple pets with conditions, weight, and health info
- **Medication Management** — Dosages, schedules, refill tracking, and purpose descriptions
- **Drug Interactions** — Manually log vet-provided interaction warnings with severity levels
- **Appointment Scheduling** — Vet, physio, grooming, specialist, dental, vaccination
- **Google Calendar Sync** — OAuth integration to auto-create calendar events
- **Email Reminders** — Automated reminders via Resend for medications and appointments
- **Multi-tenant Ready** — Row-level security, subscription tiers, profile management

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Auth:** Supabase Auth (email/password)
- **Email:** Resend API
- **Calendar:** Google Calendar API (OAuth 2.0)
- **Deployment:** Vercel with Cron Jobs
- **Validation:** Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Google Cloud Console project (for Calendar API)
- Resend account (for emails)

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd pawcare
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your `.env.local` with:
   - Supabase project URL and keys
   - Google OAuth client ID/secret
   - Resend API key

5. Set up the database:
   ```bash
   # Apply migrations to your Supabase project
   pnpm db:migrate
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

### Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/api/calendar/callback` as an authorized redirect URI
6. Copy the client ID and secret to `.env.local`

### Resend Email Setup

PawTenderCare uses [Resend](https://resend.com) for all outbound email (medication reminders, appointment alerts). To also fix Supabase Auth email rate limits (sign-up, password reset), configure Resend as a custom SMTP in Supabase:

1. Go to [Resend Dashboard](https://resend.com/domains) and add your domain (`pawtendercare.com`)
2. Add the DNS records Resend gives you (SPF, DKIM, etc.)
3. Once verified, go to Resend > SMTP and note:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your Resend API key
4. In **Supabase Dashboard** > Project Settings > Auth > SMTP Settings:
   - Enable "Custom SMTP"
   - Sender email: `noreply@pawtendercare.com`
   - Sender name: `PawTenderCare`
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your Resend API key
5. This removes the Supabase 4 emails/hour rate limit entirely

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Vercel will auto-configure the cron job from `vercel.json`

Add `CRON_SECRET` to your environment variables to secure the reminders endpoint.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, reset pages
│   ├── (dashboard)/     # Protected app pages
│   │   ├── dashboard/   # Main dashboard
│   │   ├── pets/        # Pet CRUD
│   │   ├── medications/ # Medication CRUD + interactions
│   │   ├── appointments/# Appointment CRUD
│   │   └── settings/    # Profile & integrations
│   └── api/
│       ├── auth/        # Auth callback
│       ├── calendar/    # Google Calendar OAuth + events
│       └── reminders/   # Cron-triggered email reminders
├── components/          # Reusable UI components
├── lib/                 # Utilities, Supabase, email, calendar
└── types/               # TypeScript types
```

## License

Private - All rights reserved.
