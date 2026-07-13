"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PetForm } from "@/components/pets/PetForm";
import type { PetFormData } from "@/lib/validations";

export default function NewPetPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (data: PetFormData) => {
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

      const { error: dbError } = await supabase.from("pets").insert({
        user_id: user.id,
        name: data.name,
        species: data.species,
        breed: data.breed || null,
        date_of_birth: data.date_of_birth || null,
        weight: data.weight || null,
        weight_unit: data.weight_unit,
        conditions: data.conditions,
        notes: data.notes || null,
      });

      if (dbError) {
        setError(dbError.message);
        return;
      }

      router.push("/pets");
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
          href="/pets"
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          &larr; Back to Pets
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Add a New Pet
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your pet's details to start tracking their health
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <PetForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
