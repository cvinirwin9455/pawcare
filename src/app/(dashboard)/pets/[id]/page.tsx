import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { calculateAge, getFrequencyLabel } from "@/lib/utils";
import { DeletePetButton } from "@/components/pets/DeletePetButton";

export default async function PetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .single();

  if (!pet) {
    notFound();
  }

  const { data: medications } = await supabase
    .from("medications")
    .select("*")
    .eq("pet_id", pet.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("pet_id", pet.id)
    .eq("status", "scheduled")
    .gte("date_time", new Date().toISOString())
    .order("date_time", { ascending: true })
    .limit(5);

  const speciesEmoji: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    rabbit: "🐰",
    reptile: "🦎",
    other: "🐾",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/pets"
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          &larr; Back to Pets
        </Link>
      </div>

      {/* Pet Header */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">
              {speciesEmoji[pet.species] || "🐾"}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-500 capitalize">
                {pet.breed ? `${pet.breed} ${pet.species}` : pet.species}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/pets/${pet.id}/edit`}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            <DeletePetButton petId={pet.id} petName={pet.name} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {pet.date_of_birth && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Age</p>
              <p className="text-sm font-medium text-gray-900">
                {calculateAge(pet.date_of_birth)}
              </p>
            </div>
          )}
          {pet.weight && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Weight</p>
              <p className="text-sm font-medium text-gray-900">
                {pet.weight} {pet.weight_unit}
              </p>
            </div>
          )}
          {pet.conditions && pet.conditions.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Conditions</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {pet.conditions.map((condition: string) => (
                  <span
                    key={condition}
                    className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {pet.notes && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Notes</p>
            <p className="text-sm text-gray-700 mt-1">{pet.notes}</p>
          </div>
        )}
      </div>

      {/* Active Medications */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Medications
          </h2>
          <Link
            href={`/medications/new?pet=${pet.id}`}
            className="text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            + Add Medication
          </Link>
        </div>

        {!medications || medications.length === 0 ? (
          <p className="text-sm text-gray-500">No active medications.</p>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <Link
                key={med.id}
                href={`/medications/${med.id}`}
                className="block rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{med.name}</h3>
                    <p className="text-sm text-gray-500">
                      {med.dosage} {med.dosage_unit} &middot;{" "}
                      {getFrequencyLabel(med.frequency)}
                    </p>
                  </div>
                  {med.purpose && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {med.purpose}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Appointments
          </h2>
          <Link
            href={`/appointments/new?pet=${pet.id}`}
            className="text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            + Schedule Appointment
          </Link>
        </div>

        {!appointments || appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming appointments.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <Link
                key={apt.id}
                href={`/appointments/${apt.id}`}
                className="block rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{apt.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.date_time).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-xs capitalize text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {apt.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
