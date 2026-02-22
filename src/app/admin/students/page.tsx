'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  X,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { EnrollmentStatus } from '@/types/lms';
import type { AdminStudentRow } from '@/types/lms';

const STATUS_LABELS: Record<EnrollmentStatus, { label: string; style: string }> = {
  [EnrollmentStatus.Active]: {
    label: 'Активний',
    style: 'text-green-500 border-green-500/30 bg-green-500/5',
  },
  [EnrollmentStatus.Paused]: {
    label: 'Пауза',
    style: 'text-yellow-500 border-yellow-500/30 bg-yellow-500/5',
  },
  [EnrollmentStatus.Revoked]: {
    label: 'Відкликано',
    style: 'text-red-400 border-red-400/30 bg-red-400/5',
  },
  [EnrollmentStatus.Completed]: {
    label: 'Завершено',
    style: 'text-[var(--fg)] border-[var(--border-color)] bg-[var(--fg)]/5',
  },
};

function StudentRow({
  student,
  isExpanded,
  onToggle,
}: {
  student: AdminStudentRow;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { updateEnrollmentStatus } = useLmsStore();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const avgProgress = Math.round(
    student.enrollments.reduce((a, e) => a + e.progress.percentage, 0) /
      Math.max(student.enrollments.length, 1)
  );

  return (
    <div className="border-b border-[var(--border-color)] last:border-b-0">
      {/* Main Row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[var(--fg)]/[0.03] transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-sm font-bold flex-shrink-0">
          {student.user.full_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--fg)]">
            {student.user.full_name}
          </p>
          <p className="text-xs text-[var(--muted)]">
            {student.enrollments.length} курс(ів) · Прогрес {avgProgress}%
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          {student.last_login_at && (
            <span className="text-[10px] text-[var(--muted)] flex items-center gap-1">
              <Clock size={10} />
              {new Date(student.last_login_at).toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'short',
              })}
            </span>
          )}
          <div className="flex gap-1">
            {student.enrollments.map((e) => {
              const st = STATUS_LABELS[e.status];
              return (
                <span
                  key={e.course_id}
                  className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${st.style}`}
                >
                  {st.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="text-[var(--muted)]">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded Enrollments */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 pl-[4.5rem] space-y-3">
              {student.enrollments.map((enr) => {
                const st = STATUS_LABELS[enr.status];
                return (
                  <div
                    key={enr.course_id}
                    className="border border-[var(--border-color)] p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--fg)] font-medium">
                        {enr.course_title}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1 bg-[var(--border-color)] overflow-hidden max-w-[200px]">
                          <div
                            className="h-full bg-[var(--fg)] transition-all duration-500"
                            style={{ width: `${enr.progress.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--muted)] font-mono">
                          {enr.progress.completed_lessons}/{enr.progress.total_lessons} уроків · {enr.progress.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 relative">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 border ${st.style}`}
                      >
                        {st.label}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(
                            menuOpen === enr.course_id ? null : enr.course_id
                          );
                        }}
                        className="p-1 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      <AnimatePresence>
                        {menuOpen === enr.course_id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-full mt-1 z-10 border border-[var(--border-color)] bg-[var(--bg)] shadow-lg min-w-[160px]"
                          >
                            {Object.values(EnrollmentStatus).map((status) => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateEnrollmentStatus(
                                    student.user.id,
                                    enr.course_id,
                                    status
                                  );
                                  setMenuOpen(null);
                                }}
                                className={`block w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider transition-colors hover:bg-[var(--fg)]/[0.05] ${
                                  enr.status === status
                                    ? 'text-[var(--fg)] font-medium'
                                    : 'text-[var(--muted)]'
                                }`}
                              >
                                {STATUS_LABELS[status].label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminStudentsPage() {
  const { adminStudents, loadAdminStudents, isLoading } = useLmsStore();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadAdminStudents();
  }, [loadAdminStudents]);

  const filtered = useMemo(() => {
    if (!search.trim()) return adminStudents;
    const q = search.toLowerCase();
    return adminStudents.filter(
      (s) =>
        s.user.full_name.toLowerCase().includes(q) ||
        s.enrollments.some((e) => e.course_title.toLowerCase().includes(q))
    );
  }, [adminStudents, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
          Управління
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[var(--fg)]"
          style={{ fontFamily: 'var(--font-h)' }}
        >
          Студенти
        </h1>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за ім'ям або курсом..."
          className="w-full pl-11 pr-10 py-3.5 border border-[var(--border-color)] bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--fg)] outline-none transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--fg)]"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-[var(--border-color)]"
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-[var(--border-color)] bg-[var(--fg)]/[0.02]">
          <div className="w-10 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Студент
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Статус & Прогрес
            </span>
          </div>
          <div className="w-6" />
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-[var(--muted)]">
              {isLoading ? 'Завантаження...' : 'Студентів не знайдено'}
            </p>
          </div>
        ) : (
          filtered.map((student) => (
            <StudentRow
              key={student.user.id}
              student={student}
              isExpanded={expandedId === student.user.id}
              onToggle={() =>
                setExpandedId(
                  expandedId === student.user.id ? null : student.user.id
                )
              }
            />
          ))
        )}
      </motion.div>

      {/* Summary */}
      <div className="text-xs text-[var(--muted)] text-right">
        {filtered.length} з {adminStudents.length} студентів
      </div>
    </div>
  );
}
