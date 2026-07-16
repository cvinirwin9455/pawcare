"use client";

import { cn } from "@/lib/utils";
import type { Pet } from "@/types/database";
import Link from "next/link";

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  rabbit: "🐰",
  reptile: "🦎",
  other: "🐾",
};

interface PetSidebarProps {
  pets: Pet[];
  selectedPetId: string | null;
  onSelectPet: (petId: string | null) => void;
  taskCounts: Record<string, { total: number; completed: number }>;
}

export function PetSidebar({ pets, selectedPetId, onSelectPet, taskCounts }: PetSidebarProps) {
  // For single-pet users, don't render the full sidebar
  if (pets.length <= 1) {
    return null;
  }

  // Calculate total tasks across all pets
  const allPetsTotal = Object.values(taskCounts).reduce((sum, c) => sum + c.total, 0);
  const allPetsCompleted = Object.values(taskCounts).reduce((sum, c) => sum + c.completed, 0);

  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col border-r bg-white flex-shrink-0">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-5">
        <h2 className="text-sm font-semibold text-gray-900 tracking-wide">My Pets</h2>
        <Link
          href="/pets/new"
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md transition-colors"
        >
          + Add
        </Link>
      </div>

      {/* Pet List */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {/* All Pets button */}
        <button
          onClick={() => onSelectPet(null)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all mb-2",
            selectedPetId === null
              ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
          )}
        >
          <span className="text-lg">📋</span>
          <div className="flex-1 text-left">
            <span>All Pets</span>
          </div>
          {allPetsTotal > 0 && (
            <TaskBadge total={allPetsTotal} completed={allPetsCompleted} />
          )}
        </button>

        <div className="h-px bg-gray-100 mx-2 my-3" />

        {/* Individual Pets */}
        <div className="space-y-1">
          {pets.map((pet) => {
            const counts = taskCounts[pet.id] || { total: 0, completed: 0 };
            const isSelected = selectedPetId === pet.id;

            return (
              <button
                key={pet.id}
                onClick={() => onSelectPet(pet.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                  isSelected
                    ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                )}
              >
                <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {speciesEmoji[pet.species] || "🐾"}
                  </span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className={cn("font-medium truncate", isSelected ? "text-purple-700" : "text-gray-900")}>
                    {pet.name}
                  </p>
                  {pet.breed && (
                    <p className="text-[11px] text-gray-400 truncate capitalize">
                      {pet.breed}
                    </p>
                  )}
                </div>
                {counts.total > 0 && (
                  <TaskBadge total={counts.total} completed={counts.completed} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Add Pet Link at Bottom */}
      <div className="border-t p-3">
        <Link
          href="/pets/new"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <span className="text-base">➕</span>
          Add Another Pet
        </Link>
      </div>
    </aside>
  );
}

/** Compact pet header for single-pet users - displayed inline in the dashboard */
export function SinglePetHeader({ pet, taskCount }: { pet: Pet; taskCount: { total: number; completed: number } }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-xl border shadow-sm px-5 py-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-purple-50 rounded-full flex items-center justify-center">
          <span className="text-2xl">{speciesEmoji[pet.species] || "🐾"}</span>
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 text-lg">{pet.name}</h2>
          <p className="text-sm text-gray-500 capitalize">
            {pet.breed ? `${pet.breed} ${pet.species}` : pet.species}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {taskCount.total > 0 && (
          <div className="text-right mr-2">
            <p className="text-xs text-gray-400">Today</p>
            <p className="text-sm font-bold text-gray-700">
              {taskCount.completed}/{taskCount.total}
            </p>
          </div>
        )}
        <Link
          href={`/pets/${pet.id}`}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Profile
        </Link>
        <Link
          href="/pets/new"
          className="text-xs text-gray-500 hover:text-gray-700 font-medium border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          + Add Pet
        </Link>
      </div>
    </div>
  );
}

function TaskBadge({ total, completed }: { total: number; completed: number }) {
  const allDone = completed >= total;

  if (allDone) {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold">
        ✓
      </span>
    );
  }

  return (
    <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
      {total - completed}
    </span>
  );
}
