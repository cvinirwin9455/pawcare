"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Today", href: "/dashboard", icon: "📋" },
  { name: "My Pets", href: "/pets", icon: "🐾" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

const secondaryNavigation = [
  { name: "Medications", href: "/medications", icon: "💊" },
  { name: "Appointments", href: "/appointments", icon: "📅" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex h-full flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold text-purple-700">Paw Tender Care</span>
        </div>

        <nav className="flex-1 px-3 py-4">
          {/* Primary Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-2 my-4" />

          {/* Secondary Navigation */}
          <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Records</p>
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
