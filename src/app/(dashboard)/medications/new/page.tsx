"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MedicationForm } from "@/components/medications/MedicationForm";
import type { MedicationFormData } from "@/lib/validations";
import type { Pet } from "@/types/database";

export default function NewMedicationPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPetId = searchParams.get("pet") || undefined;
  const supabase = createClient();

  useEffect(() => {
    async function fetchPets() {
      const { data } = await supabase
        .from("pets")
        .select("*")
        .eq("is_active", true)
        .order("name");
      setPets(data || []);
    }
    fetchPets();
  }, []);

  const handleSubmit = async (data: MedicationFormData) => {
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

      const { error: dbError } = await supabase.from("medications").insert({
        user_id: user.id,
        pet_id: data.pet_id,
        name: data.name,
        dosage: data.dosage,
        dosage_unit: data.dosage_unit,
        frequency: data.frequency,
        custom_frequency: data.custom_frequency,
        times_of_day: data.times_of_day,
        purpose: data.purpose,
        side_effects: data.side_effects,
        instructions: data.instructions,
        prescribing_vet: data.prescribing_vet,
        start_date: data.start_date,
        end_date: data.end_date,
        refill_reminder_days: data.refill_reminder_days,
        quantity_remaining: data.quantity_remaining,
      });

      if (dbError) {
        setError(dbError.message);
        return;
      }

      router.push("/medications");
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
          href="/medications"
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          &larr; Back to Medications
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Add Medication
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track a new medication for your pet
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <MedicationForm
          pets={pets}
          defaultPetId={defaultPetId}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
