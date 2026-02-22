'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  Lock,
  Clock,
  ClipboardCheck,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { LessonStatus, HomeworkStatus, type ModuleWithLessons, type LessonPreview } from '@/types/lms';

/* ─── Helpers ─── */
function formatDuration(sec: number | null): string {
  if (!sec) return '';
  const min = Math.floor(sec / 60);
  return `${min} хв`;
}

function lessonStatusIcon(status?: LessonStatus) {
  switch (status) {
    case LessonStatus.Completed:
      return <CheckCircle2 size={16} className="text-[var(--fg)]" />;
    case LessonStatus.InProgress:
      return <PlayCircle size={16} className="text-[var(--fg)]" />;
    case LessonStatus.Locked:
      return <Lock size={14} className="text-[var(--muted)] opacity-40" />;
    default:
      return <div className="w-4 h-4 border border-[var(--border-color)] rounded-full" />;
  }
}

function homeworkBadge(status?: HomeworkStatus) {
  if (!status || status === HomeworkStatus.NotSubmitted) return null;
  const labels: Record<string, { text: string; style: string }> = {
    [HomeworkStatus.Pending]: { text: 'На перевірці', style: 'text-[var(--muted)]' },
    [HomeworkStatus.Approved]: { text: 'Прийнято', style: 'text-[var(--fg)]' },
    [HomeworkStatus.Rejected]: { text: 'Доопрацювати', style: 'text-[var(--fg)] opacity-60' },
  };
  const config = labels[status];
  if (!config) return null;
  return (
    <span className={`text-[10px] uppercase tracking-[0.15em] ${config.style}`}>
      {config.text}
    </span>
  );
}

