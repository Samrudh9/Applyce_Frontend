import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, RotateCcw } from 'lucide-react';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

type LoadState = 'loading' | 'ready' | 'error';

/**
 * Daily digest preference.
 *
 * Self-contained on purpose: it reads GET /api/newsletter/status and saves via
 * POST /api/newsletter/subscribe, but a failure here never disables the rest of
 * the page. Status loads as a skeleton, degrades to a quiet inline error with a
 * retry, and saving is optimistic with a revert + retry on failure — the switch
 * is never a dead control.
 */
export function DigestToggle() {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<LoadState>('loading');
  const [subscribed, setSubscribed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const loadStatus = useCallback(async () => {
    setState('loading');
    setSaveError('');
    setPendingValue(null);
    try {
      const res = await api.newsletterStatus();
      setSubscribed(!!res.subscribed);
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const applySubscription = useCallback(async (next: boolean) => {
    setSaveError('');
    setPendingValue(null);
    setSaving(true);
    setSubscribed(next); // optimistic — flips instantly
    try {
      const res = await api.newsletterSubscribe(next);
      setSubscribed(!!res.subscribed);
    } catch {
      setSubscribed(!next); // revert to the last known-good state
      setSaveError(
        next
          ? 'We couldn’t turn the digest on. Try again.'
          : 'We couldn’t turn the digest off. Try again.',
      );
      setPendingValue(next);
    } finally {
      setSaving(false);
    }
  }, []);

  const retrySave = useCallback(() => {
    if (pendingValue !== null) void applySubscription(pendingValue);
  }, [pendingValue, applySubscription]);

  return (
    <Card hover={false} aria-busy={state === 'loading' || saving}>
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent-soft text-accent-strong">
          <Mail size={15} />
        </div>
        <h2 className="text-sm font-bold text-ink">Email preferences</h2>
      </div>

      <div className="mt-4">
        {state === 'loading' && (
          <div
            className="flex items-center justify-between gap-4"
            role="status"
            aria-label="Loading your digest preference"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full max-w-md" />
            </div>
            <Skeleton className="h-6 w-11 shrink-0 rounded-full" />
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">Daily digest</p>
              <p className="mt-0.5 text-xs text-ink-sec">
                We couldn’t load your email preference. Check your connection and try again.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadStatus()}
              className="shrink-0 self-start sm:self-auto"
            >
              <RotateCcw size={14} /> Try again
            </Button>
          </div>
        )}

        {state === 'ready' && (
          <div className="flex items-start justify-between gap-4 sm:items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">Daily digest</p>
              <p className="mt-0.5 text-xs text-ink-sec">
                A daily email with the newest roles in your fields. You control it — off by
                default, one-click unsubscribe in every mail.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs font-medium text-ink-ter" aria-hidden>
                {saving ? 'Saving…' : subscribed ? 'On' : 'Off'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={subscribed}
                aria-label="Daily digest"
                disabled={saving}
                onClick={() => void applySubscription(!subscribed)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 before:absolute before:-inset-2 before:content-[''] disabled:cursor-wait disabled:opacity-60 ${
                  subscribed ? 'border-accent bg-accent' : 'border-line-strong bg-elevated'
                }`}
              >
                <motion.span
                  className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                  animate={{ x: subscribed ? 20 : 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'tween', duration: 0.16, ease: 'easeOut' }
                  }
                />
              </button>
            </div>
          </div>
        )}

        {saveError && (
          <div
            role="alert"
            className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-danger/25 bg-danger/5 px-3 py-2"
          >
            <p className="text-xs text-danger">{saveError}</p>
            {pendingValue !== null && (
              <button
                type="button"
                onClick={retrySave}
                className="shrink-0 text-xs font-semibold text-danger underline underline-offset-2 hover:no-underline"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default DigestToggle;
