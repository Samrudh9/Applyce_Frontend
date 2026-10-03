import { useCallback, useEffect, useLayoutEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, Copy, Download, ImageDown, Share2, X } from 'lucide-react';
import { ShareResultCard } from './ShareResultCard';
import {
  CARD_HEIGHT,
  CARD_PIXEL_RATIO,
  CARD_WIDTH,
  buildShareText,
  canCopyImages,
  cardFileName,
  copyImageToClipboard,
  copyTextToClipboard,
  downloadBlob,
  renderCardToPng,
  type ShareCardData,
} from '../../lib/share';
import { Button } from '../ui/Button';

/**
 * ShareResultSheet — the in-app share panel.
 *
 * Shows the card as it will be exported (a scaled-down render of the very
 * same node, not a separate mock-up), plus the three ways to share it:
 * download the PNG, copy the image, copy the caption.
 */

type Status = 'idle' | 'working' | 'error';

/** Fits the fixed 1080px-wide card inside whatever width the sheet gives it. */
function useFitScale() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const measure = (width: number) => {
      if (width > 0) setScale(width / CARD_WIDTH);
    };
    measure(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) measure(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { boxRef, scale };
}

export function ShareResultSheet({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ShareCardData;
}) {
  const { boxRef, scale } = useFitScale();
  const cardRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const [notice, setNotice] = useState('');
  const [captionCopied, setCaptionCopied] = useState(false);

  const caption = buildShareText(data);
  const filename = cardFileName(data);
  const busy = status === 'working';
  const titleId = useId();

  /* The clipboard capability can only be read in the browser, and reading it
     on every render would be wasteful — sample it once per open. */
  const [imageClipboard, setImageClipboard] = useState(false);
  useEffect(() => {
    if (open) setImageClipboard(canCopyImages());
  }, [open]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorText('');
  }, []);

  /* Close on Escape, restore focus, and lock the page behind the sheet.
     Tab is cycled inside the panel so keyboard users can't wander into the
     page underneath a modal. */
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 60);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      restoreFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  /* A fresh attempt should clear the previous failure. */
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const generate = useCallback(async (): Promise<Blob> => {
    if (!cardRef.current) throw new Error('The card is still rendering.');
    setStatus('working');
    setErrorText('');
    try {
      const blob = await renderCardToPng(cardRef.current);
      setStatus('idle');
      return blob;
    } catch (cause) {
      // Keep the real reason in the console for debugging, but show the user
      // something actionable — and they still have the caption below.
      console.error('[Applyce] share card export failed:', cause);
      setStatus('error');
      setErrorText(
        'We couldn’t build your card image — this browser blocked the export. Try again, or copy the caption below and add your own screenshot.',
      );
      throw new Error('Card export failed.');
    }
  }, []);

  const onDownload = async () => {
    try {
      const blob = await generate();
      downloadBlob(blob, filename);
      flash(`Saved ${filename}`);
    } catch {
      /* generate() already surfaced the message. */
    }
  };

  const onCopyImage = async () => {
    try {
      const blob = await generate();
      try {
        await copyImageToClipboard(blob);
        flash('Card copied — paste it straight into WhatsApp, LinkedIn, or X.');
      } catch {
        // Clipboard blocked (permissions, insecure context): fall back to a download.
        downloadBlob(blob, filename);
        flash('Your browser blocked image copying, so we saved the PNG instead.');
      }
    } catch {
      /* generate() already surfaced the message. */
    }
  };

  const onCopyCaption = async () => {
    try {
      await copyTextToClipboard(caption);
      setCaptionCopied(true);
      window.setTimeout(() => setCaptionCopied(false), 2600);
    } catch {
      flash('Copy is blocked in this browser — select the text and copy it by hand.');
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-lift sm:rounded-2xl"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <h2 id={titleId} className="text-base font-bold text-ink">
                  Share my result
                </h2>
                <p className="mt-0.5 text-xs text-ink-sec">
                  A {CARD_WIDTH}×{CARD_HEIGHT} card, ready for WhatsApp or LinkedIn.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close share panel"
                className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-sec transition-colors hover:bg-elevated hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-5" aria-busy={busy}>
              {/* Small inline preview — the same node the exporter rasterises. */}
              <div
                ref={boxRef}
                className="mx-auto w-full max-w-[300px] overflow-hidden rounded-xl border border-line"
                style={{ height: CARD_HEIGHT * scale }}
                aria-hidden="true"
              >
                <div
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <ShareResultCard data={data} cardRef={cardRef} />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 space-y-2.5">
                <Button className="w-full" onClick={onDownload} disabled={busy} aria-busy={busy}>
                  <Download size={15} />
                  {busy ? 'Preparing your card…' : 'Download card (PNG)'}
                </Button>

                {imageClipboard && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onCopyImage}
                    disabled={busy}
                  >
                    <ImageDown size={15} /> Copy image
                  </Button>
                )}
              </div>

              {/* Error + retry */}
              {status === 'error' && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/5 p-3.5">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-ink-sec">{errorText}</p>
                    <button
                      onClick={() => void onDownload()}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-strong hover:text-accent"
                    >
                      <Share2 size={13} /> Try again
                    </button>
                  </div>
                </div>
              )}

              {/* Caption */}
              <div className="mt-6 border-t border-line pt-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-sec">
                    Caption to paste
                  </h3>
                  <span className="text-[10px] tabular-nums text-ink-ter">
                    {caption.length} characters
                  </span>
                </div>
                <p className="rounded-xl border border-line bg-elevated/60 px-3.5 py-3 text-xs leading-relaxed text-ink-sec">
                  {caption}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2.5 w-full"
                  onClick={onCopyCaption}
                >
                  {captionCopied ? <Check size={14} /> : <Copy size={14} />}
                  {captionCopied ? 'Caption copied' : 'Copy caption'}
                </Button>
              </div>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-ter">
                Your card shows only what your own analysis returned. Images are generated in
                your browser — nothing is uploaded.
              </p>
            </div>

            {/* Transient confirmation, announced to screen readers. */}
            <p role="status" aria-live="polite" className="sr-only">
              {notice}
            </p>
            {notice && (
              <div className="border-t border-line bg-elevated/70 px-5 py-2.5 text-center text-xs font-medium text-ink">
                {notice}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
