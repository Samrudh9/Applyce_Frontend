import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Footer } from './Footer';
import { Logo } from './Logo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];

export function MarketingLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  /* Close mobile nav when route changes */
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-sec hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="hidden md:block">
              {user ? (
                <NavLink to="/dashboard">
                  <Button size="sm" variant="secondary">
                    Open Dashboard
                  </Button>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <Button size="sm">Get started</Button>
                </NavLink>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink-sec transition-colors hover:bg-elevated hover:text-ink md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-t border-line bg-canvas md:hidden"
            >
              <div className="space-y-1 px-4 py-3">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                        isActive ? 'bg-elevated text-ink' : 'text-ink-sec hover:bg-elevated/60 hover:text-ink'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="pt-2">
                  {user ? (
                    <NavLink to="/dashboard" className="block">
                      <Button size="lg" variant="secondary" className="w-full">
                        Open Dashboard
                      </Button>
                    </NavLink>
                  ) : (
                    <NavLink to="/login" className="block">
                      <Button size="lg" className="w-full">
                        Get started
                      </Button>
                    </NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="px-4 md:px-8">{children}</main>

      <Footer />
    </div>
  );
}