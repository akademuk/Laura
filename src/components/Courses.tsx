'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CourseItem {
  number: string;
  title: string;
  description: string;
}

const courses: CourseItem[] = [
  {
    number: '01',
    title: 'Архітектура Відділу Продажів',
    description:
      'Побудова команди, яка робить X2. Від групового найму та онбордингу до впровадження скриптів та «Книги продажів» як основи масштабування.',
  },
  {
    number: '02',
    title: 'Системоутворюючий Маркетинг',
    description:
      'Перетворення хаосу в трафіку на прогнозовану систему лідогенерації. Розробка архітектури лендингів, налаштування CRM-логіки та мультиканальних воронок.',
  },
  {
    number: '03',
    title: 'Стратегічне Управління Бізнесом',
    description:
      'Операційний менеджмент без вигорання. Вибудова міждепартаментної взаємодії, управління підрядниками та масштабування на рівні стратегічних партнерств.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

export default function Courses() {
  return (
    <section
      id="courses"
      className="relative py-24 md:py-36 bg-[var(--bg)]"
      aria-label="Флагманські освітні програми"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base uppercase tracking-[0.3em] text-[var(--muted)] mb-6"
          >
            Флагманські програми
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.1] max-w-2xl"
          >
            Освітні програми, побудовані на{' '}
            <span className="italic text-[var(--muted)]">реальному досвіді</span>
          </motion.h2>
        </div>

        {/* Courses Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {courses.map((course) => (
            <motion.article
              key={course.number}
              variants={cardVariants}
              className="group relative bg-[var(--card-bg)] border border-[var(--card-border)] p-8 md:p-10 flex flex-col justify-between min-h-[400px] md:min-h-[460px] transition-all duration-700 hover:border-[var(--fg)] cursor-pointer"
            >
              {/* Program number */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] font-medium">
                    Програма
                  </span>
                  <span className="text-5xl md:text-6xl font-[var(--font-h)] font-bold text-[var(--fg)] opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    {course.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-[var(--font-h)] font-bold text-[var(--fg)] mb-6 leading-[1.15] group-hover:translate-x-1 transition-transform duration-500">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* CTA Link */}
              <div className="mt-8 pt-6 border-t border-[var(--border-color)] group-hover:border-[var(--fg)] transition-colors duration-500">
                <a
                  href="#"
                  className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.15em] text-[var(--fg)] font-medium group/link"
                  aria-label={`Детальніше про програму: ${course.title}`}
                >
                  <span>Детальніше про програму</span>
                  <ArrowRight
                    size={16}
                    className="transform group-hover/link:translate-x-1 transition-transform duration-300"
                  />
                </a>
              </div>

              {/* Corner accent on hover */}
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-[var(--fg)] border-l-[40px] border-l-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
