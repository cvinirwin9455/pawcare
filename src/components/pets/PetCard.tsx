import Link from "next/link";
import { calculateAge } from "@/lib/utils";
import type { Pet } from "@/types/database";

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  rabbit: "🐰",
  reptile: "🦎",
  other: "🐾",
};

export function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link
      href={`/pets/${pet.id}`}
      className="block rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {speciesEmoji[pet.species] || "🐾"}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {pet.breed ? `${pet.breed} ${pet.species}` : pet.species}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {pet.date_of_birth && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🎂</span>
            <span>{calculateAge(pet.date_of_birth)}</span>
          </div>
        )}
        {pet.weight && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>⚖️</span>
            <span>
              {pet.weight} {pet.weight_unit}
            </span>
          </div>
        )}
        {pet.conditions && pet.conditions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {pet.conditions.slice(0, 3).map((condition) => (
              <span
                key={condition}
                className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700"
              >
                {condition}
              </span>
            ))}
            {pet.conditions.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                +{pet.conditions.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
