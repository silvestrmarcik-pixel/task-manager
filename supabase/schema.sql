-- ============================================================
-- Task Manager – Supabase SQL Schema
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- ─── 1. PROFILES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email     text
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all profiles (needed for assignee dropdown)
CREATE POLICY "Authenticated users can read profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- ─── 2. TASKS ───────────────────────────────────────────────
CREATE TYPE public.task_status AS ENUM ('todo', 'in-progress', 'done');

CREATE TABLE IF NOT EXISTS public.tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description text,
  status      public.task_status NOT NULL DEFAULT 'todo',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  due_date    date
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read all tasks
CREATE POLICY "Authenticated users can read tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can create tasks
CREATE POLICY "Authenticated users can create tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Only creator or assignee can update a task
CREATE POLICY "Creator or assignee can update tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Only creator or assignee can delete a task
CREATE POLICY "Creator or assignee can delete tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- ─── 3. AUTO-CREATE PROFILE ON SIGN-UP ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        email     = EXCLUDED.email;
  RETURN NEW;
END;
$$;

-- Drop trigger if it already exists, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 4. INDEXES ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS tasks_created_by_idx   ON public.tasks (created_by);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx  ON public.tasks (assigned_to);
CREATE INDEX IF NOT EXISTS tasks_status_idx       ON public.tasks (status);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx   ON public.tasks (created_at DESC);
