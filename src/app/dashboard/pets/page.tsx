import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, PawPrint } from "lucide-react";
import Link from "next/link";
import { getSpeciesEmoji, calculateAge } from "@/lib/utils";

export default async function PetsPage() {
  const supabase = createServerClient();
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Pets</h1>
          <p className="text-muted-foreground">Manage your pet profiles</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pets/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Pet
          </Link>
        </Button>
      </div>

      {pets && pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <Link key={pet.id} href={`/dashboard/pets/${pet.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {getSpeciesEmoji(pet.species)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {pet.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {pet.breed || pet.species}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pet.gender && (
                          <Badge variant="secondary" className="text-xs capitalize">
                            {pet.gender}
                          </Badge>
                        )}
                        {pet.date_of_birth && (
                          <Badge variant="secondary" className="text-xs">
                            {calculateAge(pet.date_of_birth)}
                          </Badge>
                        )}
                        {pet.weight && (
                          <Badge variant="secondary" className="text-xs">
                            {pet.weight} {pet.weight_unit}
                          </Badge>
                        )}
                      </div>
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
            <PawPrint className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No pets yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add your first pet to get started
            </p>
            <Button asChild>
              <Link href="/dashboard/pets/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Pet
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
