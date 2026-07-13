import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileHeart } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function HealthRecordsPage() {
  const supabase = createServerClient();
  const { data: records } = await supabase
    .from("health_records")
    .select("*, pets(name)")
    .order("record_date", { ascending: false });

  const recordTypeColors: Record<string, string> = {
    vaccination: "bg-green-100 text-green-800",
    lab_result: "bg-blue-100 text-blue-800",
    diagnosis: "bg-red-100 text-red-800",
    procedure: "bg-purple-100 text-purple-800",
    weight_check: "bg-orange-100 text-orange-800",
    note: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Health Records</h1>
          <p className="text-muted-foreground">
            View and manage your pets&apos; health history
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/health-records/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Record
          </Link>
        </Button>
      </div>

      {records && records.length > 0 ? (
        <div className="space-y-3">
          {records.map((rec: any) => (
            <Card key={rec.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/5 text-primary">
                    <span className="text-xs font-medium">
                      {formatDate(rec.record_date, "MMM")}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {formatDate(rec.record_date, "d")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {rec.pets?.name}
                      {rec.description && ` - ${rec.description}`}
                    </p>
                  </div>
                  <Badge className={recordTypeColors[rec.record_type] || recordTypeColors.note}>
                    {rec.record_type.replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileHeart className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No health records</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start tracking your pet&apos;s health history
            </p>
            <Button asChild>
              <Link href="/dashboard/health-records/new">
                <Plus className="mr-2 h-4 w-4" />
                Add First Record
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
