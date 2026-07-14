"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getAppointmentTypeLabel, getStatusColor, formatDateTime } from "@/lib/utils";

export default function AppointmentsPage() {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [upcomingRes, pastRes] = await Promise.all([
        supabase
          .from("appointments")
          .select("*, pets(name, species)")
          .eq("user_id", user.id)
          .eq("status", "scheduled")
          .gte("date_time", new Date().toISOString())
          .order("date_time", { ascending: true }),
        supabase
          .from("appointments")
          .select("*, pets(name, species)")
          .eq("user_id", user.id)
          .or("status.eq.completed,status.eq.cancelled")
          .order("date_time", { ascending: false })
          .limit(10),
      ]);

      setUpcoming(upcomingRes.data || []);
      setPast(pastRes.data || []);
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="animate-pulse text-gray-400">Loading appointments...</div>;
  }

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
        {upcoming.length === 0 ? (
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
              <div
                key={apt.id}
                className="block bg-white rounded-xl border shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {apt.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {apt.pets?.name}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Past Appointments
          </h2>
          <div className="space-y-2">
            {past.map((apt) => (
              <div
                key={apt.id}
                className="block bg-white rounded-lg border p-4 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{apt.title}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(apt.date_time)} &middot;{" "}
                      {apt.pets?.name}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusColor(apt.status)}`}
                  >
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
