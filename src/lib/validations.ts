import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required").max(100),
  species: z.enum(["dog", "cat", "bird", "rabbit", "reptile", "other"]),
  breed: z.string().max(100).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  weight: z.number().positive().optional().nullable(),
  weight_unit: z.enum(["kg", "lbs"]).default("kg"),
  conditions: z.array(z.string()).default([]),
  notes: z.string().max(2000).optional().nullable(),
});

export const medicationSchema = z.object({
  pet_id: z.string().uuid("Please select a pet"),
  name: z.string().min(1, "Medication name is required").max(200),
  dosage: z.string().min(1, "Dosage is required"),
  dosage_unit: z.string().min(1, "Dosage unit is required"),
  frequency: z.enum([
    "once_daily",
    "twice_daily",
    "three_times_daily",
    "every_other_day",
    "weekly",
    "as_needed",
    "custom",
  ]),
  custom_frequency: z.string().optional().nullable(),
  times_of_day: z.array(z.string()).default([]),
  purpose: z.string().max(500).optional().nullable(),
  side_effects: z.string().max(1000).optional().nullable(),
  instructions: z.string().max(2000).optional().nullable(),
  prescribing_vet: z.string().max(200).optional().nullable(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().nullable(),
  refill_reminder_days: z.number().int().positive().optional().nullable(),
  quantity_remaining: z.number().int().nonnegative().optional().nullable(),
});

export const drugInteractionSchema = z.object({
  medication_a_id: z.string().uuid("Please select the first medication"),
  medication_b_id: z.string().uuid("Please select the second medication"),
  severity: z.enum(["mild", "moderate", "severe"]),
  description: z.string().min(1, "Description is required").max(2000),
  recommendation: z.string().max(2000).optional().nullable(),
  source: z.string().max(500).optional().nullable(),
});

export const appointmentSchema = z.object({
  pet_id: z.string().uuid("Please select a pet"),
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["vet", "physio", "grooming", "specialist", "dental", "vaccination", "other"]),
  provider_name: z.string().max(200).optional().nullable(),
  provider_address: z.string().max(500).optional().nullable(),
  provider_phone: z.string().max(50).optional().nullable(),
  date_time: z.string().min(1, "Date and time are required"),
  duration_minutes: z.number().int().positive().default(30),
  notes: z.string().max(2000).optional().nullable(),
  add_to_calendar: z.boolean().default(false),
});

export type PetFormData = z.infer<typeof petSchema>;
export type MedicationFormData = z.infer<typeof medicationSchema>;
export type DrugInteractionFormData = z.infer<typeof drugInteractionSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
