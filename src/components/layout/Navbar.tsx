import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/resume-builder', label: 'Builder' },
  { to: '/cover-letter', label: 'Letters' },
  { to: '/interview', label: 'Interview' },
  { to: '/quizzes', label: 'Quizzes' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/scorecard', label: 'Score Card' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-emerald-400">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-mint-dark">App</span>
            <span className="text-text">lyce</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'text-mint-dark' : 'text-muted hover:text-text'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-mint/8 border border-mint/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/upload">
            <Button variant="purple" size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="relative z-50 rounded-lg p-2 text-text hover:bg-slate-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="space-y-1 px-4 py-4 bg-white">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-mint/8 text-mint-dark' : 'text-muted hover:text-text hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4 border-t border-border pt-4">
                <Link to="/upload" onClick={() => setOpen(false)}>
                  <Button variant="purple" size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
