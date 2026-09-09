import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Github, Linkedin, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/layout/Logo';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'applyce_token';
const USER_KEY = 'applyce_user';
const OAUTH_PROVIDER_KEY = 'applyce_oauth_provider';

export default function LoginPage() {
  const { user, login, loginWithGoogle, loginWithLinkedin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error] = useState(
    searchParams.get('oauth') === 'error' ? 'OAuth sign in is not configured yet.' : '',
  );
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  const handleOAuth = (provider: string, fn: () => void) => {
    setPendingProvider(provider);
    fn();
  };

  /* Already logged in — redirect to dashboard */
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card hover={false} className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <h1 className="text-center font-display text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-ink-sec">
          Sign in to continue to your dashboard.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-center text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth('github', login)}
            disabled={pendingProvider !== null}
          >
            {pendingProvider === 'github' ? <Loader2 size={16} className="animate-spin" /> : <Github size={16} />}
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth('google', loginWithGoogle)}
            disabled={pendingProvider !== null}
          >
            {pendingProvider === 'google' ? <Loader2 size={16} className="animate-spin" /> : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
            )}
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuth('linkedin', loginWithLinkedin)}
            disabled={pendingProvider !== null}
          >
            {pendingProvider === 'linkedin' ? <Loader2 size={16} className="animate-spin" /> : <Linkedin size={16} />}
            Continue with LinkedIn
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-ink-ter">
          By continuing you agree to our terms &amp; privacy policy.
        </p>
      </Card>
    </div>
  );
}

/** Separate component for the /auth/callback route — handles GitHub, Google, LinkedIn */
export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const queryError = searchParams.get('error');
    if (queryError) {
      setError(
        queryError === 'access_denied'
          ? 'You denied access. You can try again or sign in with another provider.'
          : 'OAuth sign in failed.',
      );
      return;
    }

    const code = searchParams.get('code');
    const stored = sessionStorage.getItem(OAUTH_PROVIDER_KEY);
    const provider: 'github' | 'google' | 'linkedin' =
      stored === 'google' ? 'google' : stored === 'linkedin' ? 'linkedin' : 'github';
    sessionStorage.removeItem(OAUTH_PROVIDER_KEY);

    if (!code) {
      setError('No authorization code received.');
      return;
    }

    fetch(`${API_BASE}/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: `${window.location.origin}/auth/callback` }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          window.location.href = '/dashboard';
        } else {
          setError(data.error || 'Authentication failed');
        }
      })
      .catch(() => {
        setError('Network error during authentication');
      });
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card hover={false} className="w-full max-w-sm text-center">
          <p className="text-lg font-semibold text-ink">Authentication failed</p>
          <p className="mt-2 text-sm text-ink-sec">{error}</p>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Try again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto animate-spin text-accent" size={40} />
        <p className="mt-4 text-sm text-ink-sec">Authenticating…</p>
      </div>
    </div>
  );
}