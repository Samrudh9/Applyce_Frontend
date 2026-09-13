import type { CSSProperties } from 'react';

/**
 * LogoMark — the Applyce brand mark.
 *
 * Concept: "The Apex" — two ascending strokes (the career path) rise from the
 * baseline to a diamond point-of-arrival at the apex, forming an abstract "A".
 * The diamond doubles as a compass needle / target marker: find your path.
 *
 * Geometry is token-driven so it adapts to light/dark automatically:
 *   - tile  -> fill-accent   (Klein Blue in light, lifted Klein Blue in dark)
 *   - glyph -> fill/stroke-surface (canvas-white in light, near-ink on dark blue)
 *
 * Bars are 9/64 units (≈2.25px at a 16px favicon) — no fine strokes anywhere,
 * so the silhouette survives tiny sizes.
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

      {/* The Apex — two ascending strokes + crossbar (the path) */}
      <g
        transform="translate(0 6)"
        fill="none"
        strokeWidth={9}
        strokeLinecap="butt"
        className="stroke-surface"
      >
        <path d="M12 50 L29 14" />
        <path d="M52 50 L35 14" />
        <path d="M15.5 33.5 L48.5 33.5" />
      </g>

      {/* Point-of-arrival diamond (compass needle / target) */}
      <path
        transform="translate(0 6)"
        d="M32 2 L38 10.5 L32 16 L26 10.5 Z"
        className="fill-surface"
      />
    </svg>
  );
}