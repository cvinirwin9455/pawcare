import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getTokensFromCode } from "@/lib/google-calendar";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${origin}/settings?error=calendar_auth_denied`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/settings?error=calendar_no_code`
    );
  }

  try {
    const tokens = await getTokensFromCode(code);
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    // Store tokens in the user's profile
    await supabase
      .from("profiles")
      .update({
        google_calendar_token: tokens as any,
      })
      .eq("id", user.id);

    return NextResponse.redirect(
      `${origin}/settings?success=calendar_connected`
    );
  } catch (err) {
    console.error("Calendar OAuth error:", err);
    return NextResponse.redirect(
      `${origin}/settings?error=calendar_auth_failed`
    );
  }
}
