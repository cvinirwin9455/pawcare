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
          phone: string | null;
          timezone: string;
          notification_preferences: Json;
          google_calendar_connected: boolean;
          google_refresh_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          timezone?: string;
          notification_preferences?: Json;
          google_calendar_connected?: boolean;
          google_refresh_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          timezone?: string;
          notification_preferences?: Json;
          google_calendar_connected?: boolean;
          google_refresh_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: string;
          breed: string | null;
          date_of_birth: string | null;
          gender: string | null;
          weight: number | null;
          weight_unit: string;
          microchip_id: string | null;
          color: string | null;
          avatar_url: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: string;
          breed?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          weight?: number | null;
          weight_unit?: string;
          microchip_id?: string | null;
          color?: string | null;
          avatar_url?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          species?: string;
          breed?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          weight?: number | null;
          weight_unit?: string;
          microchip_id?: string | null;
          color?: string | null;
          avatar_url?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      veterinarians: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          clinic_name: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          clinic_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          clinic_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          vet_id: string | null;
          title: string;
          description: string | null;
          appointment_type: string;
          status: string;
          starts_at: string;
          ends_at: string | null;
          location: string | null;
          google_event_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          vet_id?: string | null;
          title: string;
          description?: string | null;
          appointment_type: string;
          status?: string;
          starts_at: string;
          ends_at?: string | null;
          location?: string | null;
          google_event_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          pet_id?: string;
          vet_id?: string | null;
          title?: string;
          description?: string | null;
          appointment_type?: string;
          status?: string;
          starts_at?: string;
          ends_at?: string | null;
          location?: string | null;
          google_event_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      medications: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          name: string;
          dosage: string | null;
          frequency: string;
          start_date: string;
          end_date: string | null;
          prescribed_by: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          name: string;
          dosage?: string | null;
          frequency: string;
          start_date: string;
          end_date?: string | null;
          prescribed_by?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          pet_id?: string;
          name?: string;
          dosage?: string | null;
          frequency?: string;
          start_date?: string;
          end_date?: string | null;
          prescribed_by?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      health_records: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          record_type: string;
          title: string;
          description: string | null;
          record_date: string;
          vet_id: string | null;
          attachments: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          record_type: string;
          title: string;
          description?: string | null;
          record_date: string;
          vet_id?: string | null;
          attachments?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          pet_id?: string;
          record_type?: string;
          title?: string;
          description?: string | null;
          record_date?: string;
          vet_id?: string | null;
          attachments?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string | null;
          title: string;
          description: string | null;
          reminder_type: string;
          frequency: string;
          remind_at: string;
          is_recurring: boolean;
          is_completed: boolean;
          last_sent_at: string | null;
          notification_channels: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id?: string | null;
          title: string;
          description?: string | null;
          reminder_type: string;
          frequency?: string;
          remind_at: string;
          is_recurring?: boolean;
          is_completed?: boolean;
          last_sent_at?: string | null;
          notification_channels?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          pet_id?: string | null;
          title?: string;
          description?: string | null;
          reminder_type?: string;
          frequency?: string;
          remind_at?: string;
          is_recurring?: boolean;
          is_completed?: boolean;
          last_sent_at?: string | null;
          notification_channels?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      feeding_schedules: {
        Row: {
          id: string;
          owner_id: string;
          pet_id: string;
          food_name: string;
          portion_size: string | null;
          feeding_time: string;
          days_of_week: number[];
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          pet_id: string;
          food_name: string;
          portion_size?: string | null;
          feeding_time: string;
          days_of_week?: number[];
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          pet_id?: string;
          food_name?: string;
          portion_size?: string | null;
          feeding_time?: string;
          days_of_week?: number[];
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pet = Database["public"]["Tables"]["pets"]["Row"];
export type Veterinarian = Database["public"]["Tables"]["veterinarians"]["Row"];
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Medication = Database["public"]["Tables"]["medications"]["Row"];
export type HealthRecord = Database["public"]["Tables"]["health_records"]["Row"];
export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
export type FeedingSchedule = Database["public"]["Tables"]["feeding_schedules"]["Row"];
