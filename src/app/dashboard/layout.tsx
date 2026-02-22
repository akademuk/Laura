'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Settings,
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

/* ─── Nav Items ─── */
const NAV_ITEMS = [
  { label: 'Дашборд', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Мої курси', href: '/dashboard/courses', icon: BookOpen, exact: false },
  { label: 'Домашні завдання', href: '/dashboard/homework', icon: ClipboardCheck, exact: false },
  { label: 'Налаштування', href: '/dashboard/settings', icon: Settings, exact: false },
];

/* ─── Sidebar collapse persistence key ─── */
const SIDEBAR_COLLAPSED_KEY = 'laura-sidebar-collapsed';

/* ─── Sidebar ─── */
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
      {/* ── Logo / Brand ── */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-[var(--border-color)]">
        <Link href="/" className="flex items-center gap-3 group" aria-label="На головну">
          <div className="w-9 h-9 border border-[var(--fg)] flex items-center justify-center text-xs font-[var(--font-h)] font-bold text-[var(--fg)] tracking-tight group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)] transition-colors duration-300">
            LA
          </div>
          {!collapsed && (
            <span className="text-sm font-medium text-[var(--fg)] tracking-wide uppercase">
              Laura LMS
            </span>
          )}
        </Link>
        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="md:hidden text-[var(--muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
          aria-label="Закрити меню"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Основна навігація">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              aria-current={isActive ? 'page' : undefined}
              className={`
                group flex items-center gap-3 px-3 py-3 text-sm tracking-wide transition-all duration-300 relative
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]
                ${isActive
                  ? 'text-[var(--fg)] font-medium'
                  : 'text-[var(--muted)] hover:text-[var(--fg)]'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--fg)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={18} strokeWidth={1.5} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Link to admin panel (only for admin/curator) */}
        {(user?.role === 'admin' || user?.role === 'curator') && (
          <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
            <Link
              href="/admin"
              onClick={onMobileClose}
              className="flex items-center gap-3 px-3 py-3 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
            >
              <Shield size={18} strokeWidth={1.5} />
              {!collapsed && <span>Адмін-панель</span>}
            </Link>
          </div>
        )}
      </nav>

      {/* ── Bottom section ── */}
      <div className="border-t border-[var(--border-color)] px-3 py-4 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Переключити на світлу тему' : 'Переключити на темну тему'}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          {!collapsed && <span>{theme === 'dark' ? 'Світла тема' : 'Темна тема'}</span>}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--fg)] font-medium truncate">
                {user?.full_name ?? 'Студент'}
              </p>
              <p className="text-xs text-[var(--muted)] truncate">
                {user?.email ?? ''}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
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
      {/* Desktop sidebar */}
      <aside
        aria-label="Бічна панель"
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-dvh bg-[var(--bg)] border-r border-[var(--border-color)] z-40 transition-all duration-300
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        `}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Розгорнути бічну панель' : 'Згорнути бічну панель'}
          aria-expanded={!collapsed}
          className="absolute -right-3 top-20 w-6 h-6 border border-[var(--border-color)] bg-[var(--bg)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fg)]"
        >
          <ChevronLeft size={12} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-dvh w-[280px] bg-[var(--bg)] border-r border-[var(--border-color)] z-50 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Мобільне меню"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Top Bar (mobile) ─── */
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
      <Link href="/" className="flex items-center gap-2" aria-label="Laura LMS — на головну">
        <div className="w-7 h-7 border border-[var(--fg)] flex items-center justify-center text-[10px] font-[var(--font-h)] font-bold text-[var(--fg)]">
          LA
        </div>
        <span className="text-xs font-medium text-[var(--fg)] tracking-wide uppercase">
          Laura LMS
        </span>
      </Link>
      <div className="w-8" aria-hidden="true" />
    </header>
  );
}

/* ─── Dashboard Layout ─── */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initialize, isLoaded } = useAuthStore();
  const pathname = usePathname();

  // Persist sidebar collapsed state in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoaded) initialize();
  }, [isLoaded, initialize]);

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopBar onMenuOpen={() => setMobileOpen(true)} />

      {/* Main content area */}
      <main
        className={`
          min-h-dvh transition-all duration-300
          ${collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'}
        `}
      >
        <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}