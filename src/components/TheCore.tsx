'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, GraduationCap, Target, TrendingUp } from 'lucide-react';

const highlights = [
  { icon: GraduationCap, value: '85', label: 'навчальних матеріалів' },
  { icon: TrendingUp, value: '4', label: 'місяці інтенсиву' },
  { icon: Target, value: '5', label: 'років університету — замінено' },
];

export default function TheCore() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      id="the-core"
      className="relative py-28 md:py-40 bg-[var(--bg)] overflow-hidden"
      aria-label="Про курс — The Core"
    >
      {/* Giant watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="text-[16rem] md:text-[24rem] lg:text-[32rem] font-[var(--font-h)] font-bold text-[var(--fg)] opacity-[0.015] leading-none tracking-tighter">
          HUB
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <Zap size={16} className="text-[var(--muted)]" />
          <span className="text-xs md:text-sm uppercase tracking-[0.5em] text-[var(--muted)] font-medium">
            The Core
          </span>
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.05] mb-8">
              Не просто курс —{' '}
              <span className="italic font-normal text-[var(--muted)]">
                трансформація
              </span>
            </h2>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px bg-[var(--border-color)] border border-[var(--border-color)]">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="bg-[var(--bg)] px-4 py-5 md:px-6 md:py-6 text-center"
                  >
                    <Icon
                      size={18}
                      className="mx-auto text-[var(--muted)] mb-3 opacity-40"
                    />
                    <p className="text-2xl md:text-3xl font-[var(--font-h)] font-bold text-[var(--fg)]">
                      {item.value}
                    </p>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] text-[var(--muted)] mt-1">
                      {item.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col justify-center"
          >
            <p className="text-base md:text-lg lg:text-xl text-[var(--muted)] leading-relaxed mb-8 font-light">
              <strong className="text-[var(--fg)] font-semibold">
                85 навчальних матеріалів.
              </strong>{' '}
              4 місяці інтенсиву, що замінюють 5 років університету. Ви не
              просто вивчаєте інструменти — ви опановуєте роль Marketing
              Director.
            </p>
            <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed mb-10 font-light">
              Це синтез стратегічного мислення, операційного контролю та
              лідерства, що трансформує хаос у прибуток.
            </p>

            {/* Glassmorphism accent card */}
            <div className="p-6 md:p-8 border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] mb-3">
                Результат
              </p>
              <p className="text-lg md:text-xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-snug">
                Ви виходите не з дипломом, а з готовою системою, яка генерує
                прибуток з першого дня.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
