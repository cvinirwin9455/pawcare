import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pill } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function MedicationsPage() {
  const supabase = createServerClient();
  const { data: medications } = await supabase
    .from("medications")
    .select("*, pets(name)")
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medications</h1>
          <p className="text-muted-foreground">
            Track your pet&apos;s medications
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/medications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Link>
        </Button>
      </div>

      {medications && medications.length > 0 ? (
        <div className="space-y-3">
          {medications.map((med: any) => (
            <Card key={med.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Pill className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{med.name}</h3>
                      <Badge variant={med.is_active ? "default" : "secondary"}>
                        {med.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {med.pets?.name} &bull; {med.dosage || "No dosage"} &bull;{" "}
                      {med.frequency}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Started {formatDate(med.start_date, "MMM d, yyyy")}
                      {med.end_date &&
                        ` - Ends ${formatDate(med.end_date, "MMM d, yyyy")}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Pill className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No medications</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Track your pet&apos;s medications here
            </p>
            <Button asChild>
              <Link href="/dashboard/medications/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Medication
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
