'use client';

import { motion } from 'framer-motion';

export default function Philosophy() {
  return (
    <section
      className="relative py-24 md:py-36 bg-[var(--secondary,#141414)] overflow-hidden"
      aria-label="Філософія підходу"
    >
      {/* Giant decorative quote marks */}
      <div className="absolute top-8 left-4 md:left-12 text-[12rem] md:text-[20rem] font-[var(--font-h)] text-[var(--fg)] opacity-[0.02] leading-none select-none pointer-events-none">
        &ldquo;
      </div>
      <div className="absolute bottom-8 right-4 md:right-12 text-[12rem] md:text-[20rem] font-[var(--font-h)] text-[var(--fg)] opacity-[0.02] leading-none select-none pointer-events-none rotate-180">
        &ldquo;
      </div>

      {/* Side decorative lines */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[var(--fg)] to-transparent opacity-10 hidden md:block" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[var(--fg)] to-transparent opacity-10 hidden md:block" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm md:text-base uppercase tracking-[0.3em] text-[var(--muted)] mb-10 md:mb-14"
        >
          Моя філософія
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.1] mb-10 md:mb-14"
        >
          Фокус на{' '}
          <span className="italic">результаті</span>, а не
          на процесі
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-20 h-px bg-[var(--fg)] mx-auto mb-10 md:mb-14 opacity-20 origin-center"
        />

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg lg:text-xl text-[var(--muted,#888)] leading-relaxed max-w-3xl mx-auto font-light"
        >
          Я формую прозору командну культуру та створюю моделі, які
          масштабуються. Моя сила — це швидкі та обґрунтовані рішення,
          емоційний інтелект та здатність утримувати великий обсяг задач без
          хаосу.
        </motion.p>
      </div>
    </section>
  );
}
