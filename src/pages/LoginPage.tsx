import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Github, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'applyce_token';
const USER_KEY = 'applyce_user';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  /* Already logged in — redirect to dashboard */
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card hover={false} className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1f2e]">
          <svg viewBox="0 0 32 32" fill="none" className="h-10 w-10">
            <path d="M16 6L8 26h3.5l1.8-4h5.4l1.8 4H24L16 6zm-1.5 13l3.5-8.5 3.5 8.5h-7z" fill="#34d399" />
            <line x1="18.5" y1="8" x2="14" y2="26" stroke="#c78c5a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-text">Sign in to Applyce</h1>
        <p className="mt-2 text-sm text-muted">
          Continue with your GitHub account to access your dashboard, saved analyses, and more.
        </p>

        <button
          onClick={login}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#24292f] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1b1f23] active:scale-[0.98]"
        >
          <Github size={20} />
          Sign in with GitHub
        </button>

        <p className="mt-6 text-xs text-muted">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </div>
  );
}


/** Separate component for the /auth/callback route */
export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    console.log('[AuthCallback] code param:', code ? code.slice(0, 8) + '...' : 'MISSING');
    if (!code) {
      setError('No authorization code received from GitHub.');
      return;
    }

    fetch(`${API_BASE}/api/auth/github/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log('[AuthCallback] response:', data.success, data.user?.username);
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          // Force reload to re-initialize AuthContext with the new token
          window.location.href = '/dashboard';
        } else {
          console.error('[AuthCallback] failed:', data.error);
          setError(data.error || 'Authentication failed');
        }
      })
      .catch((err) => {
        console.error('[AuthCallback] network error:', err);
        setError('Network error during authentication');
      });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card hover={false} className="w-full max-w-sm text-center">
          <p className="text-lg font-semibold text-red-500">Authentication Failed</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 rounded-xl bg-mint px-5 py-2 text-sm font-semibold text-white hover:bg-mint-dark"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto animate-spin text-mint" size={40} />
        <p className="mt-4 text-sm text-muted">Authenticating with GitHub…</p>
      </div>
    </div>
  );
}
