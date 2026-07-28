import { useState } from 'react';
import { Github, Heart, Linkedin, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const resources = [
  { to: '/upload', label: 'Upload Resume' },
  { to: '/resume-builder', label: 'Resume Builder' },
  { to: '/cover-letter', label: 'Cover Letters' },
  { to: '/dashboard', label: 'Dashboard' },
];

const socials = [
  { icon: Mail, href: 'mailto:hello@applyce.tech', label: 'Email' },
  /* { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' }, */
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      // TODO: Replace this URL with your incoming Webhook URL (e.g., from Make.com, Zapier, or Zoho Flow)
      const WEBHOOK_URL = 'https://flow.zoho.com/918206483/flow/webhook/incoming?zapikey=1001.18f2cdf6c88e846376872465f9d40abb.3a011c4bdc1cc69529fe39cc168e16fc&isdebug=true';

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        // 'no-cors' allows the request to be sent without CORS errors, 
        // but note you may not get a readable success response back.
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      });

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter error:', error);
      setStatus('error');
    }
  };

  return (
    <footer className="mt-24 border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
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
            <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  disabled={status === 'loading'}
                  className="input-glow w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-stone outline-none focus:border-mint disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="shrink-0 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-mint-dark disabled:opacity-50"
                >
                  {status === 'loading' ? 'Joining...' : 'Join'}
                </button>
              </div>
              {status === 'success' && <p className="text-xs text-mint-dark">Thanks for subscribing!</p>}
              {status === 'error' && <p className="text-xs text-danger">Something went wrong. Please try again.</p>}
            </form>
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
