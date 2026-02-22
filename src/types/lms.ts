/**
 * ============================================================================
 * LAURA LMS — Core Data Models
 * ============================================================================
 *
 * Domain-driven type definitions for the Learning Management System.
 * These interfaces serve as the single source of truth for:
 *   - Supabase / PostgreSQL schema generation
 *   - Zustand store typing
 *   - API request/response contracts
 *   - Component props derivation
 *
 * Naming: PascalCase for types, snake_case for DB columns (mapped via Supabase).
 * All timestamps are ISO-8601 strings from Supabase (timestamptz).
 * ============================================================================
 */

// ─── Shared Primitives ──────────────────────────────────────────────────────

/** UUID v4 string — primary key format used across all entities */
export type UUID = string;

/** ISO-8601 date-time string */
export type ISODateTime = string;

/** Supported video hosting providers */
export type VideoProvider = 'youtube' | 'vimeo' | 'bunny' | 'custom';

/** Downloadable attachment file types */
export type AttachmentType = 'pdf' | 'xlsx' | 'docx' | 'pptx' | 'zip' | 'image' | 'other';

// ─── Enums ──────────────────────────────────────────────────────────────────

/** System-wide user roles */
export enum UserRole {
  Student = 'student',
  Curator = 'curator',
  Admin = 'admin',
}

/** Publication status for courses, modules, and lessons */
export enum PublishStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

/** Student access level for a specific course enrollment */
export enum EnrollmentStatus {
  Active = 'active',
  Paused = 'paused',
  Revoked = 'revoked',
  Completed = 'completed',
}

/** Lesson completion state from the student's perspective */
export enum LessonStatus {
  Locked = 'locked',
  Available = 'available',
  InProgress = 'in_progress',
  Completed = 'completed',
}

/** Homework submission review state */
export enum HomeworkStatus {
  NotSubmitted = 'not_submitted',
  Pending = 'pending',        // "Очікує перевірки"
  Approved = 'approved',      // "Прийнято"
  Rejected = 'rejected',      // "Потребує доопрацювання"
}

// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
  id: UUID;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: ISODateTime;
  updated_at: ISODateTime;
  last_login_at: ISODateTime | null;
}

/** Lightweight projection used in lists, avatars, comments */
export interface UserPreview {
  id: UUID;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
}

// ─── Course ─────────────────────────────────────────────────────────────────

