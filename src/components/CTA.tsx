'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CTA() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-36 bg-[var(--bg)] overflow-hidden"
      aria-label="Заявка на доступ"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-[var(--fg)] opacity-10" />

      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm md:text-base uppercase tracking-[0.3em] text-[var(--muted)] mb-6"
        >
          Почніть зараз
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-[1.1] mb-6"
        >
          Готові побудувати свою{' '}
          <span className="italic">систему</span>?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-[var(--muted,#888)] mb-14 max-w-xl mx-auto font-light leading-relaxed"
        >
          Отримайте доступ до платформи та почніть будівництво своєї маркетингової системи.
        </motion.p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-5"
          aria-label="Форма заявки на доступ"
        >
          <div>
            <label htmlFor="cta-name" className="sr-only">
              Ім&apos;я
            </label>
            <input
              id="cta-name"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent border border-[var(--border-color)] text-[var(--fg)] px-5 py-4 text-sm md:text-base placeholder:text-[var(--muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--fg)] transition-colors duration-300 font-[var(--font-b)]"
            />
          </div>
          <div>
            <label htmlFor="cta-email" className="sr-only">
              Email
            </label>
            <input
              id="cta-email"
              type="email"
              placeholder="Ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-[var(--border-color)] text-[var(--fg)] px-5 py-4 text-sm md:text-base placeholder:text-[var(--muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--fg)] transition-colors duration-300 font-[var(--font-b)]"
            />
          </div>
          <button
            type="submit"
            disabled={submitted}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 md:py-5 bg-[var(--fg)] text-[var(--bg)] text-sm md:text-base font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:tracking-[0.25em] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <span>Дякуємо! Ми зв&apos;яжемося з вами.</span>
            ) : (
              <>
                <span>Отримати доступ</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </>
            )}
          </button>
        </motion.form>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs text-[var(--muted,#888)] opacity-50 mt-6"
        >
          Ми поважаємо вашу конфіденційність. Жодного спаму.
        </motion.p>
      </div>
    </section>
  );
}
