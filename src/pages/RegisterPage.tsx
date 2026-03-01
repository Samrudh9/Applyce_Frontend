import { motion } from 'framer-motion';
import { Chrome, Eye, EyeOff, Linkedin, Lock, Mail, Sparkles, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';

function getStrength(pw: string): { value: number; label: string; color: string } {
  if (pw.length === 0) return { value: 0, label: '', color: 'from-muted to-muted' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { value: 25, label: 'Weak', color: 'from-danger to-danger' };
  if (score === 2) return { value: 50, label: 'Fair', color: 'from-warning to-warning' };
  if (score === 3) return { value: 75, label: 'Good', color: 'from-warning to-mint' };
  return { value: 100, label: 'Strong', color: 'from-success to-mint' };
}

export default function RegisterPage() {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const strength = getStrength(pw);

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8 md:p-10" hover={false}>
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber to-gold">
              <Sparkles size={18} className="text-ink" />
            </div>
            <span className="font-display text-xl font-semibold">
              <span className="text-amber">App</span><span className="text-parchment">lyce</span>
            </span>
          </div>

          <h1 className="text-center font-display text-2xl font-semibold">Create Your Account</h1>
          <p className="mt-1 text-center text-sm text-muted">Start your career growth today — it's free.</p>

          {/* Social login */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Chrome size={16} /> Google
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Linkedin size={16} /> LinkedIn
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-parchment/10" />
            <span className="text-xs text-stone">or continue with email</span>
            <div className="h-px flex-1 bg-parchment/10" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Username" placeholder="jane_doe" icon={<User size={16} />} />
            <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail size={16} />} />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-[2.35rem] text-muted hover:text-text"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pw && (
                <div className="mt-2">
                  <ProgressBar value={strength.value} colorClass={strength.color} height="h-1.5" animated={false} />
                  <p className="mt-1 text-xs text-muted">{strength.label}</p>
                </div>
              )}
            </div>
            <Input label="Confirm Password" type="password" placeholder="••••••••" icon={<Lock size={16} />} />

            <Button className="mt-2 w-full" size="lg">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber hover:underline">Sign in</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
