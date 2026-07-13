import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDate, getAppointmentTypeColor, getStatusColor } from "@/lib/utils";

export default async function AppointmentsPage() {
  const supabase = createServerClient();
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, pets(name, species)")
    .order("starts_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your pet&apos;s vet visits and appointments
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((apt: any) => (
            <Link key={apt.id} href={`/dashboard/appointments/${apt.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/5 text-primary">
                      <span className="text-xs font-medium">
                        {formatDate(apt.starts_at, "MMM")}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {formatDate(apt.starts_at, "d")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{apt.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {apt.pets?.name} &bull;{" "}
                        {formatDate(apt.starts_at, "h:mm a")}
                        {apt.location && ` &bull; ${apt.location}`}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge className={getAppointmentTypeColor(apt.appointment_type)}>
                        {apt.appointment_type}
                      </Badge>
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No appointments</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Schedule your first vet appointment
            </p>
            <Button asChild>
              <Link href="/dashboard/appointments/new">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
