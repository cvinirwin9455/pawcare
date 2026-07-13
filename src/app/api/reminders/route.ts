import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, buildMedicationReminderEmail, buildAppointmentReminderEmail } from "@/lib/email";
import { getAppointmentTypeLabel, formatDateTime } from "@/lib/utils";

// This endpoint is called by Vercel Cron
// Vercel cron config in vercel.json triggers this every 15 minutes

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60000);

    // Get pending reminders that should be sent now
    const { data: reminders, error } = await supabaseAdmin
      .from("reminders")
      .select("*, profiles:user_id(email, reminder_email), pets(name)")
      .eq("status", "pending")
      .lte("scheduled_at", fifteenMinutesFromNow.toISOString())
      .gte("scheduled_at", new Date(now.getTime() - 60 * 60000).toISOString());

    if (error) {
      console.error("Error fetching reminders:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const reminder of reminders || []) {
      try {
        const profile = (reminder as any).profiles;
        const pet = (reminder as any).pets;
        const emailTo = profile?.reminder_email || profile?.email;

        if (!emailTo) continue;

        let emailContent;

        if (reminder.type === "medication") {
          // Fetch medication details
          const { data: med } = await supabaseAdmin
            .from("medications")
            .select("*")
            .eq("id", reminder.reference_id)
            .single();

          if (!med) continue;

          emailContent = buildMedicationReminderEmail({
            petName: pet?.name || "your pet",
            medicationName: med.name,
            dosage: `${med.dosage} ${med.dosage_unit}`,
            instructions: med.instructions || undefined,
            time: formatDateTime(reminder.scheduled_at),
          });
        } else if (reminder.type === "appointment") {
          const { data: apt } = await supabaseAdmin
            .from("appointments")
            .select("*")
            .eq("id", reminder.reference_id)
            .single();

          if (!apt) continue;

          emailContent = buildAppointmentReminderEmail({
            petName: pet?.name || "your pet",
            appointmentTitle: apt.title,
            type: getAppointmentTypeLabel(apt.type),
            dateTime: formatDateTime(apt.date_time),
            providerName: apt.provider_name || undefined,
            providerAddress: apt.provider_address || undefined,
            notes: apt.notes || undefined,
          });
        }

        if (emailContent) {
          await sendEmail({
            to: emailTo,
            subject: emailContent.subject,
            html: emailContent.html,
          });

          await supabaseAdmin
            .from("reminders")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", reminder.id);

          sentCount++;
        }
      } catch (emailError) {
        console.error(`Failed to send reminder ${reminder.id}:`, emailError);
        await supabaseAdmin
          .from("reminders")
          .update({ status: "failed" })
          .eq("id", reminder.id);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      failed: failedCount,
      total: reminders?.length || 0,
    });
  } catch (error) {
    console.error("Reminder cron error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
