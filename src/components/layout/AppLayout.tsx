import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  ChevronDown,
  FileUp,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Map,
  Menu,
  Mic,
  PenLine,
  Puzzle,
  ScanSearch,
  Search,
  Send,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from './Logo';
import { NotificationsBell } from './NotificationsBell';

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean };

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Resume',
    items: [
      { to: '/upload', label: 'Analyze Resume', icon: FileUp },
      { to: '/ats-report', label: 'ATS Compatibility Report', icon: ScanSearch },
      { to: '/resume-builder', label: 'Resume Builder', icon: PenLine },
      { to: '/cover-letter', label: 'Cover Letter', icon: Mail },
      { to: '/scorecard', label: 'Scorecard', icon: Award },
    ],
  },
  {
    label: 'Career',
    items: [
      { to: '/jobs', label: 'Job Search', icon: Search },
      { to: '/apply-agent', label: 'Apply Agent', icon: Send },
      { to: '/roadmap', label: 'Roadmap', icon: Map },
      { to: '/tracker', label: 'Application Tracker', icon: ListChecks },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/interview', label: 'Interview Prep', icon: Mic },
      { to: '/quizzes', label: 'Skill Quizzes', icon: Puzzle },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-ter">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-elevated text-ink'
                        : 'text-ink-sec hover:bg-elevated/70 hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} strokeWidth={1.75} className="shrink-0" />
                      <span className="truncate">{label}</span>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-accent" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        {user ? (
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-elevated text-xs font-semibold text-ink">
                {(user.username || 'U').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user.username}</p>
              <p className="truncate text-[11px] text-ink-ter">
                {user.account_type ? `${user.account_type} plan` : 'Member'}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate?.();
              }}
              aria-label="Sign out"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-ter transition-colors hover:bg-elevated hover:text-danger"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-xs text-ink-ter">Not signed in</span>
            <NavLink
              to="/login"
              onClick={onNavigate}
              className="text-xs font-medium text-accent hover:underline"
            >
              Sign in
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) return null;

  const initials = (user.username || 'U').slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-line bg-surface py-1 pl-1 pr-2 transition-colors hover:bg-elevated"
        aria-label="Account menu"
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="h-7 w-7 rounded-md object-cover" />
        ) : (
          <div className="grid h-7 w-7 place-items-center rounded-md bg-elevated text-xs font-semibold text-ink">
            {initials}
          </div>
        )}
        <ChevronDown size={14} className={`text-ink-ter transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-card-hover"
          >
            <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} className="h-9 w-9 rounded-lg object-cover" />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-elevated text-sm font-semibold text-ink">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{user.username}</p>
                <p className="truncate text-xs text-ink-ter">{user.email}</p>
              </div>
            </div>
            <div className="mt-1 border-t border-line pt-1">
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/5"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-line bg-surface md:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.18 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-surface md:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-md text-ink-sec hover:bg-elevated"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-sec md:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1">
            <Link to="/dashboard" className="md:hidden">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <NotificationsBell />
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}