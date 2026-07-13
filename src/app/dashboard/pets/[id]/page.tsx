import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Calendar, Pill, FileHeart } from "lucide-react";
import Link from "next/link";
import { getSpeciesEmoji, calculateAge, formatDate } from "@/lib/utils";
import { DeletePetButton } from "./delete-button";

export default async function PetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!pet) {
    notFound();
  }

  const [
    { data: appointments },
    { data: medications },
    { data: healthRecords },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*")
      .eq("pet_id", pet.id)
      .order("starts_at", { ascending: false })
      .limit(5),
    supabase
      .from("medications")
      .select("*")
      .eq("pet_id", pet.id)
      .eq("is_active", true),
    supabase
      .from("health_records")
      .select("*")
      .eq("pet_id", pet.id)
      .order("record_date", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/pets">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getSpeciesEmoji(pet.species)}</span>
            <div>
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              <p className="text-muted-foreground capitalize">
                {pet.breed || pet.species}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/pets/${pet.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeletePetButton petId={pet.id} petName={pet.name} />
        </div>
      </div>

      {/* Pet Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pet.gender && (
              <div>
                <p className="text-xs text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{pet.gender}</p>
              </div>
            )}
            {pet.date_of_birth && (
              <div>
                <p className="text-xs text-muted-foreground">Age</p>
                <p className="font-medium">{calculateAge(pet.date_of_birth)}</p>
              </div>
            )}
            {pet.date_of_birth && (
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{formatDate(pet.date_of_birth, "MMM d, yyyy")}</p>
              </div>
            )}
            {pet.weight && (
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="font-medium">{pet.weight} {pet.weight_unit}</p>
              </div>
            )}
            {pet.color && (
              <div>
                <p className="text-xs text-muted-foreground">Color</p>
                <p className="font-medium">{pet.color}</p>
              </div>
            )}
            {pet.microchip_id && (
              <div>
                <p className="text-xs text-muted-foreground">Microchip ID</p>
                <p className="font-medium font-mono text-xs">{pet.microchip_id}</p>
              </div>
            )}
          </div>
          {pet.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{pet.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                <Calendar className="inline h-4 w-4 mr-2" />
                Appointments
              </CardTitle>
              <Badge variant="secondary">{appointments?.length ?? 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-2">
                {appointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="text-sm">
                    <p className="font-medium truncate">{apt.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(apt.starts_at, "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No appointments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                <Pill className="inline h-4 w-4 mr-2" />
                Medications
              </CardTitle>
              <Badge variant="secondary">{medications?.length ?? 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {medications && medications.length > 0 ? (
              <div className="space-y-2">
                {medications.slice(0, 3).map((med) => (
                  <div key={med.id} className="text-sm">
                    <p className="font-medium truncate">{med.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {med.dosage} - {med.frequency}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active medications</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                <FileHeart className="inline h-4 w-4 mr-2" />
                Health Records
              </CardTitle>
              <Badge variant="secondary">{healthRecords?.length ?? 0}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {healthRecords && healthRecords.length > 0 ? (
              <div className="space-y-2">
                {healthRecords.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="text-sm">
                    <p className="font-medium truncate">{rec.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(rec.record_date, "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No records</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
