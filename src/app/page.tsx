import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-700">PawCare</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-purple-700"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Complete care for your
            <span className="text-purple-600"> beloved pets</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Track medications, manage appointments, get reminders, and
            understand drug interactions — all in one place. Built for pet
            parents who want the best for their furry family members.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-lg bg-purple-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">💊</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Medication Tracking
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Track dosages, schedules, interactions, and get timely reminders.
              Never miss a dose again.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">📅</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Smart Appointments
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Schedule vet visits, physio sessions, and more. Auto-sync with
              Google Calendar.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">🔔</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Email Reminders
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Get email alerts for medications, appointments, and refills.
              Customizable timing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
