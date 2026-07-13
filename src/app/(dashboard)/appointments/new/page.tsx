"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import type { AppointmentFormData } from "@/lib/validations";
import type { Pet, Profile } from "@/types/database";

export default function NewAppointmentPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [hasCalendar, setHasCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPetId = searchParams.get("pet") || undefined;
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [petsRes, profileRes] = await Promise.all([
        supabase.from("pets").select("*").eq("is_active", true).order("name"),
        supabase.from("profiles").select("google_calendar_token").eq("id", user.id).single(),
      ]);

      setPets(petsRes.data || []);
      setHasCalendar(!!(profileRes.data as any)?.google_calendar_token);
    }
    fetchData();
  }, []);

  const handleSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in");
        return;
      }

      // Create appointment in database
      const { data: appointment, error: dbError } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          pet_id: data.pet_id,
          title: data.title,
          type: data.type,
          provider_name: data.provider_name,
          provider_address: data.provider_address,
          provider_phone: data.provider_phone,
          date_time: data.date_time,
          duration_minutes: data.duration_minutes,
          notes: data.notes,
        })
        .select()
        .single();

      if (dbError) {
        setError(dbError.message);
        return;
      }

      // Add to Google Calendar if requested
      if (data.add_to_calendar && appointment) {
        try {
          await fetch("/api/calendar/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              appointmentId: appointment.id,
              title: data.title,
              dateTime: data.date_time,
              durationMinutes: data.duration_minutes,
              location: data.provider_address,
              description: `${data.type} appointment${data.provider_name ? ` at ${data.provider_name}` : ""}${data.notes ? `\n\nNotes: ${data.notes}` : ""}`,
            }),
          });
        } catch (calError) {
          // Calendar event creation is non-blocking
          console.error("Failed to create calendar event:", calError);
        }
      }

      router.push("/appointments");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/appointments"
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          &larr; Back to Appointments
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Schedule Appointment
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Book a vet visit, physio session, or other appointment
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <AppointmentForm
          pets={pets}
          defaultPetId={defaultPetId}
          hasCalendarConnected={hasCalendar}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
