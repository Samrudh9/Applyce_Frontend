/**
 * Site-wide navigation groups — the dense, utility-first link row shared by
 * the marketing and app layouts (Talentd-style category grouping).
 *
 * Every route here is a real React Router route (see src/App.tsx).
 */

export type SiteNavLink = { to: string; label: string };

export type SiteNavGroup = {
  label: string;
  links: SiteNavLink[];
};

export const siteNavGroups: SiteNavGroup[] = [
  {
    label: 'Find Work',
    links: [
      { to: '/jobs', label: 'Jobs' },
      { to: '/tracker', label: 'Tracker' },
    ],
  },
  {
    label: 'Learn',
    links: [
      { to: '/roadmap', label: 'Roadmaps' },
      { to: '/interview', label: 'Interview Prep' },
      { to: '/quizzes', label: 'Quizzes' },
    ],
  },
  {
    label: 'Tools',
    links: [
      { to: '/upload', label: 'Analyze Resume' },
      { to: '/ats-report', label: 'ATS Report' },
      { to: '/resume-builder', label: 'Resume Builder' },
      { to: '/cover-letter', label: 'Cover Letter' },
    ],
  },
  {
    label: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/pricing', label: 'Pricing' },
    ],
  },
];

/** Flat list of every nav destination (for the mobile menu / sitemap-style lists). */
export const allSiteNavLinks: SiteNavLink[] = siteNavGroups.flatMap((g) => g.links);