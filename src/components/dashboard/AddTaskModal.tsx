"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Pet } from "@/types/database";

interface AddTaskModalProps {
  pets: Pet[];
  selectedPetId: string | null;
  onClose: () => void;
  onTaskAdded: () => void;
}

const categories = [
  { value: "medication", label: "Medication", emoji: "💊" },
  { value: "feeding", label: "Feeding", emoji: "🍖" },
  { value: "walking", label: "Walking", emoji: "🚶" },
  { value: "grooming", label: "Grooming", emoji: "✂️" },
  { value: "training", label: "Training", emoji: "🎯" },
  { value: "playtime", label: "Playtime", emoji: "🎾" },
  { value: "cleaning", label: "Cleaning", emoji: "🧹" },
  { value: "custom", label: "Custom", emoji: "📝" },
];

const frequencies = [
  { value: "daily", label: "Every day" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "every_other_day", label: "Every other day" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

const medFrequencies = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "every_other_day", label: "Every other day" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As needed" },
];

const daysOfWeek = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function AddTaskModal({ pets, selectedPetId, onClose, onTaskAdded }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [petId, setPetId] = useState(selectedPetId || (pets.length === 1 ? pets[0].id : ""));
  const [category, setCategory] = useState("custom");
  const [frequency, setFrequency] = useState("daily");
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Medication-specific fields
  const [medDosage, setMedDosage] = useState("");
  const [medDosageUnit, setMedDosageUnit] = useState("mg");
  const [medFrequency, setMedFrequency] = useState("once_daily");
  const [medPurpose, setMedPurpose] = useState("");
  const [medInstructions, setMedInstructions] = useState("");

  const supabase = createClient();
  const isMedication = category === "medication";

  const addTime = () => {
    if (timeInput && !timesOfDay.includes(timeInput)) {
      setTimesOfDay([...timesOfDay, timeInput]);
      setTimeInput("");
    }
  };

  const removeTime = (time: string) => {
    setTimesOfDay(timesOfDay.filter((t) => t !== time));
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a name.");
      return;
    }
    if (!petId) {
      setError("Please select a pet.");
      return;
    }
    if (isMedication && !medDosage.trim()) {
      setError("Please enter a dosage for this medication.");
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (isMedication) {
        // Create a real medication record - this gets auto-scheduled on the dashboard
        const { error: insertError } = await supabase.from("medications").insert({
          user_id: user.id,
          pet_id: petId,
          name: title.trim(),
          dosage: medDosage.trim(),
          dosage_unit: medDosageUnit,
          frequency: medFrequency,
          times_of_day: timesOfDay.length > 0 ? timesOfDay : [],
          purpose: medPurpose.trim() || null,
          instructions: medInstructions.trim() || null,
          start_date: new Date().toISOString().split("T")[0],
        });

        if (insertError) throw insertError;
      } else {
        // Create a care task as before
        const { error: insertError } = await supabase.from("care_tasks").insert({
          user_id: user.id,
          pet_id: petId,
          title: title.trim(),
          category,
          frequency,
          times_of_day: timesOfDay.length > 0 ? timesOfDay : [],
          days_of_week: frequency === "weekly" ? selectedDays : [],
          notes: notes.trim() || null,
        });

        if (insertError) throw insertError;
      }

      onTaskAdded();
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {isMedication ? "Add Medication" : "Add Care Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Category - moved to top so it drives the form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What type of task?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs transition-colors",
                    category === cat.value
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Task/Medication Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isMedication ? "Medication name" : "What do you want to track?"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMedication ? "e.g., Rimadyl, Apoquel, Heartgard..." : "e.g., Morning walk, Feed breakfast, Brush teeth..."}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              autoFocus
            />
          </div>

          {/* Pet Selection - only show if multiple pets */}
          {pets.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Which pet?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => setPetId(pet.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                      petId === pet.id
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    <span>
                      {pet.species === "dog" ? "🐕" : pet.species === "cat" ? "🐈" : "🐾"}
                    </span>
                    <span className="font-medium truncate">{pet.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MEDICATION-SPECIFIC FIELDS */}
          {isMedication && (
            <>
              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dosage
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    placeholder="e.g., 25"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                  <select
                    value={medDosageUnit}
                    onChange={(e) => setMedDosageUnit(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  >
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                    <option value="tablets">tablets</option>
                    <option value="capsules">capsules</option>
                    <option value="drops">drops</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              {/* Med Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  How often?
                </label>
                <select
                  value={medFrequency}
                  onChange={(e) => setMedFrequency(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
                  {medFrequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  What's it for? <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={medPurpose}
                  onChange={(e) => setMedPurpose(e.target.value)}
                  placeholder="e.g., Pain relief, allergy, heart..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>

              {/* Instructions (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Special instructions <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  placeholder="e.g., Give with food, don't crush..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                />
              </div>
            </>
          )}

          {/* CARE TASK-SPECIFIC FIELDS */}
          {!isMedication && (
            <>
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  How often?
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
                  {frequencies.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Days of Week (for weekly) */}
              {frequency === "weekly" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Which days?
                  </label>
                  <div className="flex gap-1.5">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={cn(
                          "flex-1 rounded-lg py-2 text-xs font-medium transition-colors",
                          selectedDays.includes(day.value)
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional details..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
            </>
          )}

          {/* Times of Day - shared by both */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Time of day <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={addTime}
                disabled={!timeInput}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            {timesOfDay.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {timesOfDay.map((time) => (
                  <span
                    key={time}
                    className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {formatTimeDisplay(time)}
                    <button
                      type="button"
                      onClick={() => removeTime(time)}
                      className="text-purple-400 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !title.trim() || !petId || (isMedication && !medDosage.trim())}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Adding..." : isMedication ? "Add Medication" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTimeDisplay(time: string): string {
  try {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${h12}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}
