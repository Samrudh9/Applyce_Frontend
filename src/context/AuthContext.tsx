import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  avatar_url: string;
  account_type: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'applyce_token';
const USER_KEY = 'applyce_user';

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

  /* Redirect to GitHub authorization */
  const login = useCallback(() => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    fetch(`${API_BASE}/api/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.url) {
          window.location.href = data.url;
        }
      });
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
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
