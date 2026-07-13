import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr: string = "PPP") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatStr);
}

export function formatRelativeDate(date: string | Date) {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function getSpeciesEmoji(species: string): string {
  const emojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐈",
    bird: "🐦",
    fish: "🐟",
    reptile: "🦎",
    small_mammal: "🐹",
    other: "🐾",
  };
  return emojis[species] || "🐾";
}

export function getAppointmentTypeColor(type: string): string {
  const colors: Record<string, string> = {
    checkup: "bg-blue-100 text-blue-800",
    vaccination: "bg-green-100 text-green-800",
    surgery: "bg-red-100 text-red-800",
    dental: "bg-purple-100 text-purple-800",
    grooming: "bg-pink-100 text-pink-800",
    emergency: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800",
  };
  return colors[type] || colors.other;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    no_show: "bg-red-100 text-red-800",
  };
  return colors[status] || colors.scheduled;
}

export function calculateAge(dateOfBirth: string): string {
  const dob = parseISO(dateOfBirth);
  const now = new Date();
  const years = now.getFullYear() - dob.getFullYear();
  const months = now.getMonth() - dob.getMonth();

  if (years === 0) {
    return `${months + (months < 0 ? 12 : 0)} months`;
  }

  if (months < 0) {
    return `${years - 1} year${years - 1 !== 1 ? "s" : ""}`;
  }

  return `${years} year${years !== 1 ? "s" : ""}`;
}
