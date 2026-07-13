import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Stethoscope, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default async function VetsPage() {
  const supabase = createServerClient();
  const { data: vets } = await supabase
    .from("veterinarians")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Veterinarians</h1>
          <p className="text-muted-foreground">
            Manage your vet contacts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/vets/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Vet
          </Link>
        </Button>
      </div>

      {vets && vets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vets.map((vet) => (
            <Card key={vet.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Stethoscope className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{vet.name}</h3>
                    {vet.clinic_name && (
                      <p className="text-sm text-muted-foreground">
                        {vet.clinic_name}
                      </p>
                    )}
                    <div className="mt-3 space-y-1.5">
                      {vet.phone && (
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {vet.phone}
                        </p>
                      )}
                      {vet.email && (
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {vet.email}
                        </p>
                      )}
                      {vet.address && (
                        <p className="text-sm flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {vet.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Stethoscope className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No veterinarians</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add your vet&apos;s contact information
            </p>
            <Button asChild>
              <Link href="/dashboard/vets/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Veterinarian
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
