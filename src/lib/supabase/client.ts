import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  if (!url || !key) {
    console.error("Missing Supabase env vars:", { url: !!url, key: !!key });
  }
  
  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}
