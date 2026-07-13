import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { calculateAge } from "@/lib/utils";
import { PetCard } from "@/components/pets/PetCard";

export const dynamic = "force-dynamic";

export default async function PetsPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your pet profiles and health information
          </p>
        </div>
        <Link
          href="/pets/new"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
        >
          + Add Pet
        </Link>
      </div>

      {!pets || pets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <div className="text-5xl mb-4">🐾</div>
          <h3 className="text-lg font-medium text-gray-900">No pets yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Add your first pet to start tracking their health.
          </p>
          <Link
            href="/pets/new"
            className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            Add Your First Pet
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
