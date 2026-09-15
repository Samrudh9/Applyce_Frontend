import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { siteNavGroups } from './siteNav';

/**
 * SiteNavLinks — the dense single-row category nav (Talentd style).
 *
 * Renders grouped text links: `Find Work · Learn · Tools · Company`. It stays
 * a single row of small text links with category labels — no mega menu.
 */
export function SiteNavLinks({ className = '' }: { className?: string }) {
  return (
    <nav className={`flex items-center ${className}`} aria-label="Primary">
      {siteNavGroups.map((group, gi) => (
        <Fragment key={group.label}>
          {gi > 0 && <span className="mx-3 h-4 w-px shrink-0 bg-line" aria-hidden="true" />}
          <div className="flex items-center gap-1.5">
            <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-ink-ter xl:inline">
              {group.label}
            </span>
            {group.links.map((link, li) => (
              <Fragment key={link.to}>
                {li > 0 && (
                  <span className="text-[10px] text-ink-ter/70" aria-hidden="true">
                    ·
                  </span>
                )}
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded px-1.5 py-1 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-accent-strong'
                        : 'text-ink-sec hover:text-ink'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </Fragment>
            ))}
          </div>
        </Fragment>
      ))}
    </nav>
  );
}

/** SiteNavMobilePanel — dense grouped menu for small screens. */
export function SiteNavMobilePanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-5 px-4 py-5">
      {siteNavGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-ter">
            {group.label}
          </p>
          <div className="grid gap-0.5">
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-soft text-accent-strong'
                      : 'text-ink-sec hover:bg-elevated/70 hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}