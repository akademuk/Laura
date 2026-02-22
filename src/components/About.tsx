'use client';

import { motion } from 'framer-motion';
/* ─── Premium thin-line SVG icons ─── */
const iconProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const PremiumBriefcase = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12.01" /></svg>
);
const PremiumRefresh = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...p}><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>
);
const PremiumUsers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...p}><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><circle cx="19" cy="7" r="3" /><path d="M21 21v-1.5a3 3 0 0 0-2-2.83" /></svg>
);
const PremiumBook = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="13" y2="11" /></svg>
);
const PremiumHandshake = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...p}><path d="m11 17 2 2a1 1 0 0 0 1.41 0l3.3-3.29a1 1 0 0 0 0-1.42L14 11" /><path d="m3 7 3-3 5.5 5.5" /><path d="m21 7-3-3-5.5 5.5" /><path d="m8 13-3 3" /><path d="m14 7-1.5 1.5" /></svg>
);
const PremiumLayers = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...p}><path d="m12 2 10 6.5v7L12 22 2 15.5v-7L12 2Z" /><path d="M12 22V15.5" /><path d="m22 8.5-10 7-10-7" /><path d="m2 15.5 10-7 10 7" /></svg>
);

/* ─── Card Data ─── */
const cards = [
  {
    icon: PremiumBriefcase,
    label: 'Досвід',
    title: '5 років у маркетингу',
    text: 'Від створення власного бізнесу до позиції CMO з управлінням стратегічними партнерствами у Boss Auto.',
  },
  {
    icon: PremiumRefresh,
    label: 'Операційна трансформація',
    title: 'Перезапуск процесів',
    text: 'Реструктуризація оргструктур та впровадження data-driven підходу в операційне управління.',
  },
  {
    icon: PremiumUsers,
    label: 'Рекрутинг-масштаб',
    title: '500+ кандидатів',
    text: 'Масштабування команд через систематичний рекрутинг та побудову HR-процесів.',
  },
  {
    icon: PremiumBook,
    label: 'Методологія',
    title: 'Системний підхід',
    text: 'Книга продажів на 86 сторінок, 12-крокові воронки та чіткі регламенти роботи.',
  },
  {
    icon: PremiumHandshake,
    label: 'Партнерства',
    title: 'Стратегічні альянси',
    text: 'OKKO, Fishka, Bank Alliance, ФК «Рух» — досвід роботи з великими брендами.',
  },
  {
    icon: PremiumLayers,
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
      <div className="w-12 h-12 rounded-xl border border-[var(--fg)]/[0.08] flex items-center justify-center mb-5 group-hover:border-[var(--fg)]/[0.2] transition-all duration-500">
        <Icon className="text-[var(--fg)] opacity-40 group-hover:opacity-75 transition-opacity duration-500" />
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
