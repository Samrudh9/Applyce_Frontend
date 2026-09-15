import { NavLink } from 'react-router-dom';
import { siteNavLinks } from './siteNav';

/**
 * SiteNavLinks — flat, calm single-row nav. No groups, no labels, no dots.
 */
export function SiteNavLinks({ className = '' }: { className?: string }) {
  return (
    <nav className={`flex items-center gap-6 ${className}`} aria-label="Primary">
      {siteNavLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) =>
            `whitespace-nowrap text-sm font-medium transition-colors ${
              isActive
                ? 'text-accent-strong'
                : 'text-ink-sec hover:text-ink'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** SiteNavMobilePanel — flat stacked list for small screens. */
export function SiteNavMobilePanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="px-4 py-5">
      {siteNavLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            `block border-t border-line py-3 text-base font-medium transition-colors first:border-t-0 ${
              isActive
                ? 'text-accent-strong'
                : 'text-ink-sec hover:text-ink'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}
