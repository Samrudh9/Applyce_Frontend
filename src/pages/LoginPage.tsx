import { motion } from 'framer-motion';
import { Chrome, Eye, EyeOff, Linkedin, Lock, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function LoginPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8 md:p-10" hover={false}>
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber to-gold">
              <Sparkles size={18} className="text-ink" />
            </div>
            <span className="font-display text-xl font-semibold">
              <span className="text-amber">App</span><span className="text-parchment">lyce</span>
            </span>
          </div>

          <h1 className="text-center font-display text-2xl font-semibold">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-muted">Sign in to continue your career journey.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="gap-2"><Chrome size={16} /> Google</Button>
            <Button variant="outline" size="sm" className="gap-2"><Linkedin size={16} /> LinkedIn</Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-parchment/10" />
            <span className="text-xs text-stone">or</span>
            <div className="h-px flex-1 bg-parchment/10" />
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Email or Username" placeholder="you@example.com" icon={<Mail size={16} />} />
            <div className="relative">
              <Input label="Password" type={show ? 'text' : 'password'} placeholder="••••••••" icon={<Lock size={16} />} />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-[2.35rem] text-muted hover:text-text">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-stone">
                <input type="checkbox" className="h-4 w-4 rounded border-parchment/20 bg-parchment/5 accent-amber" />
                Remember me
              </label>
              <Link to="#" className="text-amber hover:underline">Forgot Password?</Link>
            </div>

            <Button className="mt-2 w-full" size="lg">Sign In</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-amber hover:underline">Create one free</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
