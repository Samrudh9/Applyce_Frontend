import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Logo />

          <div className="hidden items-center gap-1 sm:flex">
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
        </nav>
      </header>

      <main className="px-4 md:px-8">{children}</main>

      <Footer />
    </div>
  );
}