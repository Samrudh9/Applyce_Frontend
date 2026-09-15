import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Footer } from './Footer';
import { Logo } from './Logo';
import { SiteNavLinks, SiteNavMobilePanel } from './SiteNavLinks';

export function MarketingLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  /* Close mobile nav when route changes */
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
        <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo size="sm" />

          {/* Desktop nav — dense grouped links (hidden below lg) */}
          <SiteNavLinks className="hidden lg:flex" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden md:block">
              {user ? (
                <NavLink to="/dashboard">
                  <Button size="sm" variant="secondary">
                    Dashboard
                  </Button>
                </NavLink>
              ) : (
                <NavLink to="/login">
                  <Button size="sm" variant="accent">
                    Get started
                  </Button>
                </NavLink>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-ink-sec transition-colors hover:bg-elevated hover:text-ink lg:hidden"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
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
              className="overflow-hidden border-t border-line bg-canvas lg:hidden"
            >
              <SiteNavMobilePanel onNavigate={() => setMobileOpen(false)} />
              <div className="px-4 pb-4">
                {user ? (
                  <NavLink to="/dashboard" className="block" onClick={() => setMobileOpen(false)}>
                    <Button size="lg" variant="secondary" className="w-full">
                      Dashboard
                    </Button>
                  </NavLink>
                ) : (
                  <NavLink to="/login" className="block" onClick={() => setMobileOpen(false)}>
                    <Button size="lg" variant="accent" className="w-full">
                      Get started
                    </Button>
                  </NavLink>
                )}
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