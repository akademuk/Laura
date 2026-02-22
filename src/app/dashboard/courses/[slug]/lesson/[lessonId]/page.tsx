'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Send,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Play,
  AlertCircle,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { HomeworkStatus, LessonStatus } from '@/types/lms';
import type { Attachment } from '@/types/lms';
import DOMPurify from 'dompurify';

/* ─── Helpers ─── */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const fileIcons: Record<string, string> = {
  pdf: '📄',
  xlsx: '📊',
  docx: '📝',
  pptx: '📑',
  zip: '📦',
  image: '🖼',
  other: '📎',
};

/* ─── Video Player ─── */
function VideoPlayer({ url, provider }: { url: string | null; provider: string | null }) {
  if (!url) {
    return (
      <div className="w-full aspect-video bg-[var(--secondary)] flex items-center justify-center">
        <div className="text-center">
          <Play size={40} className="text-[var(--muted)] opacity-30 mx-auto mb-3" />
          <p className="text-sm text-[var(--muted)]">Відео буде доступне незабаром</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black relative group">
      <iframe
        src={url}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Відео уроку"
        loading="lazy"
      />
    </div>
  );
}

/* ─── Tab: Summary ─── */
function TabSummary({ html }: { html: string | null }) {
  if (!html) {
    return (
      <div className="py-12 text-center">
        <FileText size={28} className="text-[var(--muted)] opacity-30 mx-auto mb-3" />
        <p className="text-sm text-[var(--muted)]">Конспект поки не додано</p>
      </div>
    );
  }

  const sanitizedHtml = typeof window !== 'undefined'
    ? DOMPurify.sanitize(html, { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','ul','ol','li','strong','em','a','br','span','blockquote'], ALLOWED_ATTR: ['href','target','rel','class'] })
    : html;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="prose-invert max-w-none"
    >
      <div
        className="text-sm md:text-base text-[var(--fg)] leading-relaxed space-y-4
          [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-[var(--font-h)] [&_h2]:font-bold [&_h2]:text-[var(--fg)] [&_h2]:mb-4 [&_h2]:mt-8
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--fg)] [&_h3]:mb-3 [&_h3]:mt-6
          [&_p]:text-[var(--muted)] [&_p]:leading-relaxed [&_p]:mb-4
          [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:mb-4
          [&_li]:text-[var(--muted)] [&_li]:pl-5 [&_li]:relative [&_li]:before:content-['—'] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-[var(--fg)] [&_li]:before:opacity-30
        "
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </motion.div>
  );
}

/* ─── Tab: Materials ─── */
function TabMaterials({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) {
    return (
      <div className="py-12 text-center">
        <Download size={28} className="text-[var(--muted)] opacity-30 mx-auto mb-3" />
        <p className="text-sm text-[var(--muted)]">Додаткових матеріалів немає</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      {attachments.map((att, i) => (
        <motion.a
          key={att.id}
          href={att.file_url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center gap-4 border border-[var(--border-color)] px-5 py-4 hover:border-[var(--fg)] transition-colors duration-300"
        >
          <span className="text-lg flex-shrink-0">
            {fileIcons[att.file_type] ?? fileIcons.other}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--fg)] truncate">
              {att.title}
            </p>
            <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">
              {att.file_type.toUpperCase()} · {formatBytes(att.file_size_bytes)}
            </p>
          </div>
          <Download
            size={16}
            className="text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors flex-shrink-0"
          />
        </motion.a>
      ))}
    </motion.div>
  );
}

/* ─── Tab: Homework ─── */
function TabHomework({
  task,
  submission,
  lessonId,
}: {
  task: string | null;
  submission: ReturnType<typeof useLmsStore.getState>['activeLesson'] extends infer L
    ? L extends { homework_submission: infer S } ? S : null
    : null;
  lessonId: string;
}) {
  const { submitHomework } = useLmsStore();
  const [text, setText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!task) {
    return (
      <div className="py-12 text-center">
        <ClipboardCheck size={28} className="text-[var(--muted)] opacity-30 mx-auto mb-3" />
        <p className="text-sm text-[var(--muted)]">Цей урок не має домашнього завдання</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!text.trim()) return;
    submitHomework(lessonId, {
      content: text,
      attachment_url: linkUrl || null,
    });
    setSubmitted(true);
  };

  const statusLabels: Partial<Record<HomeworkStatus, { text: string; icon: typeof CheckCircle2 }>> = {
    [HomeworkStatus.Pending]: { text: 'Очікує перевірки', icon: Clock },
    [HomeworkStatus.Approved]: { text: 'Прийнято ✓', icon: CheckCircle2 },
    [HomeworkStatus.Rejected]: { text: 'Потребує доопрацювання', icon: AlertCircle },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Task description */}
      <div className="border-l-2 border-[var(--fg)] pl-5 mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)] mb-2">Завдання</p>
        <p className="text-sm md:text-base text-[var(--fg)] leading-relaxed">{task}</p>
      </div>

      {/* Existing submission */}
      {submission && !submitted ? (
        <div className="border border-[var(--border-color)] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              Ваша відповідь
            </span>
            {statusLabels[submission.status] && (
              <span className="flex items-center gap-1.5 text-xs text-[var(--fg)]">
                {(() => {
                  const Icon = statusLabels[submission.status]!.icon;
                  return <Icon size={13} />;
                })()}
                {statusLabels[submission.status]!.text}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
            {submission.content}
          </p>
          {submission.attachment_url && (
            <a
              href={submission.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--fg)] mt-3 hover:opacity-70 transition-opacity"
            >
              <Paperclip size={12} />
              Прикріплене посилання
            </a>
          )}
        </div>
      ) : submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-[var(--fg)] p-8 text-center"
        >
          <CheckCircle2 size={28} className="text-[var(--fg)] mx-auto mb-3" />
          <p className="text-sm text-[var(--fg)] font-medium">Домашнє завдання відправлено!</p>
          <p className="text-xs text-[var(--muted)] mt-1">Очікуйте на перевірку куратора</p>
        </motion.div>
      ) : (
        /* Submission form */
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] block mb-2">
              Ваша відповідь
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Напишіть вашу відповідь..."
              className="w-full bg-transparent border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--fg)] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] block mb-2">
              Посилання (Google Docs, Notion тощо)
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://docs.google.com/..."
              className="w-full bg-transparent border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--fg)] transition-colors"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 bg-[var(--fg)] text-[var(--bg)] px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            <Send size={14} />
            Відправити
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Lesson Navigation ─── */
function LessonNav({ courseSlug, lessonId }: { courseSlug: string; lessonId: string }) {
  const { activeCourse } = useLmsStore();
  if (!activeCourse) return null;

  const allLessons = activeCourse.modules.flatMap((m) => m.lessons);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prev = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const next = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  return (
    <div className="flex items-stretch gap-3 mt-8">
      {prev ? (
        <Link
          href={`/dashboard/courses/${courseSlug}/lesson/${prev.id}`}
          className="flex-1 group border border-[var(--border-color)] px-5 py-4 hover:border-[var(--fg)] transition-colors duration-300 flex items-center gap-3"
        >
          <ChevronLeft size={16} className="text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] mb-0.5">Попередній</p>
            <p className="text-sm text-[var(--fg)] truncate">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/dashboard/courses/${courseSlug}/lesson/${next.id}`}
          className="flex-1 group border border-[var(--border-color)] px-5 py-4 hover:border-[var(--fg)] transition-colors duration-300 flex items-center justify-end gap-3 text-right"
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] mb-0.5">Наступний</p>
            <p className="text-sm text-[var(--fg)] truncate">{next.title}</p>
          </div>
          <ChevronRight size={16} className="text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors flex-shrink-0" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}

/* ─── Tab Button ─── */
const TABS = [
  { id: 'summary' as const, label: 'Конспект', icon: FileText },
  { id: 'materials' as const, label: 'Матеріали', icon: Download },
  { id: 'homework' as const, label: 'Домашнє завдання', icon: ClipboardCheck },
];

/* ─── Main Lesson Page ─── */
export default function LessonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const lessonId = params.lessonId as string;

  const {
    activeLesson,
    activeLessonTab,
    loadLesson,
    loadCourse,
    setLessonTab,
    markLessonCompleted,
    activeCourse,
    courseCards,
    loadCourseCards,
    isLoading,
  } = useLmsStore();

  // Load data
  useEffect(() => {
    if (courseCards.length === 0) loadCourseCards();
  }, [courseCards.length, loadCourseCards]);

  useEffect(() => {
    const course = courseCards.find((c) => c.slug === slug);
    if (course && (!activeCourse || activeCourse.id !== course.id)) {
      loadCourse(course.id);
    }
  }, [slug, courseCards, activeCourse, loadCourse]);

  useEffect(() => {
    loadLesson(lessonId);
  }, [lessonId, loadLesson]);

  if (isLoading || !activeLesson) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-32 bg-[var(--border-color)] animate-pulse" />
        <div className="w-full aspect-video bg-[var(--secondary)] animate-pulse" />
        <div className="h-8 w-80 bg-[var(--border-color)] animate-pulse mt-6" />
      </div>
    );
  }

  const isCompleted = activeLesson.progress?.status === LessonStatus.Completed;

  return (
    <>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          href={`/dashboard/courses/${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Програма курсу
        </Link>
      </motion.div>

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border border-[var(--border-color)] overflow-hidden mb-8"
      >
        <VideoPlayer url={activeLesson.video_url} provider={activeLesson.video_provider} />
      </motion.div>

      {/* Title + Mark Complete */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight mb-2">
            {activeLesson.title}
          </h1>
          {activeLesson.video_duration_sec && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
              <Clock size={12} />
              {formatDuration(activeLesson.video_duration_sec)}
            </span>
          )}
        </div>

        <button
          onClick={() => !isCompleted && markLessonCompleted(lessonId)}
          disabled={isCompleted}
          className={`
            flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-medium border transition-all duration-300
            ${isCompleted
              ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] cursor-default'
              : 'border-[var(--border-color)] text-[var(--fg)] hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]'
            }
          `}
        >
          <CheckCircle2 size={14} />
          {isCompleted ? 'Завершено' : 'Позначити завершеним'}
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {/* Tab buttons */}
        <div className="flex border-b border-[var(--border-color)] mb-8">
          {TABS.map((tab) => {
            const isActive = activeLessonTab === tab.id;
            const Icon = tab.icon;
            // Show homework tab only if lesson has homework
            if (tab.id === 'homework' && !activeLesson.has_homework) return null;
            return (
              <button
                key={tab.id}
                onClick={() => setLessonTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 md:px-6 py-3 text-xs md:text-sm uppercase tracking-[0.15em] transition-colors duration-300 relative
                  ${isActive ? 'text-[var(--fg)]' : 'text-[var(--muted)] hover:text-[var(--fg)]'}
                `}
              >
                <Icon size={15} strokeWidth={1.5} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="lesson-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--fg)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeLessonTab === 'summary' && (
            <TabSummary key="summary" html={activeLesson.content_html} />
          )}
          {activeLessonTab === 'materials' && (
            <TabMaterials key="materials" attachments={activeLesson.attachments} />
          )}
          {activeLessonTab === 'homework' && (
            <TabHomework
              key="homework"
              task={activeLesson.homework_task}
              submission={activeLesson.homework_submission}
              lessonId={lessonId}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Prev / Next navigation */}
      <LessonNav courseSlug={slug} lessonId={lessonId} />
    </>
  );
}
