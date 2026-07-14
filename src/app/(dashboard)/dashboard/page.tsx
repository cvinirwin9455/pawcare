"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [stats, setStats] = useState({ pets: 0, medications: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [petsRes, medsRes, aptsRes] = await Promise.all([
        supabase.from("pets").select("id").eq("user_id", user.id).eq("is_active", true),
        supabase.from("medications").select("id").eq("user_id", user.id).eq("is_active", true),
        supabase.from("appointments").select("id").eq("user_id", user.id).eq("status", "scheduled"),
      ]);

      setStats({
        pets: petsRes.data?.length || 0,
        medications: medsRes.data?.length || 0,
        appointments: aptsRes.data?.length || 0,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your pets' health and upcoming tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">🐾</div>
          <p className="text-2xl font-bold text-gray-900">{stats.pets}</p>
          <p className="text-sm text-gray-500">Active Pets</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">💊</div>
          <p className="text-2xl font-bold text-gray-900">{stats.medications}</p>
          <p className="text-sm text-gray-500">Active Medications</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-2xl font-bold text-gray-900">{stats.appointments}</p>
          <p className="text-sm text-gray-500">Upcoming Appointments</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="text-3xl mb-2">⚠️</div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500">Interaction Warnings</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/pets/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">🐾</span>
            <p className="text-sm font-medium text-gray-900 mt-2">Add Pet</p>
          </Link>
          <Link
            href="/medications/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">💊</span>
            <p className="text-sm font-medium text-gray-900 mt-2">Add Medication</p>
          </Link>
          <Link
            href="/appointments/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">📅</span>
            <p className="text-sm font-medium text-gray-900 mt-2">Schedule Appointment</p>
          </Link>
          <Link
            href="/medications/interactions/new"
            className="rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-medium text-gray-900 mt-2">Log Interaction</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
