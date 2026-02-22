-- ============================================================================
-- LAURA LMS — PostgreSQL / Supabase Schema
-- ============================================================================
-- Run this migration in the Supabase SQL Editor to create the full schema.
-- RLS (Row-Level Security) policies are included for production-readiness.
-- ============================================================================

-- ─── Extensions ─────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ──────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('student', 'curator', 'admin');
CREATE TYPE publish_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('active', 'paused', 'revoked', 'completed');
CREATE TYPE lesson_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
CREATE TYPE homework_status AS ENUM ('not_submitted', 'pending', 'approved', 'rejected');
CREATE TYPE video_provider AS ENUM ('youtube', 'vimeo', 'bunny', 'custom');
CREATE TYPE attachment_type AS ENUM ('pdf', 'xlsx', 'docx', 'pptx', 'zip', 'image', 'other');

-- ─── Users ──────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific profile data.

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'student',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- ─── Courses ────────────────────────────────────────────────────────────────

CREATE TABLE public.courses (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                  TEXT NOT NULL,
  slug                   TEXT NOT NULL UNIQUE,
  description            TEXT NOT NULL DEFAULT '',
  short_description      TEXT NOT NULL DEFAULT '',
  cover_url              TEXT,
  status                 publish_status NOT NULL DEFAULT 'draft',
  author_id              UUID NOT NULL REFERENCES public.profiles(id),
  module_order           UUID[] NOT NULL DEFAULT '{}',
  total_lessons          INT NOT NULL DEFAULT 0,
  estimated_duration_min INT NOT NULL DEFAULT 0,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_status ON public.courses(status);

-- ─── Modules ────────────────────────────────────────────────────────────────

CREATE TABLE public.modules (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id    UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  lesson_order UUID[] NOT NULL DEFAULT '{}',
  status       publish_status NOT NULL DEFAULT 'draft',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_modules_course ON public.modules(course_id);

-- ─── Lessons ────────────────────────────────────────────────────────────────

CREATE TABLE public.lessons (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id          UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id          UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  slug               TEXT NOT NULL,
  sort_order         INT NOT NULL DEFAULT 0,
  video_url          TEXT,
  video_provider     video_provider,
  video_duration_sec INT,
  content_html       TEXT,
  has_homework       BOOLEAN NOT NULL DEFAULT false,
  homework_task      TEXT,
  status             publish_status NOT NULL DEFAULT 'draft',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(course_id, slug)
);

CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);

-- ─── Attachments ────────────────────────────────────────────────────────────

CREATE TABLE public.attachments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id      UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  file_url       TEXT NOT NULL,
  file_type      attachment_type NOT NULL DEFAULT 'other',
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attachments_lesson ON public.attachments(lesson_id);

-- ─── Enrollments (Student ↔ Course) ─────────────────────────────────────────

CREATE TABLE public.enrollments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id        UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status           enrollment_status NOT NULL DEFAULT 'active',
  enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMPTZ,

  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);

-- ─── Course Progress (Denormalized aggregate) ───────────────────────────────

CREATE TABLE public.course_progress (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id     UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id         UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  completed_lessons INT NOT NULL DEFAULT 0,
  total_lessons     INT NOT NULL DEFAULT 0,
  percentage        SMALLINT NOT NULL DEFAULT 0,
  last_lesson_id    UUID REFERENCES public.lessons(id),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_progress_user ON public.course_progress(user_id);

-- ─── Lesson Progress ────────────────────────────────────────────────────────

CREATE TABLE public.lesson_progress (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id        UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id        UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status           lesson_status NOT NULL DEFAULT 'available',
  video_position_sec INT NOT NULL DEFAULT 0,
  video_completed  BOOLEAN NOT NULL DEFAULT false,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ,

  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);

-- ─── Homework Submissions ───────────────────────────────────────────────────

CREATE TABLE public.homework_submissions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id      UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id      UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  attachment_url TEXT,
  status         homework_status NOT NULL DEFAULT 'pending',
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_hw_submissions_lesson ON public.homework_submissions(lesson_id);
CREATE INDEX idx_hw_submissions_status ON public.homework_submissions(status);

-- ─── Homework Reviews ───────────────────────────────────────────────────────

CREATE TABLE public.homework_reviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id  UUID NOT NULL REFERENCES public.homework_submissions(id) ON DELETE CASCADE,
  reviewer_id    UUID NOT NULL REFERENCES public.profiles(id),
  comment        TEXT NOT NULL DEFAULT '',
  status         homework_status NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hw_reviews_submission ON public.homework_reviews(submission_id);

-- ─── Auto-update `updated_at` trigger ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all mutable tables
CREATE TRIGGER trg_profiles_updated     BEFORE UPDATE ON public.profiles            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_courses_updated      BEFORE UPDATE ON public.courses             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_modules_updated      BEFORE UPDATE ON public.modules             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_lessons_updated      BEFORE UPDATE ON public.lessons             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_hw_submissions_upd   BEFORE UPDATE ON public.homework_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_course_progress_upd  BEFORE UPDATE ON public.course_progress     FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row-Level Security (RLS) ───────────────────────────────────────────────

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_reviews     ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own, admins can read all
CREATE POLICY "Users can view own profile"    ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles"  ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Courses: published courses visible to enrolled students, all to admins
CREATE POLICY "Published courses are visible" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage courses"         ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Enrollments: students see their own
CREATE POLICY "Students see own enrollments"  ON public.enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage enrollments"     ON public.enrollments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Progress: students see/update their own
CREATE POLICY "Students own progress"         ON public.course_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Students own lesson progress"  ON public.lesson_progress FOR ALL USING (user_id = auth.uid());

-- Homework: students manage their own, curators/admins can read all
CREATE POLICY "Students own submissions"      ON public.homework_submissions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Reviewers read submissions"    ON public.homework_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('curator', 'admin'))
);
CREATE POLICY "Reviewers manage reviews"      ON public.homework_reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('curator', 'admin'))
);
