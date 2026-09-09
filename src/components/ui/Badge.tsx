import { ReactNode } from 'react';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

const tones: Record<Tone, string> = {
  success:
    'bg-success/10 text-success border-success/25',
  warning:
    'bg-warning/10 text-warning border-warning/25',
  danger:
    'bg-danger/10 text-danger border-danger/25',
  info: 'bg-accent-soft text-accent border-accent/15 dark:text-accent-strong',
  violet:
    'bg-burgundy-soft text-burgundy border-burgundy/15 dark:text-burgundy-strong',
  neutral: 'bg-elevated text-ink-sec border-line dark:text-ink-sec',
};

const dotColors: Record<Tone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
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