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
  // Calculate total tasks across all pets
  const allPetsTotal = Object.values(taskCounts).reduce((sum, c) => sum + c.total, 0);
  const allPetsCompleted = Object.values(taskCounts).reduce((sum, c) => sum + c.completed, 0);

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col border-r bg-white">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">My Pets</h2>
        <Link
          href="/pets/new"
          className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          + Add
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {/* All Pets button */}
        <button
          onClick={() => onSelectPet(null)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1",
            selectedPetId === null
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

        <div className="h-px bg-gray-100 mx-2 my-2" />

        {/* Individual Pets */}
        {pets.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <div className="text-3xl mb-2">🐾</div>
            <p className="text-xs text-gray-500">No pets yet</p>
            <Link
              href="/pets/new"
              className="text-xs text-purple-600 hover:text-purple-700 font-medium mt-1 inline-block"
            >
              Add your first pet
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {pets.map((pet) => {
              const counts = taskCounts[pet.id] || { total: 0, completed: 0 };
              const isSelected = selectedPetId === pet.id;

              return (
                <button
                  key={pet.id}
                  onClick={() => onSelectPet(pet.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isSelected
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="text-lg">
                    {speciesEmoji[pet.species] || "🐾"}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <p className={cn("font-medium truncate", isSelected && "text-purple-700")}>
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
        )}
      </nav>

      {/* Quick Nav Links at Bottom */}
      <div className="border-t p-3 space-y-1">
        <NavLink href="/pets" icon="🐾" label="Manage Pets" />
        <NavLink href="/medications" icon="💊" label="Medications" />
        <NavLink href="/appointments" icon="📅" label="Appointments" />
        <NavLink href="/settings" icon="⚙️" label="Settings" />
      </div>
    </aside>
  );
}

function TaskBadge({ total, completed }: { total: number; completed: number }) {
  const allDone = completed >= total;
  const hasOverdue = completed < total;

  if (allDone) {
    return (
      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold">
        ✓
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-[10px] font-bold",
        hasOverdue
          ? "bg-orange-100 text-orange-600"
          : "bg-gray-100 text-gray-500"
      )}
    >
      {total - completed}
    </span>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
