import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

// This endpoint is meant to be called by Vercel Cron
// Add to vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "*/15 * * * *" }] }

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
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Get reminders that are due
    const { data: dueReminders, error } = await supabaseAdmin
      .from("reminders")
      .select("*, pets(name), profiles!reminders_owner_id_fkey(email, full_name)")
      .eq("is_completed", false)
      .gte("remind_at", fifteenMinutesAgo.toISOString())
      .lte("remind_at", now.toISOString())
      .is("last_sent_at", null);

    if (error) {
      console.error("Error fetching reminders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let sentCount = 0;

    for (const reminder of dueReminders || []) {
      const profile = (reminder as any).profiles;
      if (!profile?.email) continue;

      try {
        await sendEmail({
          to: profile.email,
          subject: `🔔 Reminder: ${reminder.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c3aed;">🔔 PawCare Reminder</h2>
              <p><strong>${reminder.title}</strong></p>
              ${reminder.pets ? `<p>Pet: ${(reminder as any).pets.name}</p>` : ""}
              ${reminder.description ? `<p>${reminder.description}</p>` : ""}
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="color: #6b7280; font-size: 12px;">
                Sent by PawCare - Your Pet Care Companion
              </p>
            </div>
          `,
        });

        // Mark as sent
        await supabaseAdmin
          .from("reminders")
          .update({ last_sent_at: now.toISOString() })
          .eq("id", reminder.id);

        // If not recurring, mark as completed
        if (!reminder.is_recurring) {
          await supabaseAdmin
            .from("reminders")
            .update({ is_completed: true })
            .eq("id", reminder.id);
        }

        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send reminder ${reminder.id}:`, emailError);
      }
    }

    return NextResponse.json({
      success: true,
      processed: dueReminders?.length || 0,
      sent: sentCount,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
