import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDateTime, getFrequencyLabel, getSeverityColor } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const now = new Date().toISOString();

  // Fetch dashboard data in parallel
  const [petsRes, medsRes, appointmentsRes, interactionsRes] =
    await Promise.all([
      supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true),
      supabase
        .from("medications")
        .select("*, pets(name)")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("appointments")
        .select("*, pets(name)")
        .eq("user_id", user.id)
        .eq("status", "scheduled")
        .gte("date_time", now)
        .order("date_time", { ascending: true })
        .limit(5),
      supabase
        .from("drug_interactions")
        .select(
          "*, medication_a:medications!medication_a_id(name), medication_b:medications!medication_b_id(name)"
        )
        .eq("user_id", user.id)
        .in("severity", ["moderate", "severe"]),
    ]);

  const pets = petsRes.data || [];
  const medications = medsRes.data || [];
  const appointments = appointmentsRes.data || [];
  const criticalInteractions = interactionsRes.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your pets' health and upcoming tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">🐾</div>
          <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
          <p className="text-sm text-gray-500">Active Pets</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">💊</div>
          <p className="text-2xl font-bold text-gray-900">
            {medications.length}
          </p>
          <p className="text-sm text-gray-500">Active Medications</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-2xl font-bold text-gray-900">
            {appointments.length}
          </p>
          <p className="text-sm text-gray-500">Upcoming Appointments</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-2xl font-bold text-gray-900">
            {criticalInteractions.length}
          </p>
          <p className="text-sm text-gray-500">Interaction Warnings</p>
        </div>
      </div>

      {/* Critical Interactions Alert */}
      {criticalInteractions.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-sm font-semibold text-red-800 mb-3">
            Drug Interaction Warnings
          </h2>
          <div className="space-y-2">
            {criticalInteractions.map((interaction) => (
              <div
                key={interaction.id}
                className={`rounded-lg border p-3 bg-white ${getSeverityColor(interaction.severity)}`}
              >
                <span className="font-medium text-sm">
                  {(interaction.medication_a as any)?.name} &harr;{" "}
                  {(interaction.medication_b as any)?.name}
                </span>
                <span className="ml-2 text-xs uppercase font-semibold">
                  ({interaction.severity})
                </span>
                <p className="text-sm mt-1">{interaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold text-gray-900">
              Upcoming Appointments
            </h2>
            <Link
              href="/appointments"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View All
            </Link>
          </div>
          <div className="p-5">
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming appointments
              </p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <Link
                    key={apt.id}
                    href={`/appointments/${apt.id}`}
                    className="block rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {apt.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {(apt as any).pets?.name} &middot;{" "}
                          {formatDateTime(apt.date_time)}
                        </p>
                      </div>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                        {apt.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Medications */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold text-gray-900">
              Active Medications
            </h2>
            <Link
              href="/medications"
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View All
            </Link>
          </div>
          <div className="p-5">
            {medications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No active medications
              </p>
            ) : (
              <div className="space-y-3">
                {medications.map((med) => (
                  <Link
                    key={med.id}
                    href={`/medications/${med.id}`}
                    className="block rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {med.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {(med as any).pets?.name} &middot; {med.dosage}{" "}
                          {med.dosage_unit} &middot;{" "}
                          {getFrequencyLabel(med.frequency)}
                        </p>
                      </div>
                      {med.times_of_day && med.times_of_day.length > 0 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {med.times_of_day[0]}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/pets/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">🐾</span>
            <p className="text-sm font-medium text-gray-900 mt-2">Add Pet</p>
          </Link>
          <Link
            href="/medications/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">💊</span>
            <p className="text-sm font-medium text-gray-900 mt-2">
              Add Medication
            </p>
          </Link>
          <Link
            href="/appointments/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📅</span>
            <p className="text-sm font-medium text-gray-900 mt-2">
              Schedule Appointment
            </p>
          </Link>
          <Link
            href="/medications/interactions/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-medium text-gray-900 mt-2">
              Log Interaction
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
