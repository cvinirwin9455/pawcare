"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Check, X, Trash2 } from "lucide-react";

export function AppointmentActions({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);
    router.refresh();
    setLoading(false);
  };

  const deleteAppointment = async () => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    setLoading(true);
    await supabase.from("appointments").delete().eq("id", appointmentId);
    router.push("/dashboard/appointments");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={loading}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "scheduled" && (
          <DropdownMenuItem onClick={() => updateStatus("completed")}>
            <Check className="mr-2 h-4 w-4" />
            Mark Completed
          </DropdownMenuItem>
        )}
        {status === "scheduled" && (
          <DropdownMenuItem onClick={() => updateStatus("cancelled")}>
            <X className="mr-2 h-4 w-4" />
            Cancel Appointment
          </DropdownMenuItem>
        )}
        {status !== "scheduled" && (
          <DropdownMenuItem onClick={() => updateStatus("scheduled")}>
            <Check className="mr-2 h-4 w-4" />
            Reschedule
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={deleteAppointment}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
