import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  value: number;
  colorClass?: string;
  height?: number | string;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  colorClass = 'from-mint to-emerald-400',
  height = 'h-2.5',
  showValue,
  label,
  animated = true,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const safe = Math.max(0, Math.min(100, value));
  const heightClass = typeof height === 'string' ? height : '';

  return (
    <div ref={ref} className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="text-text font-medium">{label}</span>}
          {showValue && <span className="tabular-nums text-muted">{safe}%</span>}
        </div>
      )}
      <div className={`${heightClass} w-full overflow-hidden rounded-full bg-slate-100`} style={typeof height === 'number' ? { height: `${height}px` } : undefined}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
          initial={{ width: 0 }}
          animate={animated && isInView ? { width: `${safe}%` } : { width: `${safe}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}