export interface Course {
  id: UUID;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  cover_url: string | null;
  status: PublishStatus;
  author_id: UUID;
  /** Ordered list of module IDs for explicit sequencing */
  module_order: UUID[];
  /** Total lessons count (denormalized for performance) */
  total_lessons: number;
  /** Duration in minutes (estimated) */
  estimated_duration_min: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/** Course with nested modules — used on the course program page */
export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

/** Course card in the student dashboard — includes personal progress */
export interface CourseCard extends Course {
  progress: CourseProgress;
}

// ─── Module ─────────────────────────────────────────────────────────────────

export interface Module {
  id: UUID;
  course_id: UUID;
  title: string;
  description: string | null;
  sort_order: number;
  /** Ordered list of lesson IDs within this module */
  lesson_order: UUID[];
  status: PublishStatus;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/** Module with its lessons expanded — used in course program view */
export interface ModuleWithLessons extends Module {
  lessons: LessonPreview[];
}

// ─── Lesson ─────────────────────────────────────────────────────────────────

export interface Lesson {
  id: UUID;
  module_id: UUID;
  course_id: UUID;
  title: string;
  slug: string;
  sort_order: number;
  /** Video embed URL (YouTube / Vimeo / Bunny CDN) */
  video_url: string | null;
  video_provider: VideoProvider | null;
  /** Duration of the video lesson in seconds */
  video_duration_sec: number | null;
  /** Rich-text lesson summary / notes ("Конспект") */
  content_html: string | null;
  /** Whether this lesson requires a homework submission */
  has_homework: boolean;
  /** Homework task description (markdown or rich-text) */
  homework_task: string | null;
  /** Attached downloadable materials */
  attachments: Attachment[];
  status: PublishStatus;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/** Compact lesson representation for module listings */
export interface LessonPreview {
  id: UUID;
  title: string;
  sort_order: number;
  video_duration_sec: number | null;
  has_homework: boolean;
  status: PublishStatus;
  /** Student-specific state — populated at runtime per user */
  user_status?: LessonStatus;
  /** Student's HW status for this lesson — populated at runtime */
  homework_status?: HomeworkStatus;
}

/** Full lesson data for the Player View page */
export interface LessonFull extends Lesson {
  /** Student's progress record (null if not started) */
  progress: LessonProgress | null;
  /** Student's homework submission (null if not submitted) */
  homework_submission: HomeworkSubmission | null;
}

// ─── Attachments ────────────────────────────────────────────────────────────

export interface Attachment {
  id: UUID;
  lesson_id: UUID;
  title: string;
  file_url: string;
  file_type: AttachmentType;
  file_size_bytes: number;
  sort_order: number;
  created_at: ISODateTime;
}

// ─── Progress Tracking ──────────────────────────────────────────────────────

/** Student ↔ Course enrollment and aggregate progress */
export interface Enrollment {
  id: UUID;
  user_id: UUID;
  course_id: UUID;
  status: EnrollmentStatus;
  enrolled_at: ISODateTime;
  /** Timestamp of last activity in this course */
  last_accessed_at: ISODateTime | null;
}

/** Aggregate course progress (computed or denormalized) */
export interface CourseProgress {
  enrollment_id: UUID;
  user_id: UUID;
  course_id: UUID;
  /** Number of completed lessons */
  completed_lessons: number;
  /** Total lessons in course */
  total_lessons: number;
  /** Percentage 0-100 */
  percentage: number;
  /** ID of the last lesson the student interacted with */
  last_lesson_id: UUID | null;
  updated_at: ISODateTime;
}

/** Per-lesson progress tracking */
export interface LessonProgress {
  id: UUID;
  user_id: UUID;
  lesson_id: UUID;
  course_id: UUID;
  status: LessonStatus;
  /** Video playback position in seconds (for resume) */
  video_position_sec: number;
  /** Whether the student has watched ≥90% of the video */
  video_completed: boolean;
  started_at: ISODateTime;
  completed_at: ISODateTime | null;
}

// ─── Homework ───────────────────────────────────────────────────────────────

/** Student's homework submission */
export interface HomeworkSubmission {
  id: UUID;
  user_id: UUID;
  lesson_id: UUID;
  course_id: UUID;
  /** Student's answer — text, links, or rich content */
  content: string;
  /** Optional attached file URL (e.g., Google Docs link) */
  attachment_url: string | null;
  status: HomeworkStatus;
  submitted_at: ISODateTime;
  updated_at: ISODateTime;
}

/** Curator/Admin review of a homework submission */
export interface HomeworkReview {
  id: UUID;
  submission_id: UUID;
  reviewer_id: UUID;
  /** Reviewer info — populated via join */
  reviewer?: UserPreview;
  /** Curator's feedback comment */
  comment: string;
  /** Status set by the reviewer */
  status: HomeworkStatus;
  created_at: ISODateTime;
}

/** Homework item in the Admin review feed — enriched with context */
export interface HomeworkFeedItem {
  submission: HomeworkSubmission;
  student: UserPreview;
  lesson_title: string;
  course_title: string;
  reviews: HomeworkReview[];
}

// ─── Admin: User Management ────────────────────────────────────────────────

/** Row in the admin student management table */
export interface AdminStudentRow {
  user: UserPreview;
  enrollments: Array<{
    course_id: UUID;
    course_title: string;
    status: EnrollmentStatus;
    progress: CourseProgress;
  }>;
  last_login_at: ISODateTime | null;
}

// ─── Admin: Course Builder ──────────────────────────────────────────────────

/** Payload for creating / updating a course */
export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  cover_url: string | null;
  status: PublishStatus;
}

/** Payload for creating / updating a module */
export interface ModuleFormData {
  title: string;
  description: string | null;
  sort_order: number;
  status: PublishStatus;
}

/** Payload for creating / updating a lesson */
export interface LessonFormData {
  title: string;
  slug: string;
  sort_order: number;
  video_url: string | null;
  video_provider: VideoProvider | null;
  video_duration_sec: number | null;
  content_html: string | null;
  has_homework: boolean;
  homework_task: string | null;
  status: PublishStatus;
}

/** Payload for submitting homework */
export interface HomeworkSubmitData {
  content: string;
  attachment_url: string | null;
}

/** Payload for reviewing homework (curator action) */
export interface HomeworkReviewData {
  comment: string;
  status: HomeworkStatus.Approved | HomeworkStatus.Rejected;
}

// ─── Navigation / UI State ─────────────────────────────────────────────────

/** Sidebar navigation item */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  active?: boolean;
}

/** Tab definition for the lesson player view */
export interface LessonTab {
  id: 'summary' | 'materials' | 'homework';
  label: string;
  icon: string;
}

/** Active tab state for lesson player */
export const LESSON_TABS: LessonTab[] = [
  { id: 'summary', label: 'Конспект', icon: 'FileText' },
  { id: 'materials', label: 'Матеріали', icon: 'Download' },
  { id: 'homework', label: 'Домашнє завдання', icon: 'ClipboardCheck' },
];
