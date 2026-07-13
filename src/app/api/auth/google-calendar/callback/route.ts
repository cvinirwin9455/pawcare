import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getTokensFromCode } from "@/lib/google-calendar";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=no_code", request.url)
    );
  }

  try {
    const tokens = await getTokensFromCode(code);

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user } } = await supabase.auth.getUser();

    if (user && tokens.refresh_token) {
      await supabase
        .from("profiles")
        .update({
          google_calendar_connected: true,
          google_refresh_token: tokens.refresh_token,
        })
        .eq("id", user.id);
    }

    return NextResponse.redirect(
      new URL("/dashboard/settings?success=calendar_connected", request.url)
    );
  } catch (error) {
    console.error("Google Calendar OAuth error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=oauth_failed", request.url)
    );
  }
}
