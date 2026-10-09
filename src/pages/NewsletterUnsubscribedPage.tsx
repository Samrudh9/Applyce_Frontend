import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, RotateCcw, Unlink } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/layout/Logo';
import { Skeleton } from '../components/ui/Skeleton';

type UnsubState = 'loading' | 'success' | 'invalid' | 'error';

/**
 * Public landing for the one-click unsubscribe link.
 *
 * The email link carries a token; this page calls the public
 * GET /api/newsletter/unsubscribe/<token> and reports the outcome in plain
 * language. A missing, bad, or already-used token is a calm "invalid" state —
 * never a stack trace or silent failure.
 */
export default function NewsletterUnsubscribedPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? searchParams.get('t') ?? '';
  const [state, setState] = useState<UnsubState>('loading');

  const run = useCallback(async () => {
    if (!token) {
      setState('invalid');
      return;
    }
    setState('loading');
    try {
      await api.newsletterUnsubscribe(token);
      setState('success');
    } catch (err) {
      if (err instanceof ApiError && [400, 404, 410].includes(err.status)) {
        setState('invalid');
      } else {
        setState('error');
      }
    }
  }, [token]);

  useEffect(() => {
    void run();
  }, [run]);

  /* One-time token in the URL — keep this page out of search indexes. */
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card hover={false} className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {state === 'loading' && (
          <div
            role="status"
            aria-busy="true"
            aria-label="Checking your unsubscribe link"
            className="space-y-3"
          >
            <Skeleton className="mx-auto h-6 w-56" />
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        )}

        {state === 'success' && (
          <>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent-strong">
              <CheckCircle2 size={22} />
            </div>
            <h1 className="mt-4 font-display text-lg font-semibold text-ink">
              You&apos;re unsubscribed from the daily digest.
            </h1>
            <p className="mt-3 text-xs text-ink-sec">
              Changed your mind?{' '}
              <Link
                to="/dashboard#settings"
                className="font-medium text-accent-strong hover:underline"
              >
                Re-subscribe from settings.
              </Link>
            </p>
          </>
        )}

        {state === 'invalid' && (
          <>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-elevated text-ink-ter">
              <Unlink size={22} />
            </div>
            <h1 className="mt-4 font-display text-lg font-semibold text-ink">
              This link is invalid or already used.
            </h1>
            <p className="mt-3 text-xs text-ink-sec">
              If you still want to stop the daily digest, you can turn it off in your dashboard.
            </p>
            <div className="mt-5 flex justify-center">
              <Link to="/dashboard#settings">
                <Button variant="outline" size="sm">
                  Open settings
                </Button>
              </Link>
            </div>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger/5 text-danger">
              <RotateCcw size={22} />
            </div>
            <h1 className="mt-4 font-display text-lg font-semibold text-ink">
              We couldn&apos;t confirm that link.
            </h1>
            <p className="mt-3 text-xs text-ink-sec">
              Check your connection and try again.
            </p>
            <div className="mt-5 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => void run()}>
                <RotateCcw size={14} /> Try again
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
