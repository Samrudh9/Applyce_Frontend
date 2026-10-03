import { LogoMark } from '../brand/LogoMark';
import { CARD_HEIGHT, CARD_WIDTH, SITE_URL, type ShareCardData } from '../../lib/share';

/**
 * ShareResultCard — the branded, shareable result card.
 *
 * Rendered at a fixed 1080×1350 (portrait 4:5 — the WhatsApp / Instagram
 * shape) and scaled down by a *parent* wrapper for the in-app preview, so
 * the exported PNG is exactly what the user saw on screen.
 *
 * Design rules for this card:
 *   - Flat fills only. No gradients, no glow, no shadows.
 *   - Light surface in every theme (see `.share-card` in index.css), so a
 *     dark-mode reader shares the same card everyone else sees.
 *   - Zero animation. html-to-image captures whatever the DOM looks like at
 *     that instant, so an in-flight framer-motion transition would bake a
 *     half-finished state into the PNG.
 *   - Everything on it is either real analysis data or live brand copy.
 *   - A block whose data the analysis never returned is not rendered at all.
 */

/** Inner content width (1080 − 84 padding each side). */
const CONTENT_WIDTH = CARD_WIDTH - 168;

/**
 * Career names in the 84-career taxonomy run long — the longest is
 * "Business Development Representative". Pinning one fixed size would clip
 * it (and would clip harder still if the PNG fell back to a wider system
 * font), so the type size is *derived* from the real content width and the
 * name's length instead. Result: a long name steps down a little and wraps
 * to a second line, which there is ~160px of vertical slack for.
 *
 * 0.52em is a conservative average advance width for Inter Bold mixed-case.
 */
const CAREER_MAX_SIZE = 88;
const CAREER_MIN_SIZE = 56;

function careerFontSize(career: string): number {
  const fit = Math.floor(CONTENT_WIDTH / (Math.max(career.length, 1) * 0.52));
  return Math.max(CAREER_MIN_SIZE, Math.min(CAREER_MAX_SIZE, fit));
}

function FlatBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[28px] font-medium text-ink-sec">{label}</span>
        <span className="text-[32px] font-bold tabular-nums text-ink">{pct}%</span>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-elevated">
        <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-8">
      <p className="text-[22px] font-semibold uppercase tracking-[0.16em] text-ink-ter">{label}</p>
      <p className="mt-3 text-[38px] font-bold leading-tight text-ink">{value}</p>
    </div>
  );
}

export function ShareResultCard({
  data,
  cardRef,
}: {
  data: ShareCardData;
  /** Points at the exact node the exporter rasterises. */
  cardRef?: React.Ref<HTMLElement>;
}) {
  const bars = [
    data.atsScore !== null ? { label: 'ATS score', value: data.atsScore } : null,
    data.keywordScore !== null ? { label: 'Keywords matched', value: data.keywordScore } : null,
  ].filter((b): b is { label: string; value: number } => b !== null);

  const stats = [
    data.salary ? { label: 'Salary estimate', value: data.salary } : null,
    data.skillCount > 0 ? { label: 'Skills detected', value: String(data.skillCount) } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  return (
    <article
      ref={cardRef}
      className="share-card relative flex flex-col overflow-hidden bg-surface text-ink"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
      aria-label={`Applyce result: ${data.career}, ${data.fitScore} out of 100 fit score${
        data.atsScore !== null ? `, ATS score ${data.atsScore}%` : ''
      }`}
    >
      {/* Full-bleed accent rail — the one piece of brand color at the top. */}
      <div className="h-2 w-full shrink-0 bg-accent" />

      <div className="flex flex-1 flex-col p-[84px]">
        {/* ── Brand ── */}
        <header className="flex items-center gap-4">
          <LogoMark size={68} />
          <span className="text-[46px] font-bold tracking-tight text-ink">Applyce</span>
          <span className="ml-auto text-[24px] font-medium uppercase tracking-[0.18em] text-ink-ter">
            Resume analysis
          </span>
        </header>
        <div className="mt-10 h-px w-full bg-line" />

        {/* ── Career match ── */}
        <div className="mt-12">
          <p className="text-[26px] font-semibold uppercase tracking-[0.18em] text-ink-sec">
            Your career match
          </p>
          <h1
            className="mt-5 break-words font-bold leading-[1.04] tracking-tight text-ink"
            style={{ fontSize: careerFontSize(data.career) }}
          >
            {data.career}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center rounded-full bg-accent px-8 py-3.5 text-[30px] font-semibold text-white">
              {data.fitBand}
            </span>
            <span className="text-[38px] font-bold text-ink">
              <span className="tabular-nums">{data.fitScore}</span>
              <span className="font-medium text-ink-sec">/100 fit score</span>
            </span>
          </div>
        </div>

        {/* ── Scores (only what the analysis actually returned) ── */}
        {bars.length > 0 && (
          <div className={`${bars.length > 1 ? 'space-y-9' : ''} mt-12`}>
            {bars.map((bar) => (
              <FlatBar key={bar.label} label={bar.label} value={bar.value} />
            ))}
          </div>
        )}

        {/* ── Stat blocks ── */}
        {stats.length > 0 && (
          <div
            className={`mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line ${
              stats.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {stats.map((stat) => (
              <StatBlock key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        )}

        {/* ── A few of the detected skills ── */}
        {data.skillPreview.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {data.skillPreview.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-elevated px-5 py-2 text-[24px] font-medium text-ink-sec"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="mt-auto pt-12">
          <div className="h-px w-full bg-line" />
          <p className="mt-7 text-[27px] leading-snug text-ink-sec">
            AI career tools — <span className="font-semibold text-ink">from resume to offer</span>
            <span className="text-ink-ter"> · {SITE_URL}</span>
          </p>
        </footer>
      </div>
    </article>
  );
}