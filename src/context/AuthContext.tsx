import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatar_url: string;
  account_type: string;
  full_name?: string;
  headline?: string;
  location?: string;
  linkedin_url?: string;
  provider?: string | null;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  loginWithGoogle: () => void;
  loginWithLinkedin: () => void;
  loginWithPassword: (identifier: string, password: string) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (token: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  loginWithGoogle: () => {},
  loginWithLinkedin: () => {},
  loginWithPassword: async () => ({ success: false }),
  register: async () => ({ success: false }),
  forgotPassword: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'applyce_token';
const USER_KEY = 'applyce_user';
const OAUTH_PROVIDER_KEY = 'applyce_oauth_provider';

function storeAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  /* On mount, verify stored token is still valid */
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (data.success && data.user) {
          // keep avatar from localStorage if /me doesn't return one
          const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
          const merged = { ...data.user, avatar_url: data.user.avatar_url || savedUser.avatar_url || '' };
          setUser(merged);
          localStorage.setItem(USER_KEY, JSON.stringify(merged));
        } else {
          throw new Error('invalid');
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Redirect to OAuth provider (GitHub, Google, or LinkedIn) */
  const startOAuth = useCallback((provider: 'github' | 'google' | 'linkedin') => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    fetch(`${API_BASE}/api/auth/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.url) {
          sessionStorage.setItem(OAUTH_PROVIDER_KEY, provider);
          window.location.href = data.url;
        } else {
          window.location.href = '/login?oauth=error';
        }
      });
  }, []);

  /* Redirect to GitHub authorization */
  const login = useCallback(() => startOAuth('github'), [startOAuth]);

  /* Redirect to Google authorization */
  const loginWithGoogle = useCallback(() => startOAuth('google'), [startOAuth]);

  /* Redirect to LinkedIn authorization */
  const loginWithLinkedin = useCallback(() => startOAuth('linkedin'), [startOAuth]);

  /* Email/password login */
  const loginWithPassword = useCallback(async (identifier: string, password: string): Promise<AuthResult> => {
    if (!identifier || !password) return { success: false, error: 'Email and password are required.' };
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: identifier, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success || !data.token) {
        return { success: false, error: data.error || 'Invalid credentials.' };
      }
      storeAuth(data.token, data.user);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach the server. Please try again.' };
    }
  }, []);

  /* Create an account */
  const register = useCallback(async (payload: RegisterPayload): Promise<AuthResult> => {
    if (!payload.username || !payload.email || !payload.password) {
      return { success: false, error: 'Username, email, and password are required.' };
    }
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const data = await res.json();
      if (!data.success || !data.token) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      storeAuth(data.token, data.user);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach the server. Please try again.' };
    }
  }, []);

  /* Password reset request */
  const forgotPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: true, error: data.error };
    } catch {
      return { success: false, error: 'Could not reach the server. Please try again.' };
    }
  }, []);

  /* Complete password reset */
  const resetPassword = useCallback(async (token: string, password: string): Promise<AuthResult> => {
    if (!token || !password) return { success: false, error: 'Token and new password are required.' };
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, error: data.error || 'Password reset failed.' };
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach the server. Please try again.' };
    }
  }, []);

  /* Logout */
  const logout = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        loginWithLinkedin,
        loginWithPassword,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}