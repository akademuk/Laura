'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-[var(--bg)] border-t border-[var(--border-color,#1f1f1f)] transition-colors duration-500"
      role="contentinfo"
      aria-label="Підвал сайту"
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-block font-[var(--font-h)] font-bold text-2xl text-[var(--fg)] mb-4 hover:text-[var(--accent)] transition-colors"
            >
              Aleksandrovska<span className="text-[var(--fg)] opacity-30">.</span>
            </Link>
            <p className="text-sm text-[var(--muted,#888)] leading-relaxed max-w-xs">
              Aleksandrovska Hub — освітня платформа з системного маркетингу
              та управління бізнесом від практика.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)] mb-5 font-medium">
              Навігація
            </p>
            <nav aria-label="Навігація у підвалі" className="flex flex-col gap-3">
              <Link
                href="#the-core"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                Про курс
              </Link>
              <Link
                href="#about"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                Архітектор
              </Link>
              <Link
                href="#marketing-house"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                Система
              </Link>
              <Link
                href="#contact"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                Контакти
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)] mb-5 font-medium">
              Контакти
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@aleksandrovska.hub"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                hello@aleksandrovska.hub
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--muted,#888)] hover:text-[var(--fg)] transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border-color,#1f1f1f)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted,#888)] opacity-60">
            &copy; {currentYear} Aleksandrovska Hub. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted,#888)] opacity-40">
            Kyiv, Ukraine
          </p>
        </div>
      </div>
    </footer>
  );
}
