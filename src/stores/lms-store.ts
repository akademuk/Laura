/**
 * ============================================================================
 * LAURA LMS — LMS Store (Zustand)
 * ============================================================================
 * Central store for all LMS data: courses, lessons, progress, homework.
 * Provides selectors and actions consumed by both Student and Admin UIs.
 * In production: actions become Supabase RPC / REST calls.
 * ============================================================================
 */

import { create } from 'zustand';
import type {
  CourseCard,
  CourseWithModules,
  LessonFull,
  LessonProgress,
  HomeworkSubmission,
  HomeworkFeedItem,
  AdminStudentRow,
  HomeworkReviewData,
  HomeworkSubmitData,
  EnrollmentStatus,
} from '@/types/lms';
import { HomeworkStatus, LessonStatus } from '@/types/lms';
import {
  MOCK_COURSE_CARDS,
  MOCK_COURSE_WITH_MODULES,
  MOCK_LESSON_FULL,
  MOCK_HOMEWORK_FEED,
  MOCK_ADMIN_STUDENTS,
  LESSONS,
  ATTACHMENTS,
  LESSON_PROGRESS,
  HOMEWORK_SUBMISSIONS,
} from '@/lib/mock-data';
import { useAuthStore } from './auth-store';

// ─── Helper: get current user ID from auth store ────────────────────────────

function getCurrentUserId(): string {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('[LMS Store] No authenticated user — cannot perform action');
  return user.id;
}

// ─── Granular Loading States ────────────────────────────────────────────────

interface LoadingState {
  courseCards: boolean;
  course: boolean;
  lesson: boolean;
  adminStudents: boolean;
  homeworkFeed: boolean;
}

// ─── State Shape ────────────────────────────────────────────────────────────

interface LmsState {
  // ── Student Dashboard ──
  courseCards: CourseCard[];
  loadCourseCards: () => void;

  // ── Course Program ──
  activeCourse: CourseWithModules | null;
  loadCourse: (courseId: string) => void;

  // ── Lesson Player ──
  activeLesson: LessonFull | null;
  activeLessonTab: 'summary' | 'materials' | 'homework';
  loadLesson: (lessonId: string) => void;
  setLessonTab: (tab: 'summary' | 'materials' | 'homework') => void;
  updateVideoPosition: (lessonId: string, positionSec: number) => void;
  markLessonCompleted: (lessonId: string) => void;

  // ── Homework ──
  submitHomework: (lessonId: string, data: HomeworkSubmitData) => void;

  // ── Admin: Student Management ──
  adminStudents: AdminStudentRow[];
  loadAdminStudents: () => void;
  updateEnrollmentStatus: (
    userId: string,
    courseId: string,
    status: EnrollmentStatus
  ) => void;

  // ── Admin: Homework Review ──
  homeworkFeed: HomeworkFeedItem[];
  loadHomeworkFeed: () => void;
  reviewHomework: (submissionId: string, data: HomeworkReviewData) => void;

