'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit3,
  ChevronDown,
  ChevronUp,
  Layers,
  PlayCircle,
  Clock,
  Eye,
  EyeOff,
  GripVertical,
  BookOpen,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { PublishStatus } from '@/types/lms';
import {
  COURSES,
  MODULES,
  LESSONS,
} from '@/lib/mock-data';
import type { Course, Module, Lesson } from '@/types/lms';

const STATUS_BADGE: Record<PublishStatus, { label: string; style: string }> = {
  [PublishStatus.Published]: {
    label: 'Опублікований',
    style: 'text-green-500 border-green-500/30',
  },
  [PublishStatus.Draft]: {
    label: 'Чернетка',
    style: 'text-yellow-500 border-yellow-500/30',
  },
  [PublishStatus.Archived]: {
    label: 'Архів',
    style: 'text-[var(--muted)] border-[var(--border-color)]',
  },
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} хв`;
  if (m === 0) return `${h} год`;
  return `${h} год ${m} хв`;
}

function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  const st = STATUS_BADGE[lesson.status];
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--fg)]/[0.02] transition-colors group">
      <GripVertical
        size={14}
        className="text-[var(--border-color)] group-hover:text-[var(--muted)] transition-colors flex-shrink-0 cursor-grab"
      />
      <span className="text-xs text-[var(--muted)] font-mono w-6 text-right flex-shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--fg)] truncate">{lesson.title}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {lesson.video_duration_sec && (
          <span className="text-[10px] text-[var(--muted)] flex items-center gap-1">
            <PlayCircle size={10} />
            {Math.floor(lesson.video_duration_sec / 60)} хв
          </span>
        )}
        {lesson.has_homework && (
          <span className="text-[10px] text-[var(--muted)] border border-[var(--border-color)] px-1.5 py-0.5">
            ДЗ
          </span>
        )}
        <span
          className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${st.style}`}
        >
          {lesson.status === PublishStatus.Published ? (
            <Eye size={10} />
          ) : (
            <EyeOff size={10} />
          )}
        </span>
      </div>
    </div>
  );
}

function ModuleAccordion({
  module,
  lessons,
  isExpanded,
  onToggle,
}: {
  module: Module;
  lessons: Lesson[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const st = STATUS_BADGE[module.status];

  return (
    <div className="border border-[var(--border-color)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[var(--fg)]/[0.02] transition-colors text-left"
      >
        <Layers size={16} strokeWidth={1.5} className="text-[var(--muted)] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--fg)]">{module.title}</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {lessons.length} уроків
          </p>
        </div>
        <span
          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 border ${st.style}`}
        >
          {st.label}
        </span>
        {isExpanded ? (
          <ChevronUp size={14} className="text-[var(--muted)]" />
        ) : (
          <ChevronDown size={14} className="text-[var(--muted)]" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border-color)] divide-y divide-[var(--border-color)]">
              {lessons.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-[var(--muted)]">
                    Уроків ще немає
                  </p>
                </div>
              ) : (
                lessons.map((lesson, i) => (
                  <LessonRow key={lesson.id} lesson={lesson} index={i} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseCard({
  course,
  modules,
  allLessons,
}: {
  course: Course;
  modules: Module[];
  allLessons: Lesson[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const st = STATUS_BADGE[course.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[var(--border-color)] hover:border-[var(--fg)]/30 transition-colors"
    >
      {/* Course Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-4 px-6 py-5 text-left"
      >
        <div className="w-12 h-12 border border-[var(--border-color)] flex items-center justify-center flex-shrink-0">
          <BookOpen size={20} strokeWidth={1.5} className="text-[var(--muted)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className="text-lg font-bold text-[var(--fg)] leading-tight"
                style={{ fontFamily: 'var(--font-h)' }}
              >
                {course.title}
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                {course.short_description}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mt-1">
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${st.style}`}
              >
                {st.label}
              </span>
              {expanded ? (
                <ChevronUp size={16} className="text-[var(--muted)]" />
              ) : (
                <ChevronDown size={16} className="text-[var(--muted)]" />
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3">
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Layers size={10} /> {modules.length} модулів
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <PlayCircle size={10} /> {course.total_lessons} уроків
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Clock size={10} /> {formatDuration(course.estimated_duration_min)}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded: Modules */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-2">
              <div className="border-t border-[var(--border-color)] pt-4 mb-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Структура курсу
                </p>
              </div>
              {modules.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[var(--border-color)]">
                  <p className="text-xs text-[var(--muted)]">
                    Модулів ще немає
                  </p>
                </div>
              ) : (
                modules.map((mod) => {
                  const modLessons = allLessons
                    .filter((l) => l.module_id === mod.id)
                    .sort((a, b) => a.sort_order - b.sort_order);
                  return (
                    <ModuleAccordion
                      key={mod.id}
                      module={mod}
                      lessons={modLessons}
                      isExpanded={expandedModuleId === mod.id}
                      onToggle={() =>
                        setExpandedModuleId(
                          expandedModuleId === mod.id ? null : mod.id
                        )
                      }
                    />
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminCoursesPage() {
  const allCourses = COURSES;
  const allModules = MODULES;
  const allLessons = LESSONS;

  const publishedCount = allCourses.filter(
    (c) => c.status === PublishStatus.Published
  ).length;
  const draftCount = allCourses.filter(
    (c) => c.status === PublishStatus.Draft
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
            Контент
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--fg)]"
            style={{ fontFamily: 'var(--font-h)' }}
          >
            Курси
          </h1>
        </div>
        <button
          disabled
          title="Буде доступно після підключення Supabase"
          className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border-color)] text-xs uppercase tracking-[0.2em] text-[var(--muted)] cursor-not-allowed opacity-50"
        >
          <Plus size={14} /> Новий курс
        </button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-6 border-b border-[var(--border-color)] pb-4"
      >
        <span className="text-xs text-[var(--muted)]">
          Всього:{' '}
          <span className="text-[var(--fg)] font-medium">{allCourses.length}</span>
        </span>
        <span className="text-xs text-[var(--muted)]">
          Опублікованих:{' '}
          <span className="text-green-500 font-medium">{publishedCount}</span>
        </span>
        <span className="text-xs text-[var(--muted)]">
          Чернеток:{' '}
          <span className="text-yellow-500 font-medium">{draftCount}</span>
        </span>
        <span className="text-xs text-[var(--muted)]">
          Модулів:{' '}
          <span className="text-[var(--fg)] font-medium">{allModules.length}</span>
        </span>
        <span className="text-xs text-[var(--muted)]">
          Уроків:{' '}
          <span className="text-[var(--fg)] font-medium">{allLessons.length}</span>
        </span>
      </motion.div>

      {/* Course List */}
      <div className="space-y-4">
        {allCourses.map((course) => {
          const courseModules = allModules
            .filter((m) => m.course_id === course.id)
            .sort((a, b) => a.sort_order - b.sort_order);
          return (
            <CourseCard
              key={course.id}
              course={course}
              modules={courseModules}
              allLessons={allLessons}
            />
          );
        })}
      </div>
    </div>
  );
}
