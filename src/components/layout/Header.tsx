"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface HeaderProps {
  user: User;
  profile: Profile | null;
}

export function Header({ user, profile }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4 md:hidden">
        <span className="text-xl">🐾</span>
        <span className="font-bold text-purple-700">PawCare</span>
      </div>

      <div className="hidden md:block">
        <h2 className="text-sm text-gray-500">
          Welcome back,{" "}
          <span className="font-medium text-gray-900">
            {profile?.full_name || user.email}
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSignOut}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
