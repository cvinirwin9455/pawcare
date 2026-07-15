-- ============================================
-- CARE TASKS TABLE
-- User-created recurring tasks for their pets
-- ============================================
CREATE TABLE public.care_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'custom' CHECK (category IN ('feeding', 'walking', 'medication', 'grooming', 'training', 'playtime', 'cleaning', 'custom')),
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'twice_daily', 'three_times_daily', 'every_other_day', 'weekly', 'custom')),
  times_of_day TEXT[] DEFAULT '{}',
  days_of_week INTEGER[] DEFAULT '{}', -- 0=Sunday, 1=Monday, ..., 6=Saturday
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TASK COMPLETIONS TABLE
-- Tracks when tasks are completed (persisted history)
-- ============================================
CREATE TABLE public.task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  care_task_id UUID REFERENCES public.care_tasks(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  -- For medication/appointment-derived tasks, reference the source
  source_type TEXT NOT NULL CHECK (source_type IN ('care_task', 'medication', 'appointment')),
  source_id UUID NOT NULL, -- References care_task_id, medication_id, or appointment_id
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scheduled_time TEXT, -- e.g., "8:00 AM", "morning"
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_care_tasks_user_id ON public.care_tasks(user_id);
CREATE INDEX idx_care_tasks_pet_id ON public.care_tasks(pet_id);
CREATE INDEX idx_care_tasks_active ON public.care_tasks(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_task_completions_user_id ON public.task_completions(user_id);
CREATE INDEX idx_task_completions_date ON public.task_completions(scheduled_date);
CREATE INDEX idx_task_completions_source ON public.task_completions(source_type, source_id);
CREATE INDEX idx_task_completions_pet_date ON public.task_completions(pet_id, scheduled_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.care_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;

-- Care tasks: users can only manage their own
CREATE POLICY "Users can view own care tasks" ON public.care_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own care tasks" ON public.care_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own care tasks" ON public.care_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own care tasks" ON public.care_tasks FOR DELETE USING (auth.uid() = user_id);

-- Task completions: users can only manage their own
CREATE POLICY "Users can view own completions" ON public.task_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON public.task_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completions" ON public.task_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own completions" ON public.task_completions FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER set_care_tasks_updated_at BEFORE UPDATE ON public.care_tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
