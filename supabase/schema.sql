-- ===========================================
-- Research Connect - Supabase Database Schema
-- ===========================================
-- Run this in your Supabase SQL Editor to set up the database
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUM TYPES
-- ===========================================

CREATE TYPE user_role AS ENUM ('student', 'researcher', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'interviewing', 'accepted', 'declined');
CREATE TYPE listing_status AS ENUM ('active', 'paused', 'closed', 'pending_review');
CREATE TYPE commitment_type AS ENUM ('summer', 'school_year', 'project', 'semester', 'ongoing');
CREATE TYPE location_type AS ENUM ('virtual', 'hybrid', 'in_person');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE research_category AS ENUM ('cs_ai', 'biology', 'chemistry', 'physics', 'environmental', 'social_sciences');

-- ===========================================
-- USERS TABLE (extends Supabase auth.users)
-- ===========================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- STUDENT PROFILES
-- ===========================================

CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  high_school TEXT,
  graduation_year INTEGER,
  phone TEXT,
  location TEXT,
  bio TEXT,
  why_research TEXT,
  resume_url TEXT,
  skills TEXT[] DEFAULT '{}',
  research_interests research_category[] DEFAULT '{}',
  profile_completion INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- RESEARCHER PROFILES
-- ===========================================

CREATE TABLE public.researcher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  lab_name TEXT NOT NULL,
  affiliation TEXT,
  lead_researcher TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  research_areas research_category[] DEFAULT '{}',
  location TEXT,
  profile_image_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- RESEARCH LISTINGS (Job Posts)
-- ===========================================

CREATE TABLE public.research_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  researcher_id UUID NOT NULL REFERENCES public.researcher_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  required_skills TEXT[] DEFAULT '{}',
  category research_category NOT NULL,
  commitment commitment_type NOT NULL,
  location location_type NOT NULL,
  weekly_hours TEXT,
  research_area TEXT,
  status listing_status NOT NULL DEFAULT 'active',
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ===========================================
-- APPLICATIONS
-- ===========================================

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.research_listings(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  cover_message TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id),

  -- Prevent duplicate applications
  UNIQUE(student_id, listing_id)
);

-- ===========================================
-- SAVED LISTINGS (Bookmarks)
-- ===========================================

CREATE TABLE public.saved_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.research_listings(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(student_id, listing_id)
);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'success', 'warning', 'application_update'
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT, -- Optional link to relevant page
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- RESOURCES
-- ===========================================

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- FAQS
-- ===========================================

CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX idx_researcher_profiles_user_id ON public.researcher_profiles(user_id);
CREATE INDEX idx_researcher_profiles_verification ON public.researcher_profiles(verification_status);
CREATE INDEX idx_research_listings_researcher ON public.research_listings(researcher_id);
CREATE INDEX idx_research_listings_status ON public.research_listings(status);
CREATE INDEX idx_research_listings_category ON public.research_listings(category);
CREATE INDEX idx_research_listings_posted ON public.research_listings(posted_at DESC);
CREATE INDEX idx_applications_student ON public.applications(student_id);
CREATE INDEX idx_applications_listing ON public.applications(listing_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_saved_listings_student ON public.saved_listings(student_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE read = FALSE;

-- ===========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_researcher_profiles_updated_at
  BEFORE UPDATE ON public.researcher_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_listings_updated_at
  BEFORE UPDATE ON public.research_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.researcher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- ---- USERS ----
-- Everyone can read basic user info
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- Users can update their own record
CREATE POLICY "Users can update own record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ---- STUDENT PROFILES ----
-- Viewable by the student themselves, researchers, and admins
CREATE POLICY "Student profiles viewable by authenticated users" ON public.student_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Students can insert their own profile
CREATE POLICY "Students can insert own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Students can update their own profile
CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ---- RESEARCHER PROFILES ----
-- Verified profiles visible to everyone
CREATE POLICY "Verified researcher profiles are public" ON public.researcher_profiles
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = user_id);

-- Researchers can insert their own profile
CREATE POLICY "Researchers can insert own profile" ON public.researcher_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Researchers can update their own profile
CREATE POLICY "Researchers can update own profile" ON public.researcher_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- ---- RESEARCH LISTINGS ----
-- Active listings visible to everyone
CREATE POLICY "Active listings are public" ON public.research_listings
  FOR SELECT USING (status = 'active' OR
    researcher_id IN (SELECT id FROM public.researcher_profiles WHERE user_id = auth.uid()));

-- Researchers can insert listings
CREATE POLICY "Researchers can create listings" ON public.research_listings
  FOR INSERT WITH CHECK (
    researcher_id IN (SELECT id FROM public.researcher_profiles WHERE user_id = auth.uid())
  );

-- Researchers can update their own listings
CREATE POLICY "Researchers can update own listings" ON public.research_listings
  FOR UPDATE USING (
    researcher_id IN (SELECT id FROM public.researcher_profiles WHERE user_id = auth.uid())
  );

-- ---- APPLICATIONS ----
-- Students see their own applications, researchers see applications to their listings
CREATE POLICY "Students see own applications" ON public.applications
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Researchers see applications to their listings" ON public.applications
  FOR SELECT USING (
    listing_id IN (
      SELECT rl.id FROM public.research_listings rl
      JOIN public.researcher_profiles rp ON rl.researcher_id = rp.id
      WHERE rp.user_id = auth.uid()
    )
  );

-- Students can create applications
CREATE POLICY "Students can apply" ON public.applications
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

-- Researchers can update application status
CREATE POLICY "Researchers can update application status" ON public.applications
  FOR UPDATE USING (
    listing_id IN (
      SELECT rl.id FROM public.research_listings rl
      JOIN public.researcher_profiles rp ON rl.researcher_id = rp.id
      WHERE rp.user_id = auth.uid()
    )
  );

-- ---- SAVED LISTINGS ----
CREATE POLICY "Students manage own saved listings" ON public.saved_listings
  FOR ALL USING (
    student_id IN (SELECT id FROM public.student_profiles WHERE user_id = auth.uid())
  );

-- ---- NOTIFICATIONS ----
CREATE POLICY "Users see own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ---- RESOURCES & FAQS ----
-- Public read access
CREATE POLICY "Resources are public" ON public.resources
  FOR SELECT USING (published = true);

CREATE POLICY "FAQs are public" ON public.faqs
  FOR SELECT USING (published = true);

-- ===========================================
-- ADMIN POLICIES
-- These require a helper function to check admin role
-- ===========================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can do everything
CREATE POLICY "Admins have full access to users" ON public.users
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to student_profiles" ON public.student_profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to researcher_profiles" ON public.researcher_profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to research_listings" ON public.research_listings
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to applications" ON public.applications
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to resources" ON public.resources
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to faqs" ON public.faqs
  FOR ALL USING (is_admin());

CREATE POLICY "Admins have full access to notifications" ON public.notifications
  FOR ALL USING (is_admin());

-- ===========================================
-- STORAGE BUCKETS
-- ===========================================

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Storage policies for resumes
CREATE POLICY "Students can upload own resume" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can read resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND auth.role() = 'authenticated'
  );

-- Storage policies for profile images
CREATE POLICY "Users can upload own profile image" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Profile images are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user record on auth sign up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to calculate student profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion INTEGER := 0;
  profile RECORD;
BEGIN
  SELECT * INTO profile FROM public.student_profiles WHERE id = profile_id;

  IF profile.high_school IS NOT NULL AND profile.high_school != '' THEN completion := completion + 10; END IF;
  IF profile.graduation_year IS NOT NULL THEN completion := completion + 10; END IF;
  IF profile.phone IS NOT NULL AND profile.phone != '' THEN completion := completion + 5; END IF;
  IF profile.location IS NOT NULL AND profile.location != '' THEN completion := completion + 10; END IF;
  IF profile.bio IS NOT NULL AND profile.bio != '' THEN completion := completion + 15; END IF;
  IF profile.why_research IS NOT NULL AND profile.why_research != '' THEN completion := completion + 15; END IF;
  IF profile.resume_url IS NOT NULL AND profile.resume_url != '' THEN completion := completion + 15; END IF;
  IF array_length(profile.skills, 1) > 0 THEN completion := completion + 10; END IF;
  IF array_length(profile.research_interests, 1) > 0 THEN completion := completion + 10; END IF;

  RETURN completion;
END;
$$ LANGUAGE plpgsql;

-- Function to send notification on application status change
CREATE OR REPLACE FUNCTION notify_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
  student_user_id UUID;
  listing_title TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get student's user_id
    SELECT sp.user_id INTO student_user_id
    FROM public.student_profiles sp
    WHERE sp.id = NEW.student_id;

    -- Get listing title
    SELECT rl.title INTO listing_title
    FROM public.research_listings rl
    WHERE rl.id = NEW.listing_id;

    -- Create notification
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      student_user_id,
      'Application Update',
      'Your application for "' || listing_title || '" has been updated to: ' || NEW.status::TEXT,
      'application_update',
      '/dashboard/student'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_application_status_change
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW EXECUTE FUNCTION notify_application_status_change();
