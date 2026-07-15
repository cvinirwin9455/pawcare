"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

const mobileNavItems = [
  { name: "Home", href: "/dashboard", icon: "📊" },
  { name: "Pets", href: "/pets", icon: "🐾" },
  { name: "Meds", href: "/medications", icon: "💊" },
  { name: "Appts", href: "/appointments", icon: "📅" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="flex items-center justify-around py-2 px-1 safe-area-pb">
        {mobileNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-[56px] transition-colors",
                isActive
                  ? "text-purple-700"
                  : "text-gray-500"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const isDashboardHome = pathname === "/dashboard";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          router.push("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🐾</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Show the navigation sidebar only on non-dashboard pages */}
      {!isDashboardHome && <Sidebar />}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-white px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <span className="font-bold text-purple-700">Paw Tender Care</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">
                Welcome, <span className="font-medium text-gray-900">{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</span>
              </p>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>
        <main
          className={cn(
            "flex-1 overflow-hidden",
            isDashboardHome
              ? "" // Dashboard manages its own padding/scrolling (has sidebar inside)
              : "overflow-y-auto p-4 md:p-6 pb-24 md:pb-6"
          )}
        >
          {children}
        </main>
        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
