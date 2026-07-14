"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Medication } from "@/types/database";

export default function NewInteractionPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medAId, setMedAId] = useState("");
  const [medBId, setMedBId] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [description, setDescription] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchMeds() {
      const { data } = await supabase
        .from("medications")
        .select("*")
        .eq("is_active", true)
        .order("name");
      setMedications(data || []);
    }
    fetchMeds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (medAId === medBId) {
      setError("Please select two different medications");
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: dbError } = await supabase
        .from("drug_interactions")
        .insert({
          user_id: user?.id,
          medication_a_id: medAId,
          medication_b_id: medBId,
          severity: severity as "mild" | "moderate" | "severe",
          description,
          recommendation: recommendation || null,
          source: source || null,
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
          Add Drug Interaction
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Record a known interaction between two medications (from your vet)
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication A *
              </label>
              <select
                value={medAId}
                onChange={(e) => setMedAId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="">Select medication...</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication B *
              </label>
              <select
                value={medBId}
                onChange={(e) => setMedBId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="">Select medication...</option>
                {medications.map((med) => (
                  <option key={med.id} value={med.id}>
                    {med.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity *
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
              placeholder="Describe the interaction and its effects..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recommendation
            </label>
            <textarea
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
              placeholder="What the vet recommends..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="e.g., Dr. Smith, Vet visit 2024-03-15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : "Add Interaction"}
          </button>
        </form>
      </div>
    </div>
  );
}
