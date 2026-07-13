# PawCare - Pet Care Management Platform

A comprehensive pet care management platform built with Next.js 14, Supabase, and Tailwind CSS. Track your pets' health, appointments, medications, and more.

## Features

- **Pet Profiles** - Store all your pets' info (species, breed, weight, microchip, etc.)
- **Appointments** - Schedule and track vet visits with status management
- **Medications** - Track active medications with dosage and frequency
- **Health Records** - Store vaccinations, lab results, diagnoses, and procedures
- **Veterinarians** - Keep your vets' contact information organized
- **Smart Reminders** - Set one-time or recurring reminders with email notifications
- **Google Calendar Sync** - Sync appointments directly to your Google Calendar
- **Email Notifications** - Automated reminders via Resend
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Email | Resend |
| Calendar | Google Calendar API (OAuth 2.0) |
| Deployment | Vercel |
| Scheduling | Vercel Cron |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Google Cloud Console project (for Calendar integration)
- Resend account (for email notifications)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd pawcare
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy your project URL and anon key from Settings > API

### 3. Set Up Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all the values in `.env.local`:

- **Supabase**: Get from your Supabase project Settings > API
- **Google Calendar**: Create OAuth credentials in Google Cloud Console
- **Resend**: Get API key from [resend.com](https://resend.com)
- **CRON_SECRET**: Generate a random string for cron job authentication

### 4. Set Up Google Calendar (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/google-calendar/callback`
6. Copy Client ID and Client Secret to `.env.local`

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
pawcare/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth pages (login, signup, reset-password)
│   │   ├── api/              # API routes (cron, Google Calendar OAuth)
│   │   ├── dashboard/        # Protected dashboard pages
│   │   │   ├── pets/         # Pet CRUD
│   │   │   ├── appointments/ # Appointment management
│   │   │   ├── medications/  # Medication tracking
│   │   │   ├── health-records/ # Health record storage
│   │   │   ├── vets/         # Veterinarian contacts
│   │   │   ├── reminders/    # Reminder system
│   │   │   └── settings/     # User settings
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Root layout
│   ├── components/ui/        # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   └── lib/
│       ├── supabase/         # Supabase client (server, client, middleware)
│       ├── types/            # TypeScript types & database schema
│       ├── email.ts          # Resend email templates
│       ├── google-calendar.ts # Google Calendar integration
│       ├── utils.ts          # Utility functions
│       └── validations.ts    # Zod schemas
├── supabase/
│   └── migrations/           # SQL migration files
├── vercel.json               # Cron job configuration
└── package.json
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Update `GOOGLE_REDIRECT_URI` to your production callback URL
6. Deploy!

The cron job for reminders will automatically run every 15 minutes (configured in `vercel.json`).

## Database Schema

The app uses 8 main tables with Row Level Security (RLS):

- `profiles` - User profiles (extends Supabase auth)
- `pets` - Pet profiles
- `veterinarians` - Vet contact info
- `appointments` - Scheduled appointments
- `medications` - Active/past medications
- `health_records` - Medical history
- `reminders` - Notification reminders
- `feeding_schedules` - Feeding routines

All tables have RLS policies ensuring users can only access their own data.

## License

MIT
