import { Github, Heart, Linkedin, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/jobs', label: 'Job Search' },
  { to: '/roadmap', label: 'Roadmaps' },
  { to: '/about', label: 'About Us' },
];

const resources = [
  { to: '/upload', label: 'Upload Resume' },
  { to: '/resume-builder', label: 'Resume Builder' },
  { to: '/cover-letter', label: 'Cover Letters' },
  { to: '/dashboard', label: 'Dashboard' },
];

const socials = [
  { icon: Mail, href: '#', label: 'Email' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <h4 className="font-display text-xl font-bold">
              <span className="text-mint-dark">App</span>
              <span className="text-text">lyce</span>
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              AI-powered career intelligence helping professionals discover their ideal path and land their dream roles.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-all hover:border-mint/40 hover:text-mint-dark hover:bg-mint/5"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Quick Links</h5>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted transition-colors hover:text-mint-dark">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Resources</h5>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted transition-colors hover:text-mint-dark">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Stay Updated</h5>
            <p className="text-sm text-muted">Get career tips and platform updates.</p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="you@email.com"
                className="input-glow w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-stone outline-none focus:border-mint"
              />
              <button className="shrink-0 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-mint-dark">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Applyce. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-danger" /> for ambitious professionals
          </p>
        </div>
      </div>
    </footer>
  );
}
