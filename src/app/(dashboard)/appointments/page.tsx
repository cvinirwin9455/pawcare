import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getAppointmentTypeLabel, getStatusColor, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: upcoming } = await supabase
    .from("appointments")
    .select("*, pets(name, species)")
    .eq("user_id", user!.id)
    .eq("status", "scheduled")
    .gte("date_time", new Date().toISOString())
    .order("date_time", { ascending: true });

  const { data: past } = await supabase
    .from("appointments")
    .select("*, pets(name, species)")
    .eq("user_id", user!.id)
    .or("status.eq.completed,status.eq.cancelled")
    .order("date_time", { ascending: false })
    .limit(10);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage vet visits, physio sessions, and more
          </p>
        </div>
        <Link
          href="/appointments/new"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
        >
          + Schedule Appointment
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Upcoming
        </h2>
        {!upcoming || upcoming.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900">
              No upcoming appointments
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Schedule an appointment for your pet.
            </p>
            <Link
              href="/appointments/new"
              className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              Schedule Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <Link
                key={apt.id}
                href={`/appointments/${apt.id}`}
                className="block bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {apt.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {(apt as any).pets?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(apt.date_time)} &middot;{" "}
                      {apt.duration_minutes} min
                    </p>
                    {apt.provider_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        {apt.provider_name}
                        {apt.provider_address && ` — ${apt.provider_address}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                      {getAppointmentTypeLabel(apt.type)}
                    </span>
                    {apt.google_event_id && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        In Calendar
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {past && past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Past Appointments
          </h2>
          <div className="space-y-2">
            {past.map((apt) => (
              <Link
                key={apt.id}
                href={`/appointments/${apt.id}`}
                className="block bg-white rounded-lg border p-4 hover:bg-gray-50 transition-colors opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{apt.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(apt.date_time)} &middot;{" "}
                      {(apt as any).pets?.name}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusColor(apt.status)}`}
                  >
                    {apt.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
