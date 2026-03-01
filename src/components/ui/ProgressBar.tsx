import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  value: number;
  colorClass?: string;
  height?: number | string;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
};

export function ProgressBar({
  value,
  colorClass = 'from-cyan to-mint',
  height = 'h-2.5',
  showValue,
  label,
  animated = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const safe = Math.max(0, Math.min(100, value));
  const heightStyle = typeof height === 'number' ? undefined : undefined;
  const heightClass = typeof height === 'string' ? height : '';

  return (
    <div ref={ref}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="text-text">{label}</span>}
          {showValue && <span className="tabular-nums text-muted">{safe}%</span>}
        </div>
      )}
      <div className={`${heightClass} w-full overflow-hidden rounded-full bg-parchment/[0.06]`} style={typeof height === 'number' ? { height: `${height}px` } : undefined}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
          initial={{ width: 0 }}
          animate={animated && isInView ? { width: `${safe}%` } : { width: `${safe}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ boxShadow: '0 0 12px rgba(240, 160, 60, 0.15)' }}
        />
      </div>
    </div>
  );
}
