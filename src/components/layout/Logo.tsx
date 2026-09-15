import { Link } from 'react-router-dom';
import { LogoMark } from '../brand/LogoMark';

/**
 * Applyce logo — brand mark + wordmark.
 * The mark uses semantic tokens (accent tile / surface glyph) so it adapts
 * cleanly to light & dark surfaces in the navbar, sidebar, login card,
 * footer, and landing.
 */
export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const markSize = size === 'sm' ? 24 : 28;
  const wordClass =
    size === 'sm' ? 'text-[14px] tracking-tight' : 'text-[15px] tracking-tight';

  return (
    <Link
      to="/"
      className="group inline-flex select-none items-center gap-2"
      aria-label="Applyce home"
    >
      <LogoMark
        size={markSize}
        className="shrink-0 transition-transform duration-200 group-hover:scale-[1.05]"
      />
      <span
        className={`font-bold text-ink ${wordClass}`}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        Applyce
      </span>
    </Link>
  );
}