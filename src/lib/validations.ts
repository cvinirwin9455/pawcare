import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.enum(["dog", "cat", "bird", "fish", "reptile", "small_mammal", "other"]),
  breed: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  weight: z.number().positive().optional(),
  weight_unit: z.enum(["lbs", "kg"]).default("lbs"),
  microchip_id: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
});

export const appointmentSchema = z.object({
  pet_id: z.string().uuid("Please select a pet"),
  vet_id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  appointment_type: z.enum(["checkup", "vaccination", "surgery", "dental", "grooming", "emergency", "other"]),
  starts_at: z.string().min(1, "Start date/time is required"),
  ends_at: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const medicationSchema = z.object({
  pet_id: z.string().uuid("Please select a pet"),
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().optional(),
  frequency: z.string().min(1, "Frequency is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  prescribed_by: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const reminderSchema = z.object({
  pet_id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  reminder_type: z.enum(["medication", "appointment", "feeding", "grooming", "exercise", "custom"]),
  frequency: z.enum(["once", "daily", "weekly", "monthly", "yearly"]).default("once"),
  remind_at: z.string().min(1, "Reminder date/time is required"),
  is_recurring: z.boolean().default(false),
});

export const veterinarianSchema = z.object({
  name: z.string().min(1, "Vet name is required"),
  clinic_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PetInput = z.infer<typeof petSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MedicationInput = z.infer<typeof medicationSchema>;
export type ReminderInput = z.infer<typeof reminderSchema>;
export type VeterinarianInput = z.infer<typeof veterinarianSchema>;
