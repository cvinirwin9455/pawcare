"use client";

import { useState } from "react";
import type { MedicationFormData } from "@/lib/validations";
import type { Medication, Pet } from "@/types/database";

interface MedicationFormProps {
  pets: Pet[];
  medication?: Medication;
  defaultPetId?: string;
  onSubmit: (data: MedicationFormData) => Promise<void>;
  loading: boolean;
}

const frequencyOptions = [
  { value: "once_daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "every_other_day", label: "Every other day" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As needed" },
  { value: "custom", label: "Custom" },
];

export function MedicationForm({
  pets,
  medication,
  defaultPetId,
  onSubmit,
  loading,
}: MedicationFormProps) {
  const [petId, setPetId] = useState(medication?.pet_id || defaultPetId || "");
  const [name, setName] = useState(medication?.name || "");
  const [dosage, setDosage] = useState(medication?.dosage || "");
  const [dosageUnit, setDosageUnit] = useState(medication?.dosage_unit || "mg");
  const [frequency, setFrequency] = useState(medication?.frequency || "once_daily");
  const [customFrequency, setCustomFrequency] = useState(medication?.custom_frequency || "");
  const [timesOfDay, setTimesOfDay] = useState<string[]>(medication?.times_of_day || []);
  const [timeInput, setTimeInput] = useState("");
  const [purpose, setPurpose] = useState(medication?.purpose || "");
  const [sideEffects, setSideEffects] = useState(medication?.side_effects || "");
  const [instructions, setInstructions] = useState(medication?.instructions || "");
  const [prescribingVet, setPrescribingVet] = useState(medication?.prescribing_vet || "");
  const [startDate, setStartDate] = useState(medication?.start_date || new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(medication?.end_date || "");
  const [refillReminderDays, setRefillReminderDays] = useState(medication?.refill_reminder_days?.toString() || "");
  const [quantityRemaining, setQuantityRemaining] = useState(medication?.quantity_remaining?.toString() || "");

  const handleAddTime = () => {
    if (timeInput && !timesOfDay.includes(timeInput)) {
      setTimesOfDay([...timesOfDay, timeInput]);
      setTimeInput("");
    }
  };

  const handleRemoveTime = (time: string) => {
    setTimesOfDay(timesOfDay.filter((t) => t !== time));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      pet_id: petId,
      name,
      dosage,
      dosage_unit: dosageUnit,
      frequency: frequency as MedicationFormData["frequency"],
      custom_frequency: frequency === "custom" ? customFrequency : null,
      times_of_day: timesOfDay,
      purpose: purpose || null,
      side_effects: sideEffects || null,
      instructions: instructions || null,
      prescribing_vet: prescribingVet || null,
      start_date: startDate,
      end_date: endDate || null,
      refill_reminder_days: refillReminderDays ? parseInt(refillReminderDays) : null,
      quantity_remaining: quantityRemaining ? parseInt(quantityRemaining) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pet *</label>
        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
        >
          <option value="">Select a pet...</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.id}>{pet.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., Rimadyl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="e.g., 25"
            />
            <select
              value={dosageUnit}
              onChange={(e) => setDosageUnit(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            {frequencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {frequency === "custom" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Schedule</label>
            <input
              type="text"
              value={customFrequency}
              onChange={(e) => setCustomFrequency(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="e.g., Every 3 days"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Times of Day</label>
        <div className="flex gap-2">
          <input
            type="time"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
          <button
            type="button"
            onClick={handleAddTime}
            className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
          >
            Add Time
          </button>
        </div>
        {timesOfDay.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {timesOfDay.map((time) => (
              <span key={time} className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700">
                {time}
                <button type="button" onClick={() => handleRemoveTime(time)} className="text-purple-400 hover:text-purple-600">&times;</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / What it does</label>
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          placeholder="e.g., Pain relief for arthritis"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
          placeholder="e.g., Give with food, do not crush tablets"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Side Effects to Watch For</label>
        <textarea
          value={sideEffects}
          onChange={(e) => setSideEffects(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
          placeholder="e.g., Appetite loss, lethargy"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prescribing Vet</label>
          <input
            type="text"
            value={prescribingVet}
            onChange={(e) => setPrescribingVet(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="Dr. Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Remaining</label>
          <input
            type="number"
            value={quantityRemaining}
            onChange={(e) => setQuantityRemaining(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., 30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Refill Reminder (days)</label>
          <input
            type="number"
            value={refillReminderDays}
            onChange={(e) => setRefillReminderDays(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., 7"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : medication ? "Update Medication" : "Add Medication"}
        </button>
      </div>
    </form>
  );
}
