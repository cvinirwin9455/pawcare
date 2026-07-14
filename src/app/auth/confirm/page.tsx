"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const [status, setStatus] = useState("Confirming your account...");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      // The hash fragment contains the auth tokens from email confirmation
      const hashParams = new URLSearchParams(
        window.location.hash.substring(1)
      );
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setStatus("Error confirming account. Please try signing in.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus("Account confirmed! Redirecting...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        }
      } else {
        // Try code-based flow
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setStatus("Account confirmed! Redirecting...");
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1000);
            return;
          }
        }
        setStatus("Invalid confirmation link. Please try signing in.");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🐾</div>
        <p className="text-lg text-gray-700">{status}</p>
      </div>
    </div>
  );
}
