import { Link } from 'react-router-dom';
import { Logo } from './Logo';

const columns: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Find Work',
    links: [
      { to: '/jobs', label: 'Jobs' },
      { to: '/tracker', label: 'Application Tracker' },
      { to: '/apply-agent', label: 'Apply Agent' },
      { to: '/scorecard', label: 'Scorecard' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/roadmap', label: 'Career Roadmaps' },
      { to: '/interview', label: 'Interview Prep' },
      { to: '/quizzes', label: 'Skill Quizzes' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { to: '/upload', label: 'Analyze Resume' },
      { to: '/ats-report', label: 'ATS Report' },
      { to: '/resume-builder', label: 'Resume Builder' },
      { to: '/cover-letter', label: 'Cover Letter' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/login', label: 'Get Started' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Logo size="sm" />
            <p className="mt-3 max-w-[260px] text-xs leading-relaxed text-ink-sec">
              AI career guidance — analyze your resume, close skill gaps, and find the career
              path that fits you.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-ter">
                {col.title}
              </h5>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs font-medium text-ink-sec transition-colors hover:text-accent-strong"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-line pt-5 text-[11px] text-ink-ter sm:flex-row">
          <p>© {new Date().getFullYear()} Applyce. All rights reserved.</p>
          <p>AI career guidance — find your path.</p>
        </div>
      </div>
    </footer>
  );
}