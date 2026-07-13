"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [reminderEmail, setReminderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  const calendarSuccess = searchParams.get("success") === "calendar_connected";
  const calendarError = searchParams.get("error");

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setTimezone(data.timezone || "UTC");
        setReminderEmail(data.reminder_email || data.email);
        setCalendarConnected(!!data.google_calendar_token);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        timezone,
        reminder_email: reminderEmail,
      })
      .eq("id", user.id);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  const handleDisconnectCalendar = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({ google_calendar_token: null })
      .eq("id", user.id);

    setCalendarConnected(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and integrations
        </p>
      </div>

      {calendarSuccess && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          Google Calendar connected successfully!
        </div>
      )}

      {calendarError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
          Failed to connect Google Calendar. Please try again.
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email for Reminders
            </label>
            <input
              type="email"
              value={reminderEmail}
              onChange={(e) => setReminderEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              placeholder="Where to send medication/appointment reminders"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Central European</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {success && (
              <span className="text-sm text-green-600">Saved!</span>
            )}
          </div>
        </div>
      </div>

      {/* Google Calendar Integration */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Google Calendar
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Connect your Google Calendar to automatically add appointment events
          with reminders.
        </p>

        {calendarConnected ? (
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Google Calendar Connected
                </p>
                <p className="text-xs text-green-600">
                  Appointments can be synced to your calendar
                </p>
              </div>
            </div>
            <button
              onClick={handleDisconnectCalendar}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <a
            href="/api/calendar/authorize"
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Connect Google Calendar
          </a>
        )}
      </div>

      {/* Subscription Info */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subscription
        </h2>
        <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
          <div>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {profile?.subscription_tier || "free"} Plan
            </p>
            <p className="text-xs text-gray-500">
              {profile?.subscription_tier === "free"
                ? "Up to 2 pets, basic features"
                : "Unlimited pets, all features"}
            </p>
          </div>
          {profile?.subscription_tier === "free" && (
            <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
