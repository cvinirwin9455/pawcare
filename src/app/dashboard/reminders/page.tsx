import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell, Check } from "lucide-react";
import Link from "next/link";
import { formatDate, formatRelativeDate } from "@/lib/utils";
import { ToggleReminderButton } from "./toggle-button";

export default async function RemindersPage() {
  const supabase = createServerClient();
  const { data: reminders } = await supabase
    .from("reminders")
    .select("*, pets(name)")
    .order("is_completed", { ascending: true })
    .order("remind_at", { ascending: true });

  const reminderTypeIcons: Record<string, string> = {
    medication: "💊",
    appointment: "📅",
    feeding: "🍖",
    grooming: "✂️",
    exercise: "🏃",
    custom: "📌",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">
            Never forget your pet care tasks
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/reminders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Reminder
          </Link>
        </Button>
      </div>

      {reminders && reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder: any) => {
            const isPast = new Date(reminder.remind_at) < new Date();
            const isOverdue = isPast && !reminder.is_completed;

            return (
              <Card
                key={reminder.id}
                className={reminder.is_completed ? "opacity-60" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <ToggleReminderButton
                      reminderId={reminder.id}
                      isCompleted={reminder.is_completed}
                    />
                    <div className="text-2xl">
                      {reminderTypeIcons[reminder.reminder_type] || "📌"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium truncate ${
                          reminder.is_completed ? "line-through" : ""
                        }`}
                      >
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {reminder.pets?.name && `${reminder.pets.name} • `}
                        {formatDate(reminder.remind_at, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                      {reminder.description && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {reminder.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                      {reminder.is_recurring && (
                        <Badge variant="secondary" className="text-xs">
                          {reminder.frequency}
                        </Badge>
                      )}
                      {reminder.is_completed && (
                        <Badge variant="secondary" className="text-xs">
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-1">No reminders</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Set up reminders for your pet care tasks
            </p>
            <Button asChild>
              <Link href="/dashboard/reminders/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Reminder
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
