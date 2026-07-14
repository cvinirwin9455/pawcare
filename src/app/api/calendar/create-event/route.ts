import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createCalendarEvent } from "@/lib/google-calendar";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("google_calendar_token")
      .eq("id", user.id)
      .single();

    if (!profile?.google_calendar_token) {
      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { appointmentId, title, dateTime, durationMinutes, location, description } = body;

    const tokens = profile.google_calendar_token as {
      access_token: string;
      refresh_token: string;
      expiry_date?: number;
    };

    const event = await createCalendarEvent(tokens, {
      summary: `[Paw Tender Care] ${title}`,
      description,
      location,
      start: new Date(dateTime),
      durationMinutes: durationMinutes || 30,
      reminders: [{ minutes: 60 }, { minutes: 1440 }],
    });

    // Store the Google event ID
    if (appointmentId && event.id) {
      await supabase
        .from("appointments")
        .update({ google_event_id: event.id })
        .eq("id", appointmentId);
    }

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error("Create calendar event error:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
