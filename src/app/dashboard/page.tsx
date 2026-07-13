import { createServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Calendar, Pill, Bell } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [
    { count: petCount },
    { count: appointmentCount },
    { count: medicationCount },
    { count: reminderCount },
  ] = await Promise.all([
    supabase.from("pets").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("medications").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("reminders").select("*", { count: "exact", head: true }).eq("is_completed", false),
  ]);

  const { data: upcomingAppointments } = await supabase
    .from("appointments")
    .select("*, pets(name, species)")
    .eq("status", "scheduled")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(5);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id ?? "")
    .single();

  const stats = [
    { name: "Active Pets", value: petCount ?? 0, icon: PawPrint, href: "/dashboard/pets", color: "text-blue-600 bg-blue-100" },
    { name: "Upcoming Appointments", value: appointmentCount ?? 0, icon: Calendar, href: "/dashboard/appointments", color: "text-green-600 bg-green-100" },
    { name: "Active Medications", value: medicationCount ?? 0, icon: Pill, href: "/dashboard/medications", color: "text-purple-600 bg-purple-100" },
    { name: "Pending Reminders", value: reminderCount ?? 0, icon: Bell, href: "/dashboard/reminders", color: "text-orange-600 bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}! &#x1F43E;
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your pets&apos; care
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
          <Link
            href="/dashboard/appointments"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt: any) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{apt.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {apt.pets?.name} &bull;{" "}
                      {new Date(apt.starts_at).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                    {apt.appointment_type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No upcoming appointments</p>
              <Link
                href="/dashboard/appointments/new"
                className="text-primary hover:underline text-sm"
              >
                Schedule one now
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
