'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

/* Premium thin-line icons */
const SunIcon = ({ size = 16, ...p }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = ({ size = 16, ...p }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, mounted, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: '#the-core', label: 'Про курс' },
    { href: '#about', label: 'Архітектор' },
    { href: '#marketing-house', label: 'Система' },
    { href: '#contact', label: 'Контакти' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border-color,#1f1f1f)]'
          : 'bg-transparent border-b border-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-h)] font-bold text-xl md:text-2xl text-[var(--fg)] tracking-tight hover:text-[var(--accent)] transition-colors duration-300"
          aria-label="Aleksandrovska Hub — головна сторінка"
        >
          <span className="hidden sm:inline">Aleksandrovska</span>
          <span className="sm:hidden">AH</span>
          <span className="text-[var(--fg)] opacity-30">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-10"
          aria-label="Основна навігація"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm uppercase tracking-[0.15em] text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors duration-300 font-medium group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--accent)] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 w-10 h-10 flex items-center justify-center rounded-full border border-[var(--border-color,#222)] hover:border-[var(--fg)] transition-all duration-300"
            aria-label={!mounted || theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
          >
            {!mounted || theme === 'dark' ? (
              <SunIcon size={16} className="text-[var(--fg)]" />
            ) : (
              <MoonIcon size={16} className="text-[var(--fg)]" />
            )}
          </button>

          {/* CTA Button */}
          <Link
            href="#contact"
            className="ml-4 px-6 py-2.5 border border-[var(--fg)] text-[var(--fg)] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all duration-300"
          >
            Почати
          </Link>
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          className="lg:hidden relative w-8 h-8 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={mobileOpen}
        >
          <div className="relative w-6 h-4">
            {/* Top line */}
            <span
              className={`absolute left-0 w-full h-[1.5px] bg-[var(--fg)] transition-all duration-300 ease-in-out origin-center ${
                mobileOpen ? 'top-[7px] rotate-45' : 'top-0 rotate-0'
              }`}
            />
            {/* Middle line */}
            <span
              className={`absolute left-0 top-[7px] w-full h-[1.5px] bg-[var(--fg)] transition-all duration-300 ease-in-out ${
                mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            {/* Bottom line */}
            <span
              className={`absolute left-0 w-full h-[1.5px] bg-[var(--fg)] transition-all duration-300 ease-in-out origin-center ${
                mobileOpen ? 'top-[7px] -rotate-45' : 'top-[14px] rotate-0'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 bg-[var(--bg)] z-[99] flex flex-col items-center justify-center gap-10 lg:hidden"
            role="dialog"
            aria-label="Мобільне меню"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="font-[var(--font-h)] text-3xl md:text-4xl text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              <Link
                href="#contact"
                className="px-10 py-4 border border-[var(--fg)] text-[var(--fg)] text-sm uppercase tracking-[0.2em] font-medium hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Почати
              </Link>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 text-sm text-[var(--muted,#777)] hover:text-[var(--fg)] transition-colors"
                aria-label={!mounted || theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
              >
                {!mounted || theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                <span>{!mounted || theme === 'dark' ? 'Світла тема' : 'Темна тема'}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
