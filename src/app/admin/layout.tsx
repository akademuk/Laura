'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  ClipboardCheck,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from '@/components/ThemeProvider';

const ADMIN_NAV = [
  { label: 'Аналітика', href: '/admin', icon: BarChart3 },
  { label: 'Студенти', href: '/admin/students', icon: Users },
  { label: 'Домашні завдання', href: '/admin/homework', icon: ClipboardCheck },
  { label: 'Курси', href: '/admin/courses', icon: BookOpen },
];

function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2) ?? 'LA';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-[var(--border-color)]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 border border-[var(--fg)] flex items-center justify-center text-xs font-[var(--font-h)] font-bold text-[var(--fg)] tracking-tight group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)] transition-colors duration-300">
            LA
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--fg)] tracking-wide uppercase leading-none">
                Laura LMS
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)] mt-0.5 flex items-center gap-1">
                <Shield size={8} /> Адмін
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={onMobileClose}
          className="md:hidden text-[var(--muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          aria-label="Закрити меню"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Адмін-навігація">
        {ADMIN_NAV.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex items-center gap-3 px-3 py-3 text-sm tracking-wide transition-all duration-300 relative
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]
                ${isActive ? 'text-[var(--fg)] font-medium' : 'text-[var(--muted)] hover:text-[var(--fg)]'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--fg)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={18} strokeWidth={1.5} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Divider + link to student view */}
        <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-3 px-3 py-3 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          >
            <Users size={18} strokeWidth={1.5} />
            {!collapsed && <span>Кабінет студента</span>}
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-[var(--border-color)] px-3 py-4 space-y-2">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Переключити на світлу тему' : 'Переключити на темну тему'}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          {!collapsed && <span>{theme === 'dark' ? 'Світла тема' : 'Темна тема'}</span>}
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--fg)] font-medium truncate">{user?.full_name ?? 'Адмін'}</p>
              <p className="text-xs text-[var(--muted)] truncate">{user?.email ?? ''}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => { logout(); window.location.href = '/'; }}
          aria-label="Вийти з акаунту"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        >
          <LogOut size={18} strokeWidth={1.5} />
          {!collapsed && <span>Вийти</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        aria-label="Адмін-панель"
        className={`hidden md:flex flex-col fixed top-0 left-0 h-dvh bg-[var(--bg)] border-r border-[var(--border-color)] z-40 transition-all duration-300
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      >
        {sidebarContent}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Розгорнути панель' : 'Згорнути панель'}
          aria-expanded={!collapsed}
          className="absolute -right-3 top-20 w-6 h-6 border border-[var(--border-color)] bg-[var(--bg)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        >
          <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-dvh w-[280px] bg-[var(--bg)] border-r border-[var(--border-color)] z-50 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Мобільне адмін-меню"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--bg)] border-b border-[var(--border-color)]">
      <button
        onClick={onMenuOpen}
        aria-label="Відкрити меню"
        className="text-[var(--fg)] p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 border border-[var(--fg)] flex items-center justify-center text-[10px] font-[var(--font-h)] font-bold text-[var(--fg)]">
          LA
        </div>
        <span className="text-xs font-medium text-[var(--fg)] tracking-wide uppercase">Адмін</span>
      </div>
      <div className="w-8" />
    </header>
  );
}

const ADMIN_SIDEBAR_KEY = 'laura-admin-sidebar-collapsed';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, login, logout } = useAuthStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_SIDEBAR_KEY) === 'true';
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(ADMIN_SIDEBAR_KEY, String(next));
      return next;
    });
  }, []);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Login as admin for dev
    if (!isLoaded) {
      login('usr-laura-001');
    }
  }, [isLoaded, login]);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopBar onMenuOpen={() => setMobileOpen(true)} />
      <main className={`min-h-dvh transition-all duration-300 ${collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'}`}>
        <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
