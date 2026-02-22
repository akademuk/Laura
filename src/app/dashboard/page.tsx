'use client';

import { useEffect, useRef, useMemo, memo } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Search,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { useAuthStore } from '@/stores/auth-store';
import type { CourseCard } from '@/types/lms';

/* ─── Progress Ring (memoized) ─── */
const ProgressRing = memo(function ProgressRing({
  percentage,
  size = 56,
}: {
  percentage: number;
  size?: number;
}) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      className="rotate-[-90deg]"
      role="img"
      aria-label={`Прогрес: ${clampedPct}%`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--border-color)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--fg)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  );
});

/* ─── Course Card Component ─── */
function DashboardCourseCard({ course, index }: { course: CourseCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const isCompleted = course.progress.percentage === 100;
  const hasProgress = course.progress.percentage > 0;

  const formatDuration = (min: number) => {
    const hours = Math.floor(min / 60);
    const mins = min % 60;
    if (hours === 0) return `${mins} хв`;
    if (mins === 0) return `${hours} год`;
    return `${hours} год ${mins} хв`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/dashboard/courses/${course.slug}`}
        className="group block border border-[var(--border-color)] p-6 md:p-8 transition-all duration-500 hover:border-[var(--fg)] relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        aria-label={`Курс: ${course.title}. Прогрес: ${course.progress.percentage}%`}
      >
        {/* Hover fill */}
        <div className="absolute inset-0 bg-[var(--fg)] scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />

        <div className="relative z-10">
          {/* Top row: index + status */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] tracking-[0.3em] text-[var(--muted)] font-mono group-hover:text-[var(--bg)] transition-colors duration-500">
              КУРС {String(index + 1).padStart(2, '0')}
            </span>
            {isCompleted ? (
              <span className="flex items-center gap-1.5 text-xs text-[var(--fg)] group-hover:text-[var(--bg)] transition-colors duration-500">
                <CheckCircle2 size={14} />
                Завершено
              </span>
            ) : hasProgress ? (
              <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] group-hover:text-[var(--bg)] transition-colors duration-500">
                <PlayCircle size={14} />
                В процесі
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl lg:text-3xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight mb-4 line-clamp-2 group-hover:text-[var(--bg)] transition-colors duration-500">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-8 max-w-lg line-clamp-2 group-hover:text-[var(--bg)] group-hover:opacity-70 transition-all duration-500">
            {course.short_description}
          </p>

          {/* Bottom row: stats + progress */}
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-6 text-xs text-[var(--muted)] group-hover:text-[var(--bg)] transition-colors duration-500">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} strokeWidth={1.5} />
                {course.total_lessons} уроків
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} strokeWidth={1.5} />
                {formatDuration(course.estimated_duration_min)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {hasProgress && (
                <div className="relative">
                  <ProgressRing percentage={course.progress.percentage} />
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--fg)] group-hover:text-[var(--bg)] transition-colors duration-500">
                    {course.progress.percentage}%
                  </span>
                </div>
              )}
              <div
                className="w-10 h-10 border border-[var(--border-color)] flex items-center justify-center group-hover:border-[var(--bg)] transition-colors duration-500"
                aria-hidden="true"
              >
                <ArrowRight
                  size={16}
                  className="text-[var(--fg)] group-hover:text-[var(--bg)] group-hover:translate-x-0.5 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Quick Stats (memoized computations) ─── */
function QuickStats({ courses }: { courses: CourseCard[] }) {
  const stats = useMemo(() => {
    const totalLessons = courses.reduce((sum, c) => sum + c.total_lessons, 0);
    const completedLessons = courses.reduce((sum, c) => sum + c.progress.completed_lessons, 0);
    const activeCourses = courses.filter(
      (c) => c.progress.percentage > 0 && c.progress.percentage < 100
    ).length;
    const overallProgress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    return [
      { label: 'Активних курсів', value: activeCourses.toString() },
      { label: 'Пройдено уроків', value: `${completedLessons}/${totalLessons}` },
      { label: 'Загальний прогрес', value: `${overallProgress}%` },
    ];
  }, [courses]);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border-color)] border border-[var(--border-color)] mb-12 md:mb-16"
      role="region"
      aria-label="Статистика навчання"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          className="bg-[var(--bg)] px-6 py-5 md:py-6"
        >
          <p className="text-2xl md:text-3xl font-[var(--font-h)] font-bold text-[var(--fg)] mb-1">
            {stat.value}
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyCoursesState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="border border-dashed border-[var(--border-color)] p-10 md:p-16 flex flex-col items-center text-center"
    >
      <Search size={32} className="text-[var(--muted)] opacity-30 mb-5" />
      <h3
        className="text-lg md:text-xl font-bold text-[var(--fg)] mb-2"
        style={{ fontFamily: 'var(--font-h)' }}
      >
        У вас поки немає курсів
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-sm mb-6">
        Оберіть курс з каталогу, щоб розпочати навчання з Лаурою
      </p>
      <Link
        href="/#courses"
        className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--fg)] text-xs uppercase tracking-[0.2em] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
      >
        <BookOpen size={14} />
        Переглянути каталог
      </Link>
    </motion.div>
  );
}

/* ─── Skeleton Loader ─── */
function CourseCardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Завантаження курсів">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="border border-[var(--border-color)] p-6 md:p-8 animate-pulse"
        >
          <div className="h-3 w-16 bg-[var(--border-color)] mb-8 rounded-sm" />
          <div className="h-7 w-72 bg-[var(--border-color)] mb-3 rounded-sm" />
          <div className="h-4 w-96 max-w-full bg-[var(--border-color)] mb-8 rounded-sm" />
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-3 w-20 bg-[var(--border-color)] rounded-sm" />
              <div className="h-3 w-14 bg-[var(--border-color)] rounded-sm" />
            </div>
            <div className="w-10 h-10 border border-[var(--border-color)] rounded-sm" />
          </div>
        </div>
      ))}
      <span className="sr-only">Завантаження...</span>
    </div>
  );
}

/* ─── Main Dashboard Page ─── */
export default function DashboardPage() {
  const { courseCards, loadCourseCards, isLoading } = useLmsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadCourseCards();
  }, [loadCourseCards]);

  const firstName = user?.full_name?.split(' ')[0] ?? 'Студент';

  return (
    <>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-3">
          Кабінет студента
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight">
          Вітаю, {firstName}
        </h1>
      </motion.div>

      {/* Quick Stats — only when there are courses */}
      {courseCards.length > 0 && <QuickStats courses={courseCards} />}

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center gap-4 mb-8"
      >
        <TrendingUp size={16} className="text-[var(--muted)]" aria-hidden="true" />
        <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-medium">
          Мої курси
        </span>
        <div className="flex-1 h-px bg-[var(--border-color)]" aria-hidden="true" />
      </motion.div>

      {/* Course Cards */}
      {isLoading ? (
        <CourseCardSkeleton />
      ) : courseCards.length === 0 ? (
        <EmptyCoursesState />
      ) : (
        <div className="space-y-4">
          {courseCards.map((course, i) => (
            <DashboardCourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </>
  );
}