export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          timezone: string;
          reminder_email: string | null;
          google_calendar_token: Json | null;
          subscription_tier: "free" | "pro" | "premium";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          reminder_email?: string | null;
          google_calendar_token?: Json | null;
          subscription_tier?: "free" | "pro" | "premium";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          reminder_email?: string | null;
          google_calendar_token?: Json | null;
          subscription_tier?: "free" | "pro" | "premium";
          updated_at?: string;
        };
      };
      pets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          species: "dog" | "cat" | "bird" | "rabbit" | "reptile" | "other";
          breed: string | null;
          date_of_birth: string | null;
          weight: number | null;
          weight_unit: "kg" | "lbs";
          conditions: string[];
          notes: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          species: "dog" | "cat" | "bird" | "rabbit" | "reptile" | "other";
          breed?: string | null;
          date_of_birth?: string | null;
          weight?: number | null;
          weight_unit?: "kg" | "lbs";
          conditions?: string[];
          notes?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          species?: "dog" | "cat" | "bird" | "rabbit" | "reptile" | "other";
          breed?: string | null;
          date_of_birth?: string | null;
          weight?: number | null;
          weight_unit?: "kg" | "lbs";
          conditions?: string[];
          notes?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      medications: {
        Row: {
          id: string;
          pet_id: string;
          user_id: string;
          name: string;
          dosage: string;
          dosage_unit: string;
          frequency: "once_daily" | "twice_daily" | "three_times_daily" | "every_other_day" | "weekly" | "as_needed" | "custom";
          custom_frequency: string | null;
          times_of_day: string[];
          purpose: string | null;
          side_effects: string | null;
          instructions: string | null;
          prescribing_vet: string | null;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          refill_reminder_days: number | null;
          quantity_remaining: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          user_id: string;
          name: string;
          dosage: string;
          dosage_unit: string;
          frequency: "once_daily" | "twice_daily" | "three_times_daily" | "every_other_day" | "weekly" | "as_needed" | "custom";
          custom_frequency?: string | null;
          times_of_day?: string[];
          purpose?: string | null;
          side_effects?: string | null;
          instructions?: string | null;
          prescribing_vet?: string | null;
          start_date: string;
          end_date?: string | null;
          is_active?: boolean;
          refill_reminder_days?: number | null;
          quantity_remaining?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          dosage?: string;
          dosage_unit?: string;
          frequency?: "once_daily" | "twice_daily" | "three_times_daily" | "every_other_day" | "weekly" | "as_needed" | "custom";
          custom_frequency?: string | null;
          times_of_day?: string[];
          purpose?: string | null;
          side_effects?: string | null;
          instructions?: string | null;
          prescribing_vet?: string | null;
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          refill_reminder_days?: number | null;
          quantity_remaining?: number | null;
          updated_at?: string;
        };
      };
      drug_interactions: {
        Row: {
          id: string;
          user_id: string;
          medication_a_id: string;
          medication_b_id: string;
          severity: "mild" | "moderate" | "severe";
          description: string;
          recommendation: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          medication_a_id: string;
          medication_b_id: string;
          severity: "mild" | "moderate" | "severe";
          description: string;
          recommendation?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          severity?: "mild" | "moderate" | "severe";
          description?: string;
          recommendation?: string | null;
          source?: string | null;
        };
      };
      appointments: {
        Row: {
          id: string;
          pet_id: string;
          user_id: string;
          title: string;
          type: "vet" | "physio" | "grooming" | "specialist" | "dental" | "vaccination" | "other";
          provider_name: string | null;
          provider_address: string | null;
          provider_phone: string | null;
          date_time: string;
          duration_minutes: number;
          notes: string | null;
          status: "scheduled" | "completed" | "cancelled" | "rescheduled";
          google_event_id: string | null;
          reminder_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          user_id: string;
          title: string;
          type: "vet" | "physio" | "grooming" | "specialist" | "dental" | "vaccination" | "other";
          provider_name?: string | null;
          provider_address?: string | null;
          provider_phone?: string | null;
          date_time: string;
          duration_minutes?: number;
          notes?: string | null;
          status?: "scheduled" | "completed" | "cancelled" | "rescheduled";
          google_event_id?: string | null;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          type?: "vet" | "physio" | "grooming" | "specialist" | "dental" | "vaccination" | "other";
          provider_name?: string | null;
          provider_address?: string | null;
          provider_phone?: string | null;
          date_time?: string;
          duration_minutes?: number;
          notes?: string | null;
          status?: "scheduled" | "completed" | "cancelled" | "rescheduled";
          google_event_id?: string | null;
          reminder_sent?: boolean;
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          pet_id: string;
          type: "medication" | "appointment" | "refill";
          reference_id: string;
          scheduled_at: string;
          sent_at: string | null;
          status: "pending" | "sent" | "failed" | "cancelled";
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pet_id: string;
          type: "medication" | "appointment" | "refill";
          reference_id: string;
          scheduled_at: string;
          sent_at?: string | null;
          status?: "pending" | "sent" | "failed" | "cancelled";
          message: string;
          created_at?: string;
        };
        Update: {
          scheduled_at?: string;
          sent_at?: string | null;
          status?: "pending" | "sent" | "failed" | "cancelled";
          message?: string;
        };
      };
    };
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pet = Database["public"]["Tables"]["pets"]["Row"];
export type Medication = Database["public"]["Tables"]["medications"]["Row"];
export type DrugInteraction = Database["public"]["Tables"]["drug_interactions"]["Row"];
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
