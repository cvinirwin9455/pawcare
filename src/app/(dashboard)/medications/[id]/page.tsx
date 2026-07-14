import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getFrequencyLabel, getSeverityColor, formatDate } from "@/lib/utils";

export default async function MedicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: medication } = await supabase
    .from("medications")
    .select("*, pets(name, species)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!medication) {
    notFound();
  }

  // Get interactions for this medication
  const { data: interactions } = await supabase
    .from("drug_interactions")
    .select("*, medication_a:medications!medication_a_id(name), medication_b:medications!medication_b_id(name)")
    .eq("user_id", user.id)
    .or(`medication_a_id.eq.${params.id},medication_b_id.eq.${params.id}`);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/medications"
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          &larr; Back to Medications
        </Link>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {medication.name}
              </h1>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {(medication as any).pets?.name}
              </span>
            </div>
            {medication.purpose && (
              <p className="text-gray-600 mt-1">{medication.purpose}</p>
            )}
          </div>
          <Link
            href={`/medications/${medication.id}/edit`}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Dosage</p>
            <p className="text-sm font-medium text-gray-900">
              {medication.dosage} {medication.dosage_unit}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Frequency</p>
            <p className="text-sm font-medium text-gray-900">
              {getFrequencyLabel(medication.frequency)}
              {medication.custom_frequency && ` (${medication.custom_frequency})`}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Started</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(medication.start_date)}
            </p>
          </div>
          {medication.end_date && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Ends</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(medication.end_date)}
              </p>
            </div>
          )}
          {medication.prescribing_vet && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Prescribed By</p>
              <p className="text-sm font-medium text-gray-900">
                {medication.prescribing_vet}
              </p>
            </div>
          )}
          {medication.quantity_remaining !== null && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-sm font-medium text-gray-900">
                {medication.quantity_remaining} doses
              </p>
            </div>
          )}
        </div>

        {medication.times_of_day && medication.times_of_day.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Schedule</p>
            <div className="flex flex-wrap gap-2">
              {medication.times_of_day.map((time) => (
                <span
                  key={time}
                  className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {medication.instructions && (
          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-600 font-medium">Instructions</p>
            <p className="text-sm text-blue-800 mt-1">
              {medication.instructions}
            </p>
          </div>
        )}

        {medication.side_effects && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-600 font-medium">
              Side Effects to Watch
            </p>
            <p className="text-sm text-amber-800 mt-1">
              {medication.side_effects}
            </p>
          </div>
        )}
      </div>

      {/* Interactions */}
      {interactions && interactions.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Known Interactions
          </h2>
          <div className="space-y-3">
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className={`rounded-lg border p-4 ${getSeverityColor(interaction.severity)}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {(interaction.medication_a as any)?.name} &harr;{" "}
                    {(interaction.medication_b as any)?.name}
                  </span>
                  <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-white/50">
                    {interaction.severity}
                  </span>
                </div>
                <p className="text-sm mt-2">{interaction.description}</p>
                {interaction.recommendation && (
                  <p className="text-xs mt-1 opacity-80">
                    {interaction.recommendation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
