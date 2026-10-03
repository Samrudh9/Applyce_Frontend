import { toPng } from 'html-to-image';
import type { AnalyzeResumeResponse } from '../types/api';

/* ──────────────────────────────────────────────────────────────
   Shareable result card — data, export, clipboard.

   Honesty rule: every number on the card comes from the analysis
   payload the user just generated. Nothing is hard-coded, estimated,
   or carried over from a previous session. If a field is missing from
   the payload, that block is DROPPED from the card rather than filled
   in with a placeholder — a fabricated "0%" or "50%" would be a lie
   the user then shares under their own name.

   Note on "84 career paths": the taxonomy really does hold 84 careers
   (dataset/careers_canonical.json, and the landing page says so), but
   the /api/analyze-resume payload carries no count of how many paths
   this particular analysis weighed. So the card deliberately does NOT
   claim it. Brand-wide proof belongs on the landing page; a share card
   should only state what that person's own analysis returned.
   ────────────────────────────────────────────────────────────── */

/** Logical card size — portrait 4:5, the WhatsApp / Instagram shape. */
export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;
/** 2× on a 1080×1350 base → a 2160×2700 PNG. */
export const CARD_PIXEL_RATIO = 2;

export const SITE_URL = 'applyce.tech';

export interface ShareCardData {
  /** `predictions[0].career` — the top career match. */
  career: string;
  /** `predictions[0].confidence` (0–100) — the fit score. */
  fitScore: number;
  /** Plain-language band derived from fitScore (thresholds below). */
  fitBand: string;
  /** ResultPage's ATS score (0–100), or null when the payload had none. */
  atsScore: number | null;
  /** `ats_data.keyword_score` (0–100), or null when the payload had none. */
  keywordScore: number | null;
  /** `estimated_salary` — already formatted, or null when absent. */
  salary: string | null;
  /** `skills.length` — how many skills the analysis detected. */
  skillCount: number;
  /** A few of `skills`, for the chip row. */
  skillPreview: string[];
}

const clampScore = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Plain-language bands for a fit score. Anchored on the same 80 / 60
 * thresholds ResultPage already uses for its own scoring copy, so the
 * card can never contradict the page it was generated from.
 */
function fitBandFor(score: number): string {
  if (score >= 80) return 'Strong fit';
  if (score >= 60) return 'Good fit';
  if (score >= 40) return 'Partial fit';
  return 'Low fit';
}

/** Same formatting the result page uses for its salary estimate. */
function formatSalary(salary: AnalyzeResumeResponse['estimated_salary']): string | null {
  const min = salary?.min;
  const max = salary?.max;
  if (typeof min !== 'number' || typeof max !== 'number') return null;
  const symbol = salary?.currency === 'INR' ? '₹' : '$';
  const one = (val: number) =>
    val >= 100000 ? `${symbol}${(val / 100000).toFixed(1)}L` : `${symbol}${val.toLocaleString()}`;
  return `${one(min)} – ${one(max)}`;
}

/**
 * Builds the card payload from a real analysis result.
 * `atsScore` / `keywordScore` are passed in because ResultPage already
 * resolves them from the several shapes the API uses — no re-parsing
 * here. Pass `null` when the payload genuinely had no such number, and
 * the matching block is left off the card.
 */
export function buildShareCardData(input: {
  result: AnalyzeResumeResponse;
  atsScore: number | null;
  keywordScore: number | null;
}): ShareCardData {
  const { result, atsScore, keywordScore } = input;
  const top = result.predictions?.[0];
  const skills = result.skills ?? [];
  const fitScore = clampScore(top?.confidence ?? 0);

  return {
    career: top?.career ?? 'Career match',
    fitScore,
    fitBand: fitBandFor(fitScore),
    atsScore: typeof atsScore === 'number' ? clampScore(atsScore) : null,
    keywordScore: typeof keywordScore === 'number' ? clampScore(keywordScore) : null,
    salary: formatSalary(result.estimated_salary),
    skillCount: skills.length,
    skillPreview: skills.slice(0, 5),
  };
}

/** The ready-to-paste caption. Every number in it is the user's real one. */
export function buildShareText(data: ShareCardData): string {
  const parts = [
    `I just analyzed my resume with Applyce — ${data.fitScore}/100 fit score for ${data.career}.`,
  ];
  if (data.atsScore !== null) parts.push(` ATS score ${data.atsScore}%.`);
  if (data.salary) parts.push(` Salary estimate ${data.salary}.`);
  return `${parts.join('')} AI career tools, from resume to offer → ${SITE_URL}`;
}

/** PNG filename, slugged from the real career match. */
export function cardFileName(data: ShareCardData): string {
  const slug = data.career.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `applyce-${slug || 'result'}.png`;
}

/* ── Export ─────────────────────────────────────────────────── */

/**
 * Renders the card node to a PNG blob.
 *
 * The node is always the true 1080×1350 logical card; the in-app
 * preview only scales it with a transform on a *parent*, so the
 * exported pixels are pixel-for-pixel what the preview shows.
 *
 * Fonts: html-to-image rasterises through an SVG `foreignObject` loaded
 * as an `<img>`, an isolated context that cannot see the page's own
 * `@font-face` rules. With `skipFonts` it inlines the matching webfont
 * rules (fetched, then base64'd) into the clone instead, so Inter is
 * really used in the PNG and the export matches the preview. Google
 * Fonts serves CORS headers, and inlining as data URLs keeps the canvas
 * untainted. If that fetch fails the export degrades to a fallback
 * system font rather than failing outright — which is why the card is
 * sized with generous slack rather than tight fitting.
 */
export async function renderCardToPng(cardNode: HTMLElement): Promise<Blob> {
  // Inter must be resolved before we snapshot, or the first export of the
  // session would silently render in the fallback face.
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      /* font loading API unavailable — the export still works */
    }
  }

  const backgroundColor = getComputedStyle(cardNode).backgroundColor || '#ffffff';

  const dataUrl = await toPng(cardNode, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    pixelRatio: CARD_PIXEL_RATIO,
    backgroundColor,
  });

  const blob = await (await fetch(dataUrl)).blob();
  if (!blob.type.includes('png')) throw new Error('Card export returned a non-PNG blob.');
  return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Give the browser a tick to start the download before releasing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ── Clipboard ──────────────────────────────────────────────── */

/** Feature-detects image clipboard write. Optimistic when `supports` is missing (Safari). */
export function canCopyImages(): boolean {
  if (typeof navigator === 'undefined' || !navigator.clipboard) return false;
  if (typeof ClipboardItem === 'undefined') return false;
  if (typeof ClipboardItem.supports !== 'function') return true;
  try {
    return ClipboardItem.supports('image/png');
  } catch {
    return false;
  }
}

/** Copies a PNG blob to the clipboard. Throws so callers can fall back to a download. */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  if (!canCopyImages()) throw new Error('Image clipboard is not available in this browser.');
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

/** Copies plain text, with an execCommand fallback for insecure contexts. */
export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  if (!ok) throw new Error('Copy is not available in this browser.');
}