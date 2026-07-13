"use client";

import { useState } from "react";
import type { AppointmentFormData } from "@/lib/validations";
import type { Appointment, Pet } from "@/types/database";

interface AppointmentFormProps {
  pets: Pet[];
  appointment?: Appointment;
  defaultPetId?: string;
  hasCalendarConnected: boolean;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  loading: boolean;
}

const typeOptions = [
  { value: "vet", label: "Veterinarian" },
  { value: "physio", label: "Physiotherapy" },
  { value: "grooming", label: "Grooming" },
  { value: "specialist", label: "Specialist" },
  { value: "dental", label: "Dental" },
  { value: "vaccination", label: "Vaccination" },
  { value: "other", label: "Other" },
];

export function AppointmentForm({
  pets,
  appointment,
  defaultPetId,
  hasCalendarConnected,
  onSubmit,
  loading,
}: AppointmentFormProps) {
  const [petId, setPetId] = useState(appointment?.pet_id || defaultPetId || "");
  const [title, setTitle] = useState(appointment?.title || "");
  const [type, setType] = useState(appointment?.type || "vet");
  const [providerName, setProviderName] = useState(appointment?.provider_name || "");
  const [providerAddress, setProviderAddress] = useState(appointment?.provider_address || "");
  const [providerPhone, setProviderPhone] = useState(appointment?.provider_phone || "");
  const [dateTime, setDateTime] = useState(
    appointment?.date_time
      ? new Date(appointment.date_time).toISOString().slice(0, 16)
      : ""
  );
  const [durationMinutes, setDurationMinutes] = useState(
    appointment?.duration_minutes?.toString() || "30"
  );
  const [notes, setNotes] = useState(appointment?.notes || "");
  const [addToCalendar, setAddToCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      pet_id: petId,
      title,
      type: type as AppointmentFormData["type"],
      provider_name: providerName || null,
      provider_address: providerAddress || null,
      provider_phone: providerPhone || null,
      date_time: new Date(dateTime).toISOString(),
      duration_minutes: parseInt(durationMinutes),
      notes: notes || null,
      add_to_calendar: addToCalendar,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pet *
        </label>
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
        >
          <option value="">Select a pet...</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., Annual checkup"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Name
          </label>
          <input
            type="text"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., City Vet Clinic"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={providerAddress}
            onChange={(e) => setProviderAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="123 Main St..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={providerPhone}
            onChange={(e) => setProviderPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
          placeholder="Anything to remember for this appointment..."
        />
      </div>

      {/* Google Calendar Integration */}
      <div className="rounded-lg border border-gray-200 p-4">
        {hasCalendarConnected ? (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={addToCalendar}
              onChange={(e) => setAddToCalendar(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Add to Google Calendar
              </span>
              <p className="text-xs text-gray-500">
                Creates a calendar event with reminders
              </p>
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Connect Google Calendar
              </p>
              <p className="text-xs text-gray-500">
                Go to Settings to connect your Google Calendar for automatic
                event creation
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "Saving..."
            : appointment
            ? "Update Appointment"
            : "Schedule Appointment"}
        </button>
      </div>
    </form>
  );
}
