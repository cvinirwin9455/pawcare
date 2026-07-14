import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getFrequencyLabel, getSeverityColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MedicationsPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: medications } = await supabase
    .from("medications")
    .select("*, pets(name, species)")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: interactions } = await supabase
    .from("drug_interactions")
    .select("*, medication_a:medications!medication_a_id(name), medication_b:medications!medication_b_id(name)")
    .eq("user_id", user!.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track all medications and interactions
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/medications/interactions/new"
            className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
          >
            + Add Interaction
          </Link>
          <Link
            href="/medications/new"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            + Add Medication
          </Link>
        </div>
      </div>

      {/* Drug Interaction Warnings */}
      {interactions && interactions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Drug Interaction Warnings
          </h2>
          <div className="space-y-2">
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`rounded-lg border p-4 ${getSeverityColor(interaction.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">
                      {(interaction.medication_a as any)?.name} &harr;{" "}
                      {(interaction.medication_b as any)?.name}
                    </span>
                    <span className="ml-2 text-xs uppercase font-semibold">
                      ({interaction.severity})
                    </span>
                  </div>
                </div>
                <p className="text-sm mt-1">{interaction.description}</p>
                {interaction.recommendation && (
                  <p className="text-xs mt-1 opacity-80">
                    Recommendation: {interaction.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications List */}
      {!medications || medications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="text-5xl mb-4">💊</div>
          <h3 className="text-lg font-medium text-gray-900">
            No medications yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Add your pet's first medication to start tracking.
          </p>
          <Link
            href="/medications/new"
            className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            Add First Medication
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <Link
              key={med.id}
              href={`/medications/${med.id}`}
              className="block bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{med.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {(med as any).pets?.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {med.dosage} {med.dosage_unit} &middot;{" "}
                    {getFrequencyLabel(med.frequency)}
                  </p>
                  {med.purpose && (
                    <p className="text-sm text-gray-600 mt-1">
                      Purpose: {med.purpose}
                    </p>
                  )}
                </div>
                {med.times_of_day && med.times_of_day.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {med.times_of_day.map((time: string) => (
                      <span
                        key={time}
                        className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