/* ─── Module Accordion ─── */
function ModuleAccordion({
  module,
  index,
  courseSlug,
  defaultOpen = false,
}: {
  module: ModuleWithLessons;
  index: number;
  courseSlug: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const completedCount = module.lessons.filter(
    (l) => l.user_status === LessonStatus.Completed
  ).length;
  const totalCount = module.lessons.length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border border-[var(--border-color)]"
    >
      {/* Module header */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left group hover:bg-[var(--fg)]/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-[10px] tracking-[0.3em] text-[var(--muted)] font-mono flex-shrink-0">
            М{String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-[var(--font-h)] font-semibold text-[var(--fg)] truncate">
              {module.title}
            </h3>
            {module.description && (
              <p className="text-xs text-[var(--muted)] mt-0.5 truncate hidden sm:block">
                {module.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <span className="text-xs text-[var(--muted)] hidden sm:inline">
            {completedCount}/{totalCount}
          </span>
          {/* Mini progress bar */}
          <div className="w-16 h-1 bg-[var(--border-color)] hidden sm:block">
            <div
              className="h-full bg-[var(--fg)] transition-all duration-700"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <ChevronDown
            size={16}
            className={`text-[var(--muted)] transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Lessons list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="lessons"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[var(--border-color)] overflow-hidden"
          >
            {module.lessons.map((lesson, li) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={li}
                courseSlug={courseSlug}
                isLast={li === module.lessons.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Lesson Row ─── */
function LessonRow({
  lesson,
  index,
  courseSlug,
  isLast,
}: {
  lesson: LessonPreview;
  index: number;
  courseSlug: string;
  isLast: boolean;
}) {
  const isLocked = lesson.user_status === LessonStatus.Locked;

  const content = (
    <div
      className={`
        flex items-center gap-4 px-6 py-4 md:px-8 md:py-5 transition-colors duration-300
        ${!isLast ? 'border-b border-[var(--border-color)]' : ''}
        ${isLocked
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:bg-[var(--fg)]/[0.03] cursor-pointer group'
        }
      `}
    >
      {/* Status icon */}
      <div className="flex-shrink-0">
        {lessonStatusIcon(lesson.user_status)}
      </div>

      {/* Lesson info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-sm md:text-base text-[var(--fg)] group-hover:text-[var(--fg)] truncate">
            {lesson.title}
          </span>
          {lesson.has_homework && (
            <ClipboardCheck size={13} className="text-[var(--muted)] flex-shrink-0" />
          )}
        </div>
        {/* HW status badge */}
        {lesson.has_homework && homeworkBadge(lesson.homework_status)}
      </div>

      {/* Duration */}
      {lesson.video_duration_sec && (
        <span className="flex items-center gap-1 text-xs text-[var(--muted)] flex-shrink-0">
          <Clock size={12} />
          {formatDuration(lesson.video_duration_sec)}
        </span>
      )}

      {/* Arrow */}
      {!isLocked && (
        <ArrowRight
          size={14}
          className="text-[var(--muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0"
        />
      )}
    </div>
  );

  if (isLocked) {
    return (
      <div key={lesson.id} aria-label={`${lesson.title} — заблокований`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/courses/${courseSlug}/lesson/${lesson.id}`}
      key={lesson.id}
      className="focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--fg)]"
    >
      {content}
    </Link>
  );
}

/* ─── Course Header ─── */
function CourseHeader({
  title,
  description,
  totalLessons,
  completedLessons,
  percentage,
  estimatedMin,
}: {
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  estimatedMin: number;
}) {
  const hours = Math.floor(estimatedMin / 60);

  return (
    <div className="mb-10 md:mb-14">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors mb-6 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Мої курси
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight mb-4"
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-2xl mb-8"
      >
        {description}
      </motion.p>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center gap-6 md:gap-10"
      >
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-[var(--muted)]" />
          <span className="text-sm text-[var(--muted)]">{totalLessons} уроків</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[var(--muted)]" />
          <span className="text-sm text-[var(--muted)]">{hours} годин</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[var(--muted)]" />
          <span className="text-sm text-[var(--muted)]">
            {completedLessons} з {totalLessons} пройдено
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="flex-1 h-1 bg-[var(--border-color)]">
            <motion.div
              className="h-full bg-[var(--fg)]"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="text-sm font-bold text-[var(--fg)]">{percentage}%</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Course Page ─── */
export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { activeCourse, loadCourse, courseCards, loadCourseCards, isLoading } = useLmsStore();

  // Find course ID by slug
  useEffect(() => {
    if (courseCards.length === 0) {
      loadCourseCards();
    }
  }, [courseCards.length, loadCourseCards]);

  useEffect(() => {
    const course = courseCards.find((c) => c.slug === slug);
    if (course) {
      loadCourse(course.id);
    }
  }, [slug, courseCards, loadCourse]);

  if (isLoading || !activeCourse) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-[var(--border-color)] animate-pulse" />
        <div className="h-12 w-80 bg-[var(--border-color)] animate-pulse" />
        <div className="h-4 w-96 bg-[var(--border-color)] animate-pulse" />
        <div className="space-y-3 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-[var(--border-color)] p-6 animate-pulse">
              <div className="h-5 w-64 bg-[var(--border-color)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get progress from courseCards
  const courseCard = courseCards.find((c) => c.slug === slug);
  const progress = courseCard?.progress;

  return (
    <>
      <CourseHeader
        title={activeCourse.title}
        description={activeCourse.description}
        totalLessons={activeCourse.total_lessons}
        completedLessons={progress?.completed_lessons ?? 0}
        percentage={progress?.percentage ?? 0}
        estimatedMin={activeCourse.estimated_duration_min}
      />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4 mb-6"
      >
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-medium">
          Програма курсу
        </span>
        <div className="flex-1 h-px bg-[var(--border-color)]" />
        <span className="text-xs text-[var(--muted)]">
          {activeCourse.modules.length} модулів
        </span>
      </motion.div>

      {/* Modules */}
      <div className="space-y-3">
        {activeCourse.modules.map((module, i) => (
          <ModuleAccordion
            key={module.id}
            module={module}
            index={i}
            courseSlug={slug}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </>
  );
}
