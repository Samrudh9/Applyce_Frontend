import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Github, LayoutDashboard, LogOut, Menu, Upload, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

/* ─── Nav structure: top-level items + grouped dropdowns ─── */
type NavItem = { to: string; label: string };
type NavGroup = { label: string; items: NavItem[] };
type NavEntry = NavItem | NavGroup;

const isGroup = (e: NavEntry): e is NavGroup => 'items' in e;

const nav: NavEntry[] = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/jobs', label: 'Jobs' },
  {
    label: 'Tools',
    items: [
      { to: '/resume-builder', label: 'Resume Builder' },
      { to: '/cover-letter', label: 'Cover Letters' },
      { to: '/interview', label: 'Interview Prep' },
      { to: '/quizzes', label: 'Skill Quizzes' },
    ],
  },
  {
    label: 'More',
    items: [
      { to: '/tracker', label: 'Application Tracker' },
      { to: '/scorecard', label: 'Score Card' },
    ],
  },
];

/* ─── Logo icon (inline SVG) ─── */
function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="8" fill="#1a1f2e" />
      <path d="M16 6L8 26h3.5l1.8-4h5.4l1.8 4H24L16 6zm-1.5 13l3.5-8.5 3.5 8.5h-7z" fill="#34d399" />
      <line x1="18.5" y1="8" x2="14" y2="26" stroke="#c78c5a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/* ─── Dropdown for grouped nav items ─── */
function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isChildActive = group.items.some((i) => location.pathname === i.to);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isChildActive ? 'text-mint-dark' : 'text-muted hover:text-text'
        }`}
      >
        {group.label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-border bg-white p-1.5 shadow-lg shadow-slate-200/50"
          >
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-mint/8 text-mint-dark' : 'text-muted hover:bg-slate-50 hover:text-text'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── User menu dropdown (with mini-dashboard) ─── */
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
        className="flex items-center gap-2 rounded-xl border border-border bg-white px-2.5 py-1.5 text-sm font-medium text-text transition-colors hover:bg-slate-50"
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-mint/15 text-xs font-bold text-mint-dark">{initials}</div>
        )}
        <span className="hidden sm:inline max-w-[120px] truncate">{user.username}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 w-[280px] rounded-xl border border-border bg-white shadow-lg shadow-slate-200/50"
          >
            {/* User info header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} className="h-10 w-10 rounded-full object-cover ring-2 ring-mint/20" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/15 text-sm font-bold text-mint-dark ring-2 ring-mint/20">{initials}</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text truncate">{user.username}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
                <span className="mt-0.5 inline-block rounded-full bg-mint/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-mint-dark">
                  {user.account_type || 'Free'}
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div className="p-1.5">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-slate-50 hover:text-text"
              >
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link
                to="/upload"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-slate-50 hover:text-text"
              >
                <Upload size={15} /> Upload Resume
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-border p-1.5">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
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

/* ─── Navbar ─── */
export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center px-4 py-3 md:px-8">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-8">
          <LogoIcon className="h-8 w-8" />
          <span className="font-display text-xl font-bold tracking-tight select-none">
            <span className="text-[#3d4450]">App</span>
            <span className="text-[#3d4450]/60">lyce</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden flex-1 items-center gap-1 md:flex">
          {nav.map((entry) =>
            isGroup(entry) ? (
              <NavDropdown key={entry.label} group={entry} />
            ) : (
              <NavLink
                key={entry.to}
                to={entry.to}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  location.pathname === entry.to ? 'text-mint-dark' : 'text-muted hover:text-text'
                }`}
              >
                {location.pathname === entry.to && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-mint/8 border border-mint/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{entry.label}</span>
              </NavLink>
            )
          )}
        </div>

        {/* ── Desktop auth ── */}
        <div className="hidden items-center gap-2.5 md:flex shrink-0 ml-6">
          {user ? (
            <UserMenu />
          ) : (
            <Link to="/login">
              <button className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-slate-50 hover:border-border-hover">
                <Github size={15} />
                Sign in
              </button>
            </Link>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="relative z-50 ml-auto rounded-lg p-2 text-text hover:bg-slate-50 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="space-y-1 px-4 py-4 bg-white">
              {nav.map((entry) =>
                isGroup(entry) ? (
                  <div key={entry.label}>
                    <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted/60">{entry.label}</p>
                    {entry.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive ? 'bg-mint/8 text-mint-dark' : 'text-muted hover:text-text hover:bg-slate-50'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={entry.to}
                    to={entry.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive ? 'bg-mint/8 text-mint-dark' : 'text-muted hover:text-text hover:bg-slate-50'
                      }`
                    }
                  >
                    {entry.label}
                  </NavLink>
                )
              )}
              {/* Mobile auth */}
              <div className="mt-4 border-t border-border pt-4">
                {user ? (
                  <div>
                    <div className="flex items-center gap-3 px-4 py-2">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/15 text-xs font-bold text-mint-dark">
                          {(user.username || 'U').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-text">{user.username}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="block" onClick={() => setMobileOpen(false)}>
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24292f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1b1f23]">
                      <Github size={15} /> Sign in with GitHub
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
