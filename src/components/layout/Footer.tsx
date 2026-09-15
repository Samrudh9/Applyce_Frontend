import { Link } from 'react-router-dom';
import { Logo } from './Logo';

/**
 * Slim footer — single brand block + one compact row of functional links
 * that complement the navbar (navbar covers Jobs, Analyze Resume, Roadmaps,
 * Interview Prep, Pricing, About; footer covers the rest).
 *
 * Every route here is verified against src/App.tsx.
 */
const footerLinks = [
  { to: '/resume-builder', label: 'Resume Builder' },
  { to: '/cover-letter', label: 'Cover Letter' },
  { to: '/ats-report', label: 'ATS Report' },
  { to: '/tracker', label: 'Application Tracker' },
  { to: '/apply-agent', label: 'Apply Agent' },
  { to: '/scorecard', label: 'Scorecard' },
  { to: '/quizzes', label: 'Skill Quizzes' },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {/* Brand */}
        <div>
          <Logo size="sm" />
          <p className="mt-3 max-w-[260px] text-xs leading-relaxed text-ink-sec">
            AI career guidance — analyze your resume, close skill gaps, and find the career
            path that fits you.
          </p>
        </div>

        {/* Compact link row */}
        <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
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

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-line pt-5 text-[11px] text-ink-ter sm:flex-row">
          <p>© {new Date().getFullYear()} Applyce. All rights reserved.</p>
          <p>AI career guidance — find your path.</p>
        </div>
      </div>
    </footer>
  );
}