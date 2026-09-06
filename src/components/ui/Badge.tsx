import { ReactNode } from 'react';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

const tones: Record<Tone, string> = {
  success:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25',
  warning:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25',
  danger:
    'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/25',
  info: 'bg-accent-soft text-accent border-accent/15 dark:text-accent-strong',
  violet:
    'bg-burgundy-soft text-burgundy border-burgundy/15 dark:text-burgundy-strong',
  neutral: 'bg-elevated text-ink-sec border-line dark:text-ink-sec',
};

const dotColors: Record<Tone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-accent',
  violet: 'bg-burgundy',
  neutral: 'bg-ink-ter',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
  lg: 'px-3 py-1 text-sm',
};

export interface BadgeProps {
  tone?: Tone;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ tone = 'info', size = 'md', icon, children, className = '', dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[tone]}`} />}
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      {children}
    </span>
  );
}