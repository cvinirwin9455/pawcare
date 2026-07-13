"use client";

import { useState } from "react";
import type { PetFormData } from "@/lib/validations";
import type { Pet } from "@/types/database";

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: PetFormData) => Promise<void>;
  loading: boolean;
}

const speciesOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "rabbit", label: "Rabbit" },
  { value: "reptile", label: "Reptile" },
  { value: "other", label: "Other" },
];

export function PetForm({ pet, onSubmit, loading }: PetFormProps) {
  const [name, setName] = useState(pet?.name || "");
  const [species, setSpecies] = useState(pet?.species || "dog");
  const [breed, setBreed] = useState(pet?.breed || "");
  const [dateOfBirth, setDateOfBirth] = useState(pet?.date_of_birth || "");
  const [weight, setWeight] = useState(pet?.weight?.toString() || "");
  const [weightUnit, setWeightUnit] = useState(pet?.weight_unit || "kg");
  const [conditions, setConditions] = useState<string[]>(
    pet?.conditions || []
  );
  const [conditionInput, setConditionInput] = useState("");
  const [notes, setNotes] = useState(pet?.notes || "");

  const handleAddCondition = () => {
    if (conditionInput.trim() && !conditions.includes(conditionInput.trim())) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput("");
    }
  };

  const handleRemoveCondition = (condition: string) => {
    setConditions(conditions.filter((c) => c !== condition));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      species: species as PetFormData["species"],
      breed: breed || null,
      date_of_birth: dateOfBirth || null,
      weight: weight ? parseFloat(weight) : null,
      weight_unit: weightUnit as "kg" | "lbs",
      conditions,
      notes: notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., Bella"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Species *
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          >
            {speciesOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Breed
          </label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., Golden Retriever"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="0.0"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conditions / Diagnoses
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={conditionInput}
            onChange={(e) => setConditionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCondition();
              }
            }}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g., Arthritis, Hip Dysplasia"
          />
          <button
            type="button"
            onClick={handleAddCondition}
            className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
          >
            Add
          </button>
        </div>
        {conditions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {conditions.map((condition) => (
              <span
                key={condition}
                className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700"
              >
                {condition}
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(condition)}
                  className="text-purple-400 hover:text-purple-600 ml-1"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
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
          placeholder="Any additional notes about your pet..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Saving..." : pet ? "Update Pet" : "Add Pet"}
        </button>
      </div>
    </form>
  );
}
