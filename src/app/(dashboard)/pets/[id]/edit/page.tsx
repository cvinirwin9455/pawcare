"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PetForm } from "@/components/pets/PetForm";
import type { PetFormData } from "@/lib/validations";
import type { Pet } from "@/types/database";

export default function EditPetPage() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    async function fetchPet() {
      const { data } = await supabase
        .from("pets")
        .select("*")
        .eq("id", params.id as string)
        .single();
      setPet(data);
      setPageLoading(false);
    }
    fetchPet();
  }, [params.id]);

  const handleSubmit = async (data: PetFormData) => {
    setLoading(true);
    setError(null);

    try {
      const { error: dbError } = await supabase
        .from("pets")
        .update({
          name: data.name,
          species: data.species,
          breed: data.breed || null,
          date_of_birth: data.date_of_birth || null,
          weight: data.weight || null,
          weight_unit: data.weight_unit,
          conditions: data.conditions,
          notes: data.notes || null,
        })
        .eq("id", params.id as string);

      if (dbError) {
        setError(dbError.message);
        return;
      }

      router.push(`/pets/${params.id}`);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pet not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/pets/${pet.id}`}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          &larr; Back to {pet.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Edit {pet.name}
        </h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <PetForm pet={pet} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
