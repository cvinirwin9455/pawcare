import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // For now, skip auth checks during middleware since we're not using SSR cookies
  // Auth will be handled client-side
  return response;
}
