-- Migration: Add messages table for post-approval chat between students and researchers
-- Created: 2025-06-27

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_application ON public.messages(application_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(application_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is a participant of an accepted application
-- SECURITY DEFINER so it can read applications/listings without RLS blocking nested joins.
CREATE OR REPLACE FUNCTION is_application_participant(app_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.research_listings rl ON a.listing_id = rl.id
    WHERE a.id = app_id
      AND a.status = 'accepted'
      AND (
        a.student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
        OR rl.researcher_id IN (SELECT id FROM public.researcher_profiles WHERE user_id = auth.uid())
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Participants can read messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;

-- Participants (student + researcher) can read messages for accepted applications
CREATE POLICY "Participants can read messages" ON public.messages
  FOR SELECT USING (is_application_participant(application_id));

-- Participants can send messages for accepted applications they belong to
CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND is_application_participant(application_id)
  );
