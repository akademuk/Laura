'use client';

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)] mb-3">
          Акаунт
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-h)] font-bold text-[var(--fg)] leading-tight">
          Налаштування
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="border border-[var(--border-color)] p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] text-center"
      >
        <Settings size={32} className="text-[var(--muted)] opacity-30 mb-4" />
        <p className="text-sm text-[var(--muted)]">
          Налаштування профілю будуть доступні після підключення Supabase Auth
        </p>
      </motion.div>
    </>
  );
}
