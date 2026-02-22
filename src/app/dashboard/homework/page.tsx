'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, FileText, Inbox } from 'lucide-react';
import { HOMEWORK_SUBMISSIONS, COURSES, LESSONS, HOMEWORK_REVIEWS } from '@/lib/mock-data';
import { HomeworkStatus } from '@/types/lms';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';

const statusConfig: Record<HomeworkStatus, { label: string; icon: typeof CheckCircle2; style: string }> = {
  [HomeworkStatus.NotSubmitted]: { label: 'Не здано', icon: FileText, style: 'text-[var(--muted)] opacity-50' },
  [HomeworkStatus.Pending]: { label: 'На перевірці', icon: Clock, style: 'text-[var(--muted)]' },
  [HomeworkStatus.Approved]: { label: 'Прийнято', icon: CheckCircle2, style: 'text-[var(--fg)]' },
  [HomeworkStatus.Rejected]: { label: 'Доопрацювати', icon: AlertCircle, style: 'text-[var(--fg)] opacity-70' },
};

export default function HomeworkPage() {
  const { user } = useAuthStore();
  const userId = user?.id ?? 'usr-student-001';

  // Filter submissions by current user
  const submissions = useMemo(
    () => HOMEWORK_SUBMISSIONS.filter((s) => s.user_id === userId),
    [userId]
  );

  const stats = useMemo(
    () => [
      { label: 'Здано', value: submissions.length },
      { label: 'Прийнято', value: submissions.filter((s) => s.status === HomeworkStatus.Approved).length },
      { label: 'На перевірці', value: submissions.filter((s) => s.status === HomeworkStatus.Pending).length },
    ],
    [submissions]
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 md:mb-14"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-3">
          Перевірка
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight">
          Домашні завдання
        </h1>
      </motion.div>

      {/* Summary stats */}
      {submissions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-3 gap-px bg-[var(--border-color)] border border-[var(--border-color)] mb-10"
          role="region"
          aria-label="Статистика домашніх завдань"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--bg)] px-5 py-4">
              <p className="text-2xl font-[var(--font-h)] font-bold text-[var(--fg)]">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {submissions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border border-dashed border-[var(--border-color)] p-10 md:p-16 flex flex-col items-center text-center"
        >
          <Inbox size={32} className="text-[var(--muted)] opacity-30 mb-5" />
          <h3
            className="text-lg md:text-xl font-bold text-[var(--fg)] mb-2"
            style={{ fontFamily: 'var(--font-h)' }}
          >
            Ще немає відправлених завдань
          </h3>
          <p className="text-sm text-[var(--muted)] max-w-sm mb-6">
            Виконуйте домашні завдання в уроках, щоб вони з'явилися тут
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--fg)] text-xs uppercase tracking-[0.2em] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            Перейти до курсів
          </Link>
        </motion.div>
      ) : (
        /* Submissions list */
        <div className="space-y-3">
          {submissions.map((sub, i) => {
            const lesson = LESSONS.find((l) => l.id === sub.lesson_id);
            const course = COURSES.find((c) => c.id === sub.course_id);
            const reviews = HOMEWORK_REVIEWS.filter((r) => r.submission_id === sub.id);
            const config = statusConfig[sub.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className="border border-[var(--border-color)] p-6 md:p-8"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-1 truncate">
                      {course?.title ?? 'Курс'}
                    </p>
                    <h3 className="text-base md:text-lg font-[var(--font-h)] font-semibold text-[var(--fg)] line-clamp-2">
                      {lesson?.title ?? 'Урок'}
                    </h3>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs flex-shrink-0 ${config.style}`}>
                    <Icon size={14} />
                    {config.label}
                  </span>
                </div>

                {/* Submission content preview */}
                <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2 mb-4">
                  {sub.content}
                </p>

                {/* Review feedback */}
                {reviews.length > 0 && (
                  <div className="border-t border-[var(--border-color)] pt-4 mt-4 space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">
                          {review.reviewer?.full_name?.charAt(0) ?? 'К'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[var(--fg)] mb-1">
                            {review.reviewer?.full_name ?? 'Куратор'}
                          </p>
                          <p className="text-sm text-[var(--muted)] leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Date */}
                <p className="text-[10px] text-[var(--muted)] opacity-50 mt-4">
                  Здано: {new Date(sub.submitted_at).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}