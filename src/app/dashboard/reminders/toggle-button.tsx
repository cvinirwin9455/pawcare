"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, Circle } from "lucide-react";

export function ToggleReminderButton({
  reminderId,
  isCompleted,
}: {
  reminderId: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  const toggle = async () => {
    await supabase
      .from("reminders")
      .update({ is_completed: !isCompleted })
      .eq("id", reminderId);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors hover:border-primary"
      style={{
        borderColor: isCompleted ? "hsl(var(--primary))" : undefined,
        backgroundColor: isCompleted ? "hsl(var(--primary))" : undefined,
      }}
    >
      {isCompleted && <Check className="h-3.5 w-3.5 text-white" />}
    </button>
  );
}