  // ── Granular Loading ──
  /** @deprecated Use `loading` object instead */
  isLoading: boolean;
  /** Granular loading flags — one per async operation */
  loading: LoadingState;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useLmsStore = create<LmsState>((set, get) => ({
  // ── Initial State ──
  courseCards: [],
  activeCourse: null,
  activeLesson: null,
  activeLessonTab: 'summary',
  adminStudents: [],
  homeworkFeed: [],
  isLoading: false,
  loading: {
    courseCards: false,
    course: false,
    lesson: false,
    adminStudents: false,
    homeworkFeed: false,
  },

  // ── Student Dashboard ──

  loadCourseCards: () => {
    set((s) => ({
      isLoading: true,
      loading: { ...s.loading, courseCards: true },
    }));
    // Simulate API delay
    setTimeout(() => {
      set((s) => ({
        courseCards: MOCK_COURSE_CARDS,
        isLoading: false,
        loading: { ...s.loading, courseCards: false },
      }));
    }, 300);
  },

  // ── Course Program ──

  loadCourse: (courseId: string) => {
    set((s) => ({
      isLoading: true,
      loading: { ...s.loading, course: true },
    }));
    setTimeout(() => {
      // For mock: only course 1 has full data
      if (courseId === 'crs-001') {
        set((s) => ({
          activeCourse: MOCK_COURSE_WITH_MODULES,
          isLoading: false,
          loading: { ...s.loading, course: false },
        }));
      } else {
        set((s) => ({
          activeCourse: null,
          isLoading: false,
          loading: { ...s.loading, course: false },
        }));
      }
    }, 300);
  },

  // ── Lesson Player ──

  loadLesson: (lessonId: string) => {
    set((s) => ({
      isLoading: true,
      activeLessonTab: 'summary',
      loading: { ...s.loading, lesson: true },
    }));
    setTimeout(() => {
      const lesson = LESSONS.find((l) => l.id === lessonId);
      if (!lesson) {
        set((s) => ({
          activeLesson: null,
          isLoading: false,
          loading: { ...s.loading, lesson: false },
        }));
        return;
      }

      const userId = getCurrentUserId();
      const attachments = ATTACHMENTS.filter((a) => a.lesson_id === lessonId);
      const progress =
        LESSON_PROGRESS.find(
          (p) => p.lesson_id === lessonId && p.user_id === userId
        ) ?? null;
      const hwSubmission =
        HOMEWORK_SUBMISSIONS.find(
          (s) => s.lesson_id === lessonId && s.user_id === userId
        ) ?? null;

      set((s) => ({
        activeLesson: {
          ...lesson,
          attachments,
          progress,
          homework_submission: hwSubmission,
        },
        isLoading: false,
        loading: { ...s.loading, lesson: false },
      }));
    }, 300);
  },

  setLessonTab: (tab) => {
    set({ activeLessonTab: tab });
  },

  updateVideoPosition: (lessonId: string, positionSec: number) => {
    const { activeLesson } = get();
    if (!activeLesson || activeLesson.id !== lessonId) return;

    const userId = getCurrentUserId();
    const updatedProgress: LessonProgress = activeLesson.progress
      ? { ...activeLesson.progress, video_position_sec: positionSec }
      : {
          id: `lp-${Date.now()}`,
          user_id: userId,
          lesson_id: lessonId,
          course_id: activeLesson.course_id,
          status: LessonStatus.InProgress,
          video_position_sec: positionSec,
          video_completed: false,
          started_at: new Date().toISOString(),
          completed_at: null,
        };

    set({
      activeLesson: { ...activeLesson, progress: updatedProgress },
    });
  },

  markLessonCompleted: (lessonId: string) => {
    const { activeLesson } = get();
    if (!activeLesson || activeLesson.id !== lessonId) return;

    const userId = getCurrentUserId();
    const updatedProgress: LessonProgress = {
      ...(activeLesson.progress ?? {
        id: `lp-${Date.now()}`,
        user_id: userId,
        lesson_id: lessonId,
        course_id: activeLesson.course_id,
        video_position_sec: 0,
        video_completed: true,
        started_at: new Date().toISOString(),
      }),
      status: LessonStatus.Completed,
      video_completed: true,
      completed_at: new Date().toISOString(),
    };

    set({
      activeLesson: { ...activeLesson, progress: updatedProgress },
    });
  },

  // ── Homework Submission ──

  submitHomework: (lessonId: string, data: HomeworkSubmitData) => {
    const { activeLesson } = get();
    if (!activeLesson || activeLesson.id !== lessonId) return;

    const userId = getCurrentUserId();
    const submission: HomeworkSubmission = {
      id: `hw-sub-${Date.now()}`,
      user_id: userId,
      lesson_id: lessonId,
      course_id: activeLesson.course_id,
      content: data.content,
      attachment_url: data.attachment_url,
      status: HomeworkStatus.Pending,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set({
      activeLesson: { ...activeLesson, homework_submission: submission },
    });
  },

  // ── Admin: Students ──

  loadAdminStudents: () => {
    set((s) => ({
      isLoading: true,
      loading: { ...s.loading, adminStudents: true },
    }));
    setTimeout(() => {
      set((s) => ({
        adminStudents: MOCK_ADMIN_STUDENTS,
        isLoading: false,
        loading: { ...s.loading, adminStudents: false },
      }));
    }, 300);
  },

  updateEnrollmentStatus: (userId, courseId, status) => {
    set((state) => ({
      adminStudents: state.adminStudents.map((row) => {
        if (row.user.id !== userId) return row;
        return {
          ...row,
          enrollments: row.enrollments.map((e) =>
            e.course_id === courseId ? { ...e, status } : e
          ),
        };
      }),
    }));
  },

  // ── Admin: Homework Feed ──

  loadHomeworkFeed: () => {
    set((s) => ({
      isLoading: true,
      loading: { ...s.loading, homeworkFeed: true },
    }));
    setTimeout(() => {
      set((s) => ({
        homeworkFeed: MOCK_HOMEWORK_FEED,
        isLoading: false,
        loading: { ...s.loading, homeworkFeed: false },
      }));
    }, 300);
  },

  reviewHomework: (submissionId: string, data: HomeworkReviewData) => {
    set((state) => ({
      homeworkFeed: state.homeworkFeed.map((item) => {
        if (item.submission.id !== submissionId) return item;
        return {
          ...item,
          submission: { ...item.submission, status: data.status },
          reviews: [
            ...item.reviews,
            {
              id: `hw-rev-${Date.now()}`,
              submission_id: submissionId,
              reviewer_id: getCurrentUserId(),
              comment: data.comment,
              status: data.status,
              created_at: new Date().toISOString(),
            },
          ],
        };
      }),
    }));
  },
}));
