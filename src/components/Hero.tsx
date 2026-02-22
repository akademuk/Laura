'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const HeroBackground3D = dynamic(() => import('./HeroBackground3D'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[var(--bg)]" />,
});

/* ─────────────────── Typewriter Hook ─────────────────── */
function useTypewriter(text: string, speed = 50, delay = 800) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const done = index >= text.length;

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(
      () => setIndex((i) => i + 1),
      speed + Math.random() * 30
    );
    return () => clearTimeout(t);
  }, [started, index, done, speed]);

  return { displayed: text.slice(0, index), done, started };
}

/* ─────────────────── Constants ─────────────────── */
const TITLE = 'Aleksandrovska Hub';
const SOLID_PART = 'Aleksandrovska ';
const OUTLINE_PART = 'Hub';

export default function Hero() {
  const { displayed, done, started } = useTypewriter(TITLE, 65, 600);
  const [showAfter, setShowAfter] = useState(false);

  // Show subtitle + CTA 400ms after typing is done
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setShowAfter(true), 400);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-[var(--bg)] overflow-hidden"
      aria-label="Головний банер"
    >
      {/* ── 3D Interactive Grid Background ── */}
      <HeroBackground3D />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[var(--fg)] opacity-[0.015] blur-[120px]" />
      </div>

      {/* Vertical decorative line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-[var(--fg)] to-transparent opacity-10 origin-top"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs md:text-sm uppercase tracking-[0.5em] text-[var(--muted)] mb-10 md:mb-14 font-medium flex items-center gap-4"
        >
          <span className="inline-block w-8 h-px bg-[var(--fg)] opacity-30" />
          Освітня платформа
        </motion.p>

        {/* ── H1 with typewriter ── */}
        <div className="relative mb-8 md:mb-10">
          {/* Invisible spacer reserves full height */}
          <h1
            aria-hidden="true"
            className="invisible text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem] font-[var(--font-h)] font-bold leading-[1.05] tracking-tight select-none"
          >
            {SOLID_PART}
            <span>{OUTLINE_PART}</span>
          </h1>

          {/* Visible typed text */}
          <h1
            className="absolute inset-0 text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.5rem] font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.05] tracking-tight"
            aria-live="polite"
          >
            {displayed.length <= SOLID_PART.length ? (
              displayed
            ) : (
              <>
                {SOLID_PART}
                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: '1.5px var(--fg)',
                  }}
                >
                  {displayed.slice(SOLID_PART.length)}
                </span>
              </>
            )}
            {started && !done && (
              <span className="animate-blink text-[var(--accent)] ml-0.5 font-light">
                ▎
              </span>
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={false}
          animate={{ opacity: showAfter ? 1 : 0, y: showAfter ? 0 : 16 }}
          transition={{ duration: 0.8 }}
          className="text-base md:text-lg lg:text-xl text-[var(--muted)] leading-relaxed max-w-2xl mb-12 md:mb-16 font-light"
        >
          Проєктуємо маркетинг, що масштабується. Від хаотичних гіпотез — до
          системної архітектури бізнесу від практика з 5-річним досвідом.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={false}
          animate={{ opacity: showAfter ? 1 : 0, y: showAfter ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#the-core"
            className="group inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 bg-[var(--fg)] text-[var(--bg)] text-sm md:text-base font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:tracking-[0.25em] active:scale-[0.98]"
            role="button"
          >
            Розпочати будівництво
          </a>
          <a
            href="#about"
            className="group inline-flex items-center justify-center px-8 py-4 md:px-10 md:py-5 border border-[var(--fg)] text-[var(--fg)] text-sm md:text-base font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[var(--fg)] hover:text-[var(--bg)] active:scale-[0.98] bg-transparent"
            role="button"
          >
            Про архітектора
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showAfter ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--muted)]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="text-[var(--fg)] opacity-40" />
        </motion.div>
      </motion.div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-[var(--border-color)]" />
    </section>
  );
}
