import { ReactNode } from 'react';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

const tones: Record<Tone, string> = {
  success: 'bg-success/10 text-success border-success/25',
  warning: 'bg-warning/10 text-warning border-warning/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
  info: 'bg-cyan/10 text-cyan border-cyan/25',
  violet: 'bg-violet/10 text-violet border-violet/25',
  neutral: 'bg-parchment/5 text-stone border-parchment/10',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
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
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${tones[tone]} ${sizes[size]} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${tone === 'success' ? 'bg-success' : tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : tone === 'violet' ? 'bg-violet' : 'bg-cyan'}`} />}
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      {children}
    </span>
  );
}
