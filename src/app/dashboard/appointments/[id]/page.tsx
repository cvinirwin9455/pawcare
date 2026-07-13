import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Clock, User } from "lucide-react";
import Link from "next/link";
import {
  formatDate,
  getAppointmentTypeColor,
  getStatusColor,
} from "@/lib/utils";
import { AppointmentActions } from "./actions";

export default async function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: appointment } = await supabase
    .from("appointments")
    .select("*, pets(name, species), veterinarians(name, clinic_name, phone)")
    .eq("id", params.id)
    .single();

  if (!appointment) notFound();

  const apt = appointment as any;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/appointments">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{apt.title}</h1>
          <p className="text-muted-foreground">
            {apt.pets?.name} &bull;{" "}
            {formatDate(apt.starts_at, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <AppointmentActions appointmentId={apt.id} status={apt.status} />
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getAppointmentTypeColor(apt.appointment_type)}>
              {apt.appointment_type}
            </Badge>
            <Badge className={getStatusColor(apt.status)}>
              {apt.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(apt.starts_at, "h:mm a")}
                  {apt.ends_at && ` - ${formatDate(apt.ends_at, "h:mm a")}`}
                </p>
              </div>
            </div>


            {apt.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{apt.location}</p>
                </div>
              </div>
            )}

            {apt.veterinarians && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Veterinarian</p>
                  <p className="text-sm text-muted-foreground">
                    {apt.veterinarians.name}
                    {apt.veterinarians.clinic_name &&
                      ` - ${apt.veterinarians.clinic_name}`}
                  </p>
                  {apt.veterinarians.phone && (
                    <p className="text-xs text-muted-foreground">
                      {apt.veterinarians.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {apt.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm text-muted-foreground">{apt.description}</p>
              </div>
            </>
          )}

          {apt.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{apt.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
