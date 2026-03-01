import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trailColor?: string;
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  value,
  size = 160,
  strokeWidth = 10,
  color = '#f0a03c',
  trailColor = 'rgba(232, 224, 212, 0.08)',
  className = '',
  label,
  children,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trailColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <>
            <span className="font-display text-3xl font-semibold" style={{ color }}>{value}</span>
            {label && <span className="text-xs text-muted">{label}</span>}
          </>
        )}
      </div>
    </div>
  );
}
