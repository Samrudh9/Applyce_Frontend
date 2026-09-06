import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const columns: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { to: '/upload', label: 'Resume Analysis' },
      { to: '/resume-builder', label: 'Resume Builder' },
      { to: '/cover-letter', label: 'Cover Letters' },
      { to: '/jobs', label: 'Job Search' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { to: '/roadmap', label: 'Career Roadmaps' },
      { to: '/interview', label: 'Interview Prep' },
      { to: '/quizzes', label: 'Skill Quizzes' },
      { to: '/tracker', label: 'Application Tracker' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/login', label: 'Get started' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-ink">Applyce</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-sec">
              AI-assisted career intelligence — understand your resume, close skill
              gaps, and land the roles you actually want.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-sec">
                {col.title}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-sec transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-ter md:flex-row">
          <p>© {new Date().getFullYear()} Applyce. All rights reserved.</p>
          <p>Built for ambitious professionals.</p>
        </div>
      </div>
    </footer>
  );
}