'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

/* ─────────────────── Data ─────────────────── */
interface Stat {
  number: string;
  numericPart?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
}

const stats: Stat[] = [
  {
    number: '$60,000+',
    numericPart: 60000,
    prefix: '$',
    suffix: '+',
    label: 'Рекламний бюджет',
    detail: 'Керований рекламний бюджет у digital-каналах',
  },
  {
    number: '500+',
    numericPart: 500,
    suffix: '+',
    label: 'Кандидатів',
    detail: 'Проведено через груповий найм та онбординг',
  },
  {
    number: 'Топ-партнерства',
    label: 'Стратегічні клієнти',
    detail: 'OKKO, Fishka, Bank, ФК Рух',
  },
  {
    number: '12-крокові',
    numericPart: 12,
    suffix: '-крокові',
    label: 'Воронки продажів',
    detail: 'Створення відділів продажів з нуля',
  },
];

/* ─────────────────── Animated Counter ─────────────────── */
function AnimatedCounter({
  target,
  prefix = '',
  suffix = '',
  fallback,
  inView,
}: {
  target?: number;
  prefix?: string;
  suffix?: string;
  fallback: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || target === undefined) return;
    const duration = 2000;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  if (target === undefined) return <>{fallback}</>;

  const formatted = count.toLocaleString('en-US');
  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

/* ─────────────────── Single Stat Row ─────────────────── */
function StatRow({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group"
    >
      {/* Horizontal line */}
      <div className="relative h-px w-full bg-[var(--border-color)] overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{
            duration: 1.2,
            delay: index * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0 bg-[var(--fg)] opacity-20 origin-left"
        />
      </div>

      {/* Row content — stacked vertically: number → label → detail */}
      <div className="flex flex-col py-10 md:py-14">
        {/* Giant number */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
          animate={
            isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}
          }
          transition={{
            duration: 0.9,
            delay: index * 0.15 + 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-[var(--font-h)] font-bold text-[var(--fg)] tracking-tighter leading-none text-shimmer">
            <AnimatedCounter
              target={stat.numericPart}
              prefix={stat.prefix}
              suffix={stat.suffix}
              fallback={stat.number}
              inView={isInView}
            />
          </span>
        </motion.div>

        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: index * 0.15 + 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-base md:text-lg uppercase tracking-[0.25em] text-[var(--fg)] font-medium mt-5 md:mt-6"
        >
          {stat.label}
        </motion.span>

        {/* Detail */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: index * 0.15 + 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-md mt-2"
        >
          {stat.detail}
        </motion.span>
      </div>
    </motion.div>
  );
}

/* ─────────────────── Main Component ─────────────────── */
export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-36 bg-[var(--bg)] overflow-hidden"
      aria-label="Ключові досягнення"
    >
      {/* ── Giant watermark in background ── */}
      <motion.div
        style={{ y: watermarkY }}
        className="absolute -right-8 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        <span className="text-[20rem] md:text-[28rem] lg:text-[36rem] font-[var(--font-h)] font-bold text-[var(--fg)] opacity-[0.015] leading-none tracking-tighter">
          №
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section title */}
        <div ref={titleRef} className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6 mb-8"
          >
            <div className="h-px flex-1 bg-[var(--border-color)]" />
            <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[var(--muted)] font-medium whitespace-nowrap">
              Тверді факти
            </p>
            <div className="h-px flex-1 bg-[var(--border-color)]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.05] text-center max-w-4xl mx-auto"
          >
            Цифри, що говорять{' '}
            <span className="italic font-normal text-[var(--muted)]">самі за себе</span>
          </motion.h2>
        </div>

        {/* Stat rows */}
        <div className="space-y-0">
          {stats.map((stat, i) => (
            <StatRow key={i} stat={stat} index={i} />
          ))}
          {/* Final closing line */}
          <div className="h-px w-full bg-[var(--border-color)]" />
        </div>
      </div>
    </section>
  );
}
