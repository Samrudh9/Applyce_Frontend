import type { CSSProperties } from 'react';

/**
 * LogoMark — the Applyce brand mark.
 *
 * Concept: a flat orange tile with three ascending bars (the career ladder).
 * The bars climb left-to-right — growth, progress, applying upward — and read
 * as a simple, honest "levels" glyph for a job-hunt utility. No gradients,
 * no glass, no text shadows: it survives favicon sizes.
 *
 * Geometry is token-driven so it adapts to light/dark automatically:
 *   - tile  -> fill-accent   (Talentd orange in light, lifted orange in dark)
 *   - glyph -> fill-surface  (white on orange)
 *
 * Bars are 8/64 units wide (2px at a 16px favicon) with 4/64 gaps — no fine
 * strokes anywhere, so the silhouette stays legible at tiny sizes.
 */
export function LogoMark({
  size = 28,
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {/* Rounded-square tile */}
      <rect width="64" height="64" rx="16" className="fill-accent" />

      {/* Ascending bars — the career ladder */}
      <g className="fill-surface">
        <rect x="16" y="40" width="8" height="16" rx="2.5" />
        <rect x="28" y="30" width="8" height="26" rx="2.5" />
        <rect x="40" y="20" width="8" height="36" rx="2.5" />
      </g>
    </svg>
  );
}