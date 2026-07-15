"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PetSidebar } from "@/components/dashboard/PetSidebar";
import { AddTaskModal } from "@/components/dashboard/AddTaskModal";
import { cn, formatTime } from "@/lib/utils";
import type { Pet, Medication, Appointment, CareTask, TaskCompletion } from "@/types/database";

// A unified task item for the checklist
interface DashboardTask {
  id: string; // unique key for rendering
  sourceType: "care_task" | "medication" | "appointment";
  sourceId: string;
  petId: string;
  petName: string;
  petSpecies: string;
  title: string;
  subtitle?: string;
  scheduledTime?: string;
  category: string;
  isCompleted: boolean;
  completionId?: string;
}

const speciesEmoji: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  rabbit: "🐰",
  reptile: "🦎",
  other: "🐾",
};

const categoryEmoji: Record<string, string> = {
  feeding: "🍖",
  walking: "🚶",
  medication: "💊",
  grooming: "✂️",
  training: "🎯",
  playtime: "🎾",
  cleaning: "🧹",
  custom: "📝",
  appointment: "📅",
};

export default function DashboardPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [todayStr] = useState(() => new Date().toISOString().split("T")[0]);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch all data in parallel - care_tasks and task_completions may not exist yet
    const [petsRes, medsRes, aptsRes] = await Promise.all([
      supabase.from("pets").select("*").eq("user_id", user.id).eq("is_active", true).order("name"),
      supabase.from("medications").select("*, pets(name, species)").eq("user_id", user.id).eq("is_active", true),
      supabase
        .from("appointments")
        .select("*, pets(name, species)")
        .eq("user_id", user.id)
        .eq("status", "scheduled")
        .gte("date_time", `${todayStr}T00:00:00`)
        .lte("date_time", `${todayStr}T23:59:59`),
    ]);

    // These tables may not exist yet if migration hasn't been run
    let careTasksData: any[] = [];
    let completionsData: TaskCompletion[] = [];

    try {
      const [careTasksRes, completionsRes] = await Promise.all([
        supabase.from("care_tasks").select("*, pets(name, species)").eq("user_id", user.id).eq("is_active", true),
        supabase.from("task_completions").select("*").eq("user_id", user.id).eq("scheduled_date", todayStr),
      ]);
      careTasksData = careTasksRes.data || [];
      completionsData = (completionsRes.data || []) as TaskCompletion[];
    } catch (err) {
      // Tables don't exist yet - that's okay, just use empty arrays
      console.warn("care_tasks/task_completions tables not available:", err);
    }

    const petsData = (petsRes.data || []) as Pet[];
    const medsData = (medsRes.data || []) as any[];
    const aptsData = (aptsRes.data || []) as any[];

    setPets(petsData);
    setCompletions(completionsData);

    // Build unified task list
    const allTasks: DashboardTask[] = [];

    // 1. Generate tasks from medications
    for (const med of medsData) {
      const timesOfDay = med.times_of_day && med.times_of_day.length > 0
        ? med.times_of_day
        : ["daily"];

      for (const time of timesOfDay) {
        const taskId = `med-${med.id}-${time}`;
        const isCompleted = completionsData.some(
          (c) => c.source_type === "medication" && c.source_id === med.id && c.scheduled_time === time
        );
        const completionRecord = completionsData.find(
          (c) => c.source_type === "medication" && c.source_id === med.id && c.scheduled_time === time
        );

        allTasks.push({
          id: taskId,
          sourceType: "medication",
          sourceId: med.id,
          petId: med.pet_id,
          petName: med.pets?.name || "Unknown",
          petSpecies: med.pets?.species || "other",
          title: `Give ${med.name}`,
          subtitle: `${med.dosage} ${med.dosage_unit}`,
          scheduledTime: time !== "daily" ? time : undefined,
          category: "medication",
          isCompleted,
          completionId: completionRecord?.id,
        });
      }
    }

    // 2. Generate tasks from today's appointments
    for (const apt of aptsData) {
      const taskId = `apt-${apt.id}`;
      const isCompleted = completionsData.some(
        (c) => c.source_type === "appointment" && c.source_id === apt.id
      );
      const completionRecord = completionsData.find(
        (c) => c.source_type === "appointment" && c.source_id === apt.id
      );

      allTasks.push({
        id: taskId,
        sourceType: "appointment",
        sourceId: apt.id,
        petId: apt.pet_id,
        petName: apt.pets?.name || "Unknown",
        petSpecies: apt.pets?.species || "other",
        title: apt.title,
        subtitle: apt.provider_name || undefined,
        scheduledTime: formatTime(apt.date_time),
        category: "appointment",
        isCompleted,
        completionId: completionRecord?.id,
      });
    }

    // 3. Generate tasks from care_tasks (check if they should show today)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sunday

    for (const task of careTasksData) {
      // Check if task is applicable today based on frequency
      const shouldShowToday = isTaskScheduledToday(task, dayOfWeek);
      if (!shouldShowToday) continue;

      const timesOfDay = task.times_of_day && task.times_of_day.length > 0
        ? task.times_of_day
        : ["anytime"];

      for (const time of timesOfDay) {
        const taskId = `task-${task.id}-${time}`;
        const isCompleted = completionsData.some(
          (c) => c.source_type === "care_task" && c.source_id === task.id && c.scheduled_time === time
        );
        const completionRecord = completionsData.find(
          (c) => c.source_type === "care_task" && c.source_id === task.id && c.scheduled_time === time
        );

        allTasks.push({
          id: taskId,
          sourceType: "care_task",
          sourceId: task.id,
          petId: task.pet_id,
          petName: task.pets?.name || "Unknown",
          petSpecies: task.pets?.species || "other",
          title: task.title,
          subtitle: task.notes || undefined,
          scheduledTime: time !== "anytime" ? time : undefined,
          category: task.category,
          isCompleted,
          completionId: completionRecord?.id,
        });
      }
    }

    // Sort: incomplete first, then by time
    allTasks.sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      if (a.scheduledTime && b.scheduledTime) return a.scheduledTime.localeCompare(b.scheduledTime);
      if (a.scheduledTime) return -1;
      if (b.scheduledTime) return 1;
      return a.petName.localeCompare(b.petName);
    });

    setTasks(allTasks);
    setLoading(false);
  }, [todayStr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle task completion
  const toggleTask = async (task: DashboardTask) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (task.isCompleted && task.completionId) {
        // Un-complete: delete the completion record
        await supabase.from("task_completions").delete().eq("id", task.completionId);
      } else {
        // Complete: insert a completion record
        await supabase.from("task_completions").insert({
          user_id: user.id,
          care_task_id: task.sourceType === "care_task" ? task.sourceId : null,
          pet_id: task.petId,
          source_type: task.sourceType,
          source_id: task.sourceId,
          scheduled_date: todayStr,
          scheduled_time: task.scheduledTime || null,
        });
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  // Calculate task counts per pet for the sidebar
  const taskCounts: Record<string, { total: number; completed: number }> = {};
  for (const task of tasks) {
    if (!taskCounts[task.petId]) {
      taskCounts[task.petId] = { total: 0, completed: 0 };
    }
    taskCounts[task.petId].total++;
    if (task.isCompleted) taskCounts[task.petId].completed++;
  }

  // Filter tasks by selected pet
  const filteredTasks = selectedPetId
    ? tasks.filter((t) => t.petId === selectedPetId)
    : tasks;

  const incompleteTasks = filteredTasks.filter((t) => !t.isCompleted);
  const completedTasks = filteredTasks.filter((t) => t.isCompleted);

  // Get selected pet info
  const selectedPet = selectedPetId ? pets.find((p) => p.id === selectedPetId) : null;

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🐾</div>
            <p className="text-gray-400 text-sm">Loading your pet care dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full -m-4 md:-m-6">
      {/* Pet Sidebar */}
      <PetSidebar
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={setSelectedPetId}
        taskCounts={taskCounts}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedPet ? `${selectedPet.name}'s Care` : "Today's Care Tasks"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}
              {filteredTasks.length > 0 && (
                <span className="ml-2">
                  &middot; {incompleteTasks.length} remaining
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            + Add Task
          </button>
        </div>

        {/* Selected Pet Info Card */}
        {selectedPet && (
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{speciesEmoji[selectedPet.species] || "🐾"}</span>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedPet.name}</h2>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedPet.breed ? `${selectedPet.breed} ${selectedPet.species}` : selectedPet.species}
                </p>
              </div>
            </div>
            <Link
              href={`/pets/${selectedPet.id}`}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View Profile →
            </Link>
          </div>
        )}

        {/* Progress Bar */}
        {filteredTasks.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">
                Today's Progress
              </span>
              <span className="text-xs font-bold text-gray-700">
                {completedTasks.length}/{filteredTasks.length} done
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  completedTasks.length === filteredTasks.length
                    ? "bg-green-500"
                    : "bg-purple-500"
                )}
                style={{ width: `${(completedTasks.length / filteredTasks.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border">
            <div className="text-5xl mb-4">
              {selectedPet ? speciesEmoji[selectedPet.species] || "🐾" : "✨"}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {selectedPet
                ? `No tasks for ${selectedPet.name} today`
                : "No tasks scheduled for today"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {pets.length === 0
                ? "Add a pet to start tracking their care tasks."
                : "Add care tasks, medications, or appointments to see them here."}
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              {pets.length === 0 ? (
                <Link
                  href="/pets/new"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                >
                  Add Your First Pet
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                  >
                    Add Care Task
                  </button>
                  <Link
                    href="/medications/new"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Add Medication
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Task Checklist - Incomplete */}
        {incompleteTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              To Do
            </h2>
            <div className="space-y-2">
              {incompleteTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task)}
                  showPetName={!selectedPetId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Task Checklist - Completed */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Completed ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task)}
                  showPetName={!selectedPetId}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          pets={pets}
          selectedPetId={selectedPetId}
          onClose={() => setShowAddTask(false)}
          onTaskAdded={() => {
            setShowAddTask(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Individual task item component
function TaskItem({
  task,
  onToggle,
  showPetName,
}: {
  task: DashboardTask;
  onToggle: () => void | Promise<void>;
  showPetName: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-white rounded-xl border p-4 transition-all",
        task.isCompleted
          ? "opacity-60 border-gray-100"
          : "shadow-sm hover:shadow-md border-gray-200"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
          task.isCompleted
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
        )}
      >
        {task.isCompleted && (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Category Icon */}
      <span className="text-lg flex-shrink-0">
        {categoryEmoji[task.category] || "📝"}
      </span>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "font-medium text-sm truncate",
              task.isCompleted ? "line-through text-gray-400" : "text-gray-900"
            )}
          >
            {task.title}
          </p>
          {showPetName && (
            <span className="flex-shrink-0 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
              {speciesEmoji[task.petSpecies]} {task.petName}
            </span>
          )}
        </div>
        {task.subtitle && (
          <p className={cn("text-xs mt-0.5 truncate", task.isCompleted ? "text-gray-300" : "text-gray-500")}>
            {task.subtitle}
          </p>
        )}
      </div>

      {/* Time Badge */}
      {task.scheduledTime && (
        <span
          className={cn(
            "flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium",
            task.isCompleted
              ? "bg-gray-50 text-gray-400"
              : "bg-purple-50 text-purple-700"
          )}
        >
          {task.scheduledTime}
        </span>
      )}
    </div>
  );
}

// Helper: determine if a care task should show today
function isTaskScheduledToday(task: any, dayOfWeek: number): boolean {
  switch (task.frequency) {
    case "daily":
    case "twice_daily":
    case "three_times_daily":
      return true;

    case "every_other_day": {
      // Simple approach: show on even days since task creation
      const created = new Date(task.created_at);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff % 2 === 0;
    }

    case "weekly": {
      // Show on specified days, or if no days specified, show on the day it was created
      if (task.days_of_week && task.days_of_week.length > 0) {
        return task.days_of_week.includes(dayOfWeek);
      }
      const createdDay = new Date(task.created_at).getDay();
      return createdDay === dayOfWeek;
    }

    case "custom":
      // For custom, always show (user manages manually)
      return true;

    default:
      return true;
  }
}
