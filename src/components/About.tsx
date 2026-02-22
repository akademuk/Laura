'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  RefreshCw,
  Users,
  BookOpen,
  Handshake,
  Layers,
} from 'lucide-react';

/* ─── Card Data ─── */
const cards = [
  {
    icon: Briefcase,
    label: 'Досвід',
    title: '5 років у маркетингу',
    text: 'Від створення власного бізнесу до позиції CMO з управлінням стратегічними партнерствами у Boss Auto.',
  },
  {
    icon: RefreshCw,
    label: 'Операційна трансформація',
    title: 'Перезапуск процесів',
    text: 'Реструктуризація оргструктур та впровадження data-driven підходу в операційне управління.',
  },
  {
    icon: Users,
    label: 'Рекрутинг-масштаб',
    title: '500+ кандидатів',
    text: 'Масштабування команд через систематичний рекрутинг та побудову HR-процесів.',
  },
  {
    icon: BookOpen,
    label: 'Методологія',
    title: 'Системний підхід',
    text: 'Книга продажів на 86 сторінок, 12-крокові воронки та чіткі регламенти роботи.',
  },
  {
    icon: Handshake,
    label: 'Партнерства',
    title: 'Стратегічні альянси',
    text: 'OKKO, Fishka, Bank Alliance, ФК «Рух» — досвід роботи з великими брендами.',
  },
  {
    icon: Layers,
    label: 'Діапазон',
    title: 'Від техніки до стратегії',
    text: 'Webhooks, API-інтеграції → стратегічне планування та управління бюджетами.',
  },
];

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cellVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

/* ─── Glass Card ─── */
function GlassCard({
  icon: Icon,
  label,
  title,
  text,
  className = '',
}: (typeof cards)[number] & { className?: string }) {
  return (
    <motion.div
      variants={cellVariants}
      className={`group relative p-6 md:p-7 rounded-2xl border border-[var(--fg)]/[0.06] bg-[var(--fg)]/[0.02] backdrop-blur-sm hover:border-[var(--fg)]/[0.12] hover:bg-[var(--fg)]/[0.04] transition-all duration-500 ${className}`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-[var(--fg)]/[0.05] flex items-center justify-center mb-4 group-hover:bg-[var(--fg)]/[0.08] transition-colors">
        <Icon size={18} className="text-[var(--fg)] opacity-50 group-hover:opacity-80 transition-opacity" />
      </div>

      {/* Label */}
      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)] mb-2 font-medium">
        {label}
      </p>

      {/* Title */}
      <h3 className="text-base md:text-lg font-[var(--font-h)] font-semibold text-[var(--fg)] mb-2 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-[var(--muted)] leading-relaxed font-light">
        {text}
      </p>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-36 bg-[var(--bg)] overflow-hidden"
      aria-label="Архітектор Системи"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <p className="text-sm md:text-base uppercase tracking-[0.3em] text-[var(--muted)] mb-6 font-[var(--font-b)]">
            Архітектор Системи
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.1] max-w-2xl">
            Лаура{' '}
            <span className="text-[var(--muted)] italic">Александровська</span>
          </h2>
        </motion.div>

        {/* ── Bento Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Photo cell — spans 2 rows on left */}
          <motion.div
            variants={cellVariants}
            className="md:row-span-2 relative min-h-[320px] md:min-h-0 rounded-2xl overflow-hidden border border-[var(--fg)]/[0.06]"
          >
            <div className="absolute inset-0 bg-[var(--secondary,#141414)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-28 h-28 mx-auto mb-5 rounded-full border border-[var(--fg)] opacity-15 flex items-center justify-center">
                  <span className="text-5xl text-[var(--fg)] opacity-25 font-[var(--font-h)]">
                    L
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-[0.3em]">
                  Фото Лаури
                </p>
              </div>
            </div>
            {/* Corner accent */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] opacity-50">
                CMO
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] opacity-50">
                Marketing Systems Architect
              </span>
            </div>
          </motion.div>

          {/* Card 1 — wide, spans 2 cols */}
          <GlassCard {...cards[0]} className="md:col-span-2" />

          {/* Cards 2-3 */}
          <GlassCard {...cards[1]} />
          <GlassCard {...cards[2]} />

          {/* Cards 4-5-6 — full-width row */}
          <GlassCard {...cards[3]} />
          <GlassCard {...cards[4]} />
          <GlassCard {...cards[5]} />
        </motion.div>

        {/* Bottom roles line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)] mt-12 md:mt-16"
        >
          <span>CEO</span>
          <span className="text-[var(--fg)] opacity-20">·</span>
          <span>Head of Marketing</span>
          <span className="text-[var(--fg)] opacity-20">·</span>
          <span>Business Development Lead</span>
        </motion.div>
      </div>
    </section>
  );
}
