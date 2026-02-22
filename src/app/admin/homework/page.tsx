'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Send,
  Check,
  X,
  Clock,
  FileText,
  ExternalLink,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { useLmsStore } from '@/stores/lms-store';
import { HomeworkStatus } from '@/types/lms';
import type { HomeworkFeedItem, HomeworkReviewData } from '@/types/lms';

const STATUS_CONF: Record<
  string,
  { label: string; style: string; dotColor: string }
> = {
  [HomeworkStatus.Pending]: {
    label: 'Очікує',
    style: 'text-yellow-500 border-yellow-500/30',
    dotColor: 'bg-yellow-500',
  },
  [HomeworkStatus.Approved]: {
    label: 'Прийнято',
    style: 'text-green-500 border-green-500/30',
    dotColor: 'bg-green-500',
  },
  [HomeworkStatus.Rejected]: {
    label: 'Доопрацювати',
    style: 'text-red-400 border-red-400/30',
    dotColor: 'bg-red-400',
  },
};

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'Усі' },
  { key: 'pending', label: 'Очікує' },
  { key: 'approved', label: 'Прийнято' },
  { key: 'rejected', label: 'Доопрацювати' },
];

function HomeworkCard({ item }: { item: HomeworkFeedItem }) {
  const { reviewHomework } = useLmsStore();
  const [expanded, setExpanded] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [comment, setComment] = useState('');

  const st = STATUS_CONF[item.submission.status] ?? STATUS_CONF.pending;
  const isPending = item.submission.status === HomeworkStatus.Pending;

  const handleReview = (status: HomeworkStatus.Approved | HomeworkStatus.Rejected) => {
    if (!comment.trim()) return;
    reviewHomework(item.submission.id, { comment, status });
    setReviewMode(false);
    setComment('');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[var(--border-color)] hover:border-[var(--fg)]/30 transition-colors"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-sm font-bold">
            {item.student.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          {isPending && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-yellow-500 border-2 border-[var(--bg)]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--fg)]">
            {item.student.full_name}
          </p>
          <p className="text-xs text-[var(--muted)] truncate">
            {item.lesson_title}
          </p>
          <p className="text-[10px] text-[var(--muted)] truncate mt-0.5">
            {item.course_title}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:flex text-[10px] text-[var(--muted)] items-center gap-1">
            <Clock size={10} />
            {new Date(item.submission.submitted_at).toLocaleDateString('uk-UA', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${st.style}`}
          >
            {st.label}
          </span>
          <ChevronDown
            size={14}
            className={`text-[var(--muted)] transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Submission Content */}
              <div className="border-t border-[var(--border-color)] pt-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-2 flex items-center gap-1.5">
                  <FileText size={10} /> Відповідь студента
                </p>
                <p className="text-sm text-[var(--fg)] leading-relaxed whitespace-pre-wrap">
                  {item.submission.content}
                </p>
                {item.submission.attachment_url && (
                  <a
                    href={item.submission.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors border-b border-[var(--border-color)] pb-0.5"
                  >
                    <ExternalLink size={10} />
                    Прикріплений файл
                  </a>
                )}
              </div>

              {/* Past Reviews */}
              {item.reviews.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-1.5">
                    <MessageSquare size={10} /> Рецензії
                  </p>
                  {item.reviews.map((review) => {
                    const revSt = STATUS_CONF[review.status] ?? STATUS_CONF.pending;
                    return (
                      <div
                        key={review.id}
                        className="border-l-2 border-[var(--border-color)] pl-4 py-2"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-[var(--fg)] font-medium">
                            {review.reviewer?.full_name ?? 'Куратор'}
                          </span>
                          <span
                            className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${revSt.style}`}
                          >
                            {revSt.label}
                          </span>
                          <span className="text-[10px] text-[var(--muted)]">
                            {new Date(review.created_at).toLocaleDateString(
                              'uk-UA',
                              { day: 'numeric', month: 'short' }
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Review Form */}
              {isPending && !reviewMode && (
                <button
                  onClick={() => setReviewMode(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-[var(--fg)] text-xs uppercase tracking-[0.2em] text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors"
                >
                  <MessageSquare size={12} />
                  Залишити рецензію
                </button>
              )}

              <AnimatePresence>
                {reviewMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-[var(--border-color)] p-4 space-y-3">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Коментар до роботи..."
                        rows={3}
                        className="w-full bg-transparent text-sm text-[var(--fg)] placeholder:text-[var(--muted)] border border-[var(--border-color)] px-3 py-2.5 focus:border-[var(--fg)] outline-none resize-none transition-colors"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleReview(HomeworkStatus.Approved)
                          }
                          disabled={!comment.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                        >
                          <Check size={12} /> Прийняти
                        </button>
                        <button
                          onClick={() =>
                            handleReview(HomeworkStatus.Rejected)
                          }
                          disabled={!comment.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider border border-red-400/30 text-red-400 hover:bg-red-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                        >
                          <X size={12} /> Доопрацювати
                        </button>
                        <button
                          onClick={() => {
                            setReviewMode(false);
                            setComment('');
                          }}
                          className="ml-auto text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
                        >
                          Скасувати
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminHomeworkPage() {
  const { homeworkFeed, loadHomeworkFeed, isLoading } = useLmsStore();
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    loadHomeworkFeed();
  }, [loadHomeworkFeed]);

  const filtered = useMemo(() => {
    if (filter === 'all') return homeworkFeed;
    return homeworkFeed.filter((h) => h.submission.status === filter);
  }, [homeworkFeed, filter]);

  const counts = useMemo(
    () => ({
      all: homeworkFeed.length,
      pending: homeworkFeed.filter(
        (h) => h.submission.status === HomeworkStatus.Pending
      ).length,
      approved: homeworkFeed.filter(
        (h) => h.submission.status === HomeworkStatus.Approved
      ).length,
      rejected: homeworkFeed.filter(
        (h) => h.submission.status === HomeworkStatus.Rejected
      ).length,
    }),
    [homeworkFeed]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
          Перевірка
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[var(--fg)]"
          style={{ fontFamily: 'var(--font-h)' }}
        >
          Домашні завдання
        </h1>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 border-b border-[var(--border-color)]"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`relative px-4 py-3 text-xs uppercase tracking-[0.15em] transition-colors ${
              filter === tab.key
                ? 'text-[var(--fg)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] opacity-50">
              {counts[tab.key]}
            </span>
            {filter === tab.key && (
              <motion.div
                layoutId="admin-hw-filter"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--fg)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Feed */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--muted)]">Завантаження...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 border border-[var(--border-color)]">
            <p className="text-sm text-[var(--muted)]">
              Немає завдань у цій категорії
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <HomeworkCard key={item.submission.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}
