"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Pet } from "@/lib/types/database";

const recordTypes = [
  { value: "vaccination", label: "Vaccination" },
  { value: "lab_result", label: "Lab Result" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "procedure", label: "Procedure" },
  { value: "weight_check", label: "Weight Check" },
  { value: "note", label: "Note" },
];


export default function NewHealthRecordPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchPets() {
      const { data } = await supabase.from("pets").select("*").eq("is_active", true);
      setPets(data || []);
    }
    fetchPets();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not logged in"); setLoading(false); return; }

    const recordData = {
      owner_id: user.id,
      pet_id: formData.get("pet_id") as string,
      record_type: formData.get("record_type") as string,
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      record_date: formData.get("record_date") as string,
    };

    const { error: insertError } = await supabase
      .from("health_records").insert(recordData);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push("/dashboard/health-records");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/health-records">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Health Record</h1>
          <p className="text-muted-foreground">Record a health event</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet_id">Pet *</Label>
                <Select name="pet_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>{pet.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="record_type">Type *</Label>
                <Select name="record_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" placeholder="e.g., Rabies Vaccine" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="record_date">Date *</Label>
                <Input id="record_date" name="record_date" type="date" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Details..." rows={3} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" asChild>
                <Link href="/dashboard/health-records">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
