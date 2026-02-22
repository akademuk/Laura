'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowUpRight, Play, FileText, Headphones } from 'lucide-react';

/* ─────────────────── Data ─────────────────── */
interface Format {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
}

const formats: Format[] = [
  {
    num: '01',
    title: 'Відеокурси',
    subtitle: 'Глибоке занурення',
    description:
      'Операційний менеджмент, маркетинг та побудова воронок — у структурованих відеомодулях із практичними завданнями.',
    icon: <Play size={20} strokeWidth={2} />,
    tags: ['8+ годин', 'Сертифікат', 'Lifetime доступ'],
  },
  {
    num: '02',
    title: 'Готові системи',
    subtitle: 'Бери та впроваджуй',
    description:
      'Книга продажів на 86 сторінок, шаблони відділу продажів, регламенти, ТЗ для підрядників — все, що потрібно для запуску.',
    icon: <FileText size={20} strokeWidth={2} />,
    tags: ['86 стор.', 'Шаблони', 'Регламенти'],
  },
  {
    num: '03',
    title: 'Подкасти',
    subtitle: 'Реальні кейси',
    description:
      'Інтерв\'ю з власниками бізнесу, розбори реальних кейсів масштабування та побудови команд.',
    icon: <Headphones size={20} strokeWidth={2} />,
    tags: ['Щотижня', 'Гості', 'Кейси'],
  },
];

/* ─────────────────── Single Row ─────────────────── */
function FormatRow({ format, index }: { format: Format; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-pointer"
    >
      {/* Top border with animated reveal */}
      <div className="relative h-px w-full bg-[var(--border-color)] overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{
            duration: 1,
            delay: index * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0 bg-[var(--fg)] opacity-[0.15] origin-left"
        />
      </div>

      {/* ── Content Row ── */}
      <div className="relative py-10 md:py-14 lg:py-16 overflow-hidden">
        {/* Hover background fill */}
        <motion.div
          initial={false}
          animate={{
            scaleX: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-[var(--fg)] origin-left"
        />

        {/* Row Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_auto] gap-4 md:gap-8 items-center px-4 md:px-8">
          {/* Number */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            className={`
              text-sm font-[var(--font-b)] font-medium tracking-[0.3em] uppercase
              transition-colors duration-500
              ${hovered ? 'text-[var(--bg)]' : 'text-[var(--muted)]'}
            `}
          >
            {format.num}
          </motion.span>

          {/* Title + subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15 + 0.25 }}
            className="flex items-baseline gap-4"
          >
            <h3
              className={`
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold tracking-tight leading-none
                transition-all duration-500
                ${hovered ? 'text-[var(--bg)] translate-x-2' : 'text-[var(--fg)]'}
              `}
            >
              {format.title}
            </h3>
            <span
              className={`
                hidden lg:inline text-sm italic font-light
                transition-colors duration-500
                ${hovered ? 'text-[var(--bg)] opacity-60' : 'text-[var(--muted)]'}
              `}
            >
              — {format.subtitle}
            </span>
          </motion.div>

          {/* Description — visible on hover (desktop), always visible (mobile) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
            className={`
              text-sm leading-relaxed max-w-md
              transition-all duration-500
              md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0
              ${hovered ? 'text-[var(--bg)] opacity-70' : 'text-[var(--muted)]'}
            `}
          >
            {format.description}
          </motion.p>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
            className={`
              hidden md:flex w-12 h-12 items-center justify-center border rounded-full
              transition-all duration-500 ml-auto
              ${
                hovered
                  ? 'border-[var(--bg)] text-[var(--bg)] rotate-45 scale-110'
                  : 'border-[var(--border-color)] text-[var(--muted)] rotate-0 scale-100'
              }
            `}
          >
            <ArrowUpRight size={18} />
          </motion.div>
        </div>

        {/* Tags — slide in on hover */}
        <div
          className={`
            relative z-10 flex gap-3 px-4 md:px-8 md:pl-[112px] mt-4 md:mt-0
            transition-all duration-500
            md:max-h-0 md:opacity-0 md:group-hover:max-h-16 md:group-hover:opacity-100 md:group-hover:mt-4
          `}
        >
          {format.tags.map((tag) => (
            <span
              key={tag}
              className={`
                text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border font-medium
                transition-colors duration-500
                ${
                  hovered
                    ? 'border-[var(--bg)] text-[var(--bg)] opacity-50'
                    : 'border-[var(--border-color)] text-[var(--muted)]'
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export default function Products() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-40 bg-[var(--bg)]"
      aria-label="Формати навчання"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-xs md:text-sm uppercase tracking-[0.5em] text-[var(--muted)] mb-6 font-medium"
            >
              Формати
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.05]"
            >
              Три формати —<br />
              <span className="italic font-normal text-[var(--muted)]">
                один результат
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-[var(--muted)] max-w-xs leading-relaxed md:text-right"
          >
            Кожен формат — самодостатній інструмент.
            Разом — повна система масштабування.
          </motion.p>
        </div>

        {/* Format Rows */}
        <div>
          {formats.map((format, i) => (
            <FormatRow key={format.num} format={format} index={i} />
          ))}
          {/* Closing border */}
          <div className="h-px w-full bg-[var(--border-color)]" />
        </div>
      </div>
    </section>
  );
}
