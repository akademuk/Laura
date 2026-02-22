'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
  {
    name: 'Олександр К.',
    text: 'Це не просто курс, це повне перезавантаження мозку. Я нарешті зрозумів, як працює сучасний маркетинг.',
  },
  {
    name: 'Ірина М.',
    text: 'Неймовірний дизайн платформи, круті ментори та спільнота, яка надихає.',
  },
  {
    name: 'Дмитро В.',
    text: 'Практичні завдання допомогли мені знайти перших клієнтів ще під час навчання.',
  },
];

export default function Testimonials() {
  const container = useRef<HTMLElement>(null);
  const isInView = useInView(container, { once: true, margin: '-80px' });

  return (
    <section
      ref={container}
      className="relative py-24 md:py-36 bg-[var(--bg)] border-y border-[var(--border-color)]"
      aria-label="Відгуки студентів"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl lg:text-6xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.1] mb-16 md:mb-20 text-center"
        >
          Відгуки <span className="text-[var(--muted)] italic">студентів</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="border border-[var(--border-color)] p-8 hover:border-[var(--fg)] transition-colors duration-300"
            >
              <p className="text-base md:text-lg text-[var(--muted)] mb-8 font-light italic leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-sm font-bold">
                  {t.name[0]}
                </div>
                <span className="text-sm font-medium text-[var(--fg)] uppercase tracking-wider">
                  {t.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
