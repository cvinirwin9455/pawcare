import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    ...options,
  }).format(new Date(date));
}

export function formatTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    once_daily: "Once daily",
    twice_daily: "Twice daily",
    three_times_daily: "Three times daily",
    every_other_day: "Every other day",
    weekly: "Weekly",
    as_needed: "As needed",
    custom: "Custom",
  };
  return labels[frequency] || frequency;
}

export function getAppointmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    vet: "Veterinarian",
    physio: "Physiotherapy",
    grooming: "Grooming",
    specialist: "Specialist",
    dental: "Dental",
    vaccination: "Vaccination",
    other: "Other",
  };
  return labels[type] || type;
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "mild":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "moderate":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "severe":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "scheduled":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "completed":
      return "text-green-600 bg-green-50 border-green-200";
    case "cancelled":
      return "text-red-600 bg-red-50 border-red-200";
    case "rescheduled":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function calculateAge(dateOfBirth: string): string {
  const birth = new Date(dateOfBirth);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  if (years === 0) {
    return `${months + (months < 0 ? 12 : 0)} months`;
  }
  if (months < 0) {
    return `${years - 1} years, ${months + 12} months`;
  }
  return `${years} years, ${months} months`;
}
