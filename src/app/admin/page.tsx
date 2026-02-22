'use client';

import { useEffect, useMemo } from 'react';
import { motion, type Variants, type Easing } from 'framer-motion';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { HomeworkStatus, EnrollmentStatus } from '@/types/lms';
import Link from 'next/link';

const EASE: Easing = [0.25, 0.1, 0.25, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: EASE },
  }),
};

export default function AdminDashboard() {
  const { adminStudents, loadAdminStudents, homeworkFeed, loadHomeworkFeed } =
    useLmsStore();

  useEffect(() => {
    loadAdminStudents();
    loadHomeworkFeed();
  }, [loadAdminStudents, loadHomeworkFeed]);

  const stats = useMemo(() => {
    const totalStudents = adminStudents.length;
    const activeEnrollments = adminStudents.reduce(
      (acc, s) =>
        acc + s.enrollments.filter((e) => e.status === EnrollmentStatus.Active).length,
      0
    );
    const pendingHomework = homeworkFeed.filter(
      (h) => h.submission.status === HomeworkStatus.Pending
    ).length;
    const avgProgress =
      adminStudents.length > 0
        ? Math.round(
            adminStudents.reduce(
              (acc, s) =>
                acc +
                s.enrollments.reduce((a, e) => a + e.progress.percentage, 0) /
                  Math.max(s.enrollments.length, 1),
              0
            ) / adminStudents.length
          )
        : 0;

    return [
      {
        label: 'Студентів',
        value: totalStudents,
        icon: Users,
        href: '/admin/students',
      },
      {
        label: 'Активних записів',
        value: activeEnrollments,
        icon: BookOpen,
        href: '/admin/courses',
      },
      {
        label: 'Очікує перевірки',
        value: pendingHomework,
        icon: ClipboardCheck,
        href: '/admin/homework',
        accent: pendingHomework > 0,
      },
      {
        label: 'Середній прогрес',
        value: `${avgProgress}%`,
        icon: TrendingUp,
        href: '/admin/students',
      },
    ];
  }, [adminStudents, homeworkFeed]);

  const recentHomework = useMemo(
    () =>
      [...homeworkFeed]
        .sort(
          (a, b) =>
            new Date(b.submission.submitted_at).getTime() -
            new Date(a.submission.submitted_at).getTime()
        )
        .slice(0, 5),
    [homeworkFeed]
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
          Панель управління
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[var(--fg)] leading-tight"
          style={{ fontFamily: 'var(--font-h)' }}
        >
          Аналітика
        </h1>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={stat.href}
                className={`group block border border-[var(--border-color)] p-6 transition-all duration-300 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] ${
                  'accent' in stat && stat.accent
                    ? 'border-[var(--fg)]'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-[var(--muted)] group-hover:text-[var(--bg)] transition-colors"
                  />
                  <ArrowUpRight
                    size={14}
                    className="text-[var(--muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--bg)] transition-all"
                  />
                </div>
                <p className="text-3xl font-bold text-[var(--fg)] group-hover:text-[var(--bg)] transition-colors" style={{ fontFamily: 'var(--font-h)' }}>
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[var(--bg)] mt-1 transition-colors">
                  {stat.label}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Homework */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-bold text-[var(--fg)]"
            style={{ fontFamily: 'var(--font-h)' }}
          >
            Останні домашні завдання
          </h2>
          <Link
            href="/admin/homework"
            className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            Усі →
          </Link>
        </div>

        <div className="border border-[var(--border-color)] divide-y divide-[var(--border-color)]">
          {recentHomework.map((item) => {
            const statusMap: Record<string, { label: string; style: string }> = {
              pending: {
                label: 'Очікує',
                style: 'text-yellow-500 border-yellow-500/30',
              },
              approved: {
                label: 'Прийнято',
                style: 'text-green-500 border-green-500/30',
              },
              rejected: {
                label: 'Доопрацювати',
                style: 'text-red-400 border-red-400/30',
              },
            };
            const st = statusMap[item.submission.status] ?? statusMap.pending;

            return (
              <div
                key={item.submission.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--fg)]/[0.03] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {item.student.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--fg)] font-medium truncate">
                    {item.student.full_name}
                  </p>
                  <p className="text-xs text-[var(--muted)] truncate">
                    {item.lesson_title} · {item.course_title}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] text-[var(--muted)] flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(item.submission.submitted_at).toLocaleDateString(
                      'uk-UA',
                      { day: 'numeric', month: 'short' }
                    )}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${st.style}`}
                  >
                    {st.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Student Progress Overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-bold text-[var(--fg)]"
            style={{ fontFamily: 'var(--font-h)' }}
          >
            Прогрес студентів
          </h2>
          <Link
            href="/admin/students"
            className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          >
            Усі →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminStudents.map((student, i) => (
            <motion.div
              key={student.user.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="border border-[var(--border-color)] p-5 hover:border-[var(--fg)] transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-sm font-bold">
                  {student.user.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--fg)]">
                    {student.user.full_name}
                  </p>
                  <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
                    {student.enrollments.length} курс(ів)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {student.enrollments.map((enr) => (
                  <div key={enr.course_id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-[var(--muted)] truncate max-w-[70%]">
                        {enr.course_title}
                      </p>
                      <span className="text-xs text-[var(--fg)] font-mono">
                        {enr.progress.percentage}%
                      </span>
                    </div>
                    <div className="h-1 bg-[var(--border-color)] overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--fg)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${enr.progress.percentage}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
