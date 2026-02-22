'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, CheckCircle2, PlayCircle, Inbox } from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import type { CourseCard } from '@/types/lms';

export default function CoursesListPage() {
  const { courseCards, loadCourseCards, isLoading } = useLmsStore();

  useEffect(() => {
    loadCourseCards();
  }, [loadCourseCards]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-3">
          Навчання
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight">
          Мої курси
        </h1>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4" role="status" aria-label="Завантаження">
          {[1, 2].map((i) => (
            <div key={i} className="border border-[var(--border-color)] p-8 animate-pulse">
              <div className="h-8 w-64 bg-[var(--border-color)] mb-3 rounded-sm" />
              <div className="h-4 w-96 max-w-full bg-[var(--border-color)] rounded-sm" />
            </div>
          ))}
          <span className="sr-only">Завантаження...</span>
        </div>
      ) : courseCards.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border border-dashed border-[var(--border-color)] p-10 md:p-16 flex flex-col items-center text-center"
        >
          <Inbox size={32} className="text-[var(--muted)] opacity-30 mb-5" />
          <h3 className="text-lg md:text-xl font-[var(--font-h)] font-bold text-[var(--fg)] mb-2">
            У вас поки немає курсів
          </h3>
          <p className="text-sm text-[var(--muted)] max-w-sm">
            Оберіть курс з каталогу, щоб розпочати навчання
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {courseCards.map((course, i) => (
            <CourseListItem key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </>
  );
}

function CourseListItem({ course, index }: { course: CourseCard; index: number }) {
  const isCompleted = course.progress.percentage === 100;
  const hasProgress = course.progress.percentage > 0;
  const hours = Math.floor(course.estimated_duration_min / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/dashboard/courses/${course.slug}`}
        aria-label={`${course.title} — прогрес ${course.progress.percentage}%`}
        className="group flex flex-col md:flex-row md:items-center justify-between border border-[var(--border-color)] p-6 md:p-8 hover:border-[var(--fg)] transition-colors duration-300 gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {isCompleted ? (
              <CheckCircle2 size={16} className="text-[var(--fg)] flex-shrink-0" />
            ) : hasProgress ? (
              <PlayCircle size={16} className="text-[var(--muted)] flex-shrink-0" />
            ) : (
              <BookOpen size={16} className="text-[var(--muted)] flex-shrink-0" />
            )}
            <h3 className="text-lg md:text-xl font-[var(--font-h)] font-semibold text-[var(--fg)] line-clamp-1">
              {course.title}
            </h3>
          </div>
          <p className="text-sm text-[var(--muted)] mb-3">{course.short_description}</p>
          <div className="flex items-center gap-5 text-xs text-[var(--muted)]">
            <span>{course.total_lessons} уроків</span>
            <span>{hours} год</span>
            <span>{course.progress.completed_lessons}/{course.total_lessons} пройдено</span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Progress bar */}
          <div className="w-24 md:w-32">
            <div className="h-1 bg-[var(--border-color)] w-full">
              <div
                className="h-full bg-[var(--fg)] transition-all duration-500"
                style={{ width: `${course.progress.percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-1 text-right">
              {course.progress.percentage}%
            </p>
          </div>
          <ArrowRight
            size={16}
            className="text-[var(--muted)] group-hover:text-[var(--fg)] group-hover:translate-x-1 transition-all duration-300"
          />
        </div>
      </Link>
    </motion.div>
  );
}
