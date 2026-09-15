/**
 * Site-wide navigation links — flat, minimal primary nav shared by
 * the marketing and app layouts. Max 6 items for a calm top row.
 *
 * Every route here is a real React Router route (see src/App.tsx).
 */

export type SiteNavLink = { to: string; label: string };

/** Primary nav links — rendered in the top bar and mobile panel. */
export const siteNavLinks: SiteNavLink[] = [
  { to: '/jobs', label: 'Jobs' },
  { to: '/upload', label: 'Analyze Resume' },
  { to: '/roadmap', label: 'Roadmaps' },
  { to: '/interview', label: 'Interview Prep' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
];
